'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  configCount: number;
  memberCount: number;
  joinedAt: string;
  createdAt: string;
}

interface Config {
  id: string;
  name: string;
  statsJson: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  id: string;
  role: string;
  joinedAt: string;
  user: { id: string; name: string | null; email: string; image: string | null };
}

const ROLE_LABELS: Record<string, string> = { owner: '所有者', admin: '管理员', member: '成员' };
const PLAN_LABELS: Record<string, string> = { free: '免费版', pro: '专业版' };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Workspace state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [showCreateWs, setShowCreateWs] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [creatingWs, setCreatingWs] = useState(false);

  // Config state
  const [configs, setConfigs] = useState<Config[]>([]);
  const [configsLoading, setConfigsLoading] = useState(false);

  // Members state
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'members'>('overview');
  const [period, setPeriod] = useState('7d');

  // Stats
  const [analytics, setAnalytics] = useState<{ totalEvents: number; eventCounts: Record<string, number> } | null>(null);

  // Redirect to signin
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  // Fetch workspaces on load
  useEffect(() => {
    if (status !== 'authenticated') return;
    fetchWorkspaces();
  }, [status]);

  // Fetch configs + analytics when workspace changes
  useEffect(() => {
    if (!currentWorkspace) return;
    fetchConfigs();
    fetchAnalytics();
  }, [currentWorkspace?.id]);

  // Fetch members when tab switches
  useEffect(() => {
    if (activeTab === 'members' && currentWorkspace) fetchMembers();
  }, [activeTab, currentWorkspace?.id]);

  // ─── Data fetchers ───────────────────────────────────────────────

  const fetchWorkspaces = async () => {
    const res = await fetch('/api/workspaces');
    if (res.ok) {
      const data = await res.json();
      setWorkspaces(data.workspaces || []);
      // auto-select first workspace if none selected
      if (data.workspaces?.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(data.workspaces[0]);
      }
    }
  };

  const fetchConfigs = async () => {
    if (!currentWorkspace) return;
    setConfigsLoading(true);
    try {
      const res = await fetch('/api/configs', {
        headers: { 'x-workspace-id': currentWorkspace.id },
      });
      if (res.ok) {
        const data = await res.json();
        setConfigs(data.configs || []);
      }
    } finally {
      setConfigsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!currentWorkspace) return;
    const res = await fetch(`/api/analytics?period=${period}`);
    if (res.ok) setAnalytics(await res.json());
  };

  const fetchMembers = async () => {
    if (!currentWorkspace) return;
    setMembersLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${currentWorkspace.id}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } finally {
      setMembersLoading(false);
    }
  };

  // ─── Actions ────────────────────────────────────────────────────

  const createWorkspace = async () => {
    if (!newWsName.trim()) return;
    setCreatingWs(true);
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWsName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowCreateWs(false);
        setNewWsName('');
        await fetchWorkspaces();
        // Switch to new workspace
        const updated = [...workspaces, data.workspace];
        setCurrentWorkspace(data.workspace);
      }
    } finally {
      setCreatingWs(false);
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !currentWorkspace) return;
    setInviting(true);
    try {
      const res = await fetch(`/api/workspaces/${currentWorkspace.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      if (res.ok) {
        setInviteEmail('');
        setShowInvite(false);
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.error || '邀请失败');
      }
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('确定移除该成员吗？')) return;
    const res = await fetch(
      `/api/workspaces/${currentWorkspace?.id}/members?memberId=${memberId}`,
      { method: 'DELETE' }
    );
    if (res.ok) fetchMembers();
  };

  const deleteConfig = async (id: string) => {
    if (!confirm('确定删除这个配置吗？')) return;
    const res = await fetch(`/api/configs/${id}`, {
      method: 'DELETE',
      headers: { 'x-workspace-id': currentWorkspace?.id || '' },
    });
    if (res.ok) setConfigs(prev => prev.filter(c => c.id !== id));
  };

  // ─── Render ─────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-[#6b6b8a] text-sm animate-pulse">加载中…</div>
      </div>
    );
  }
  if (!session) return null;

  const user = session.user;
  const isAdmin = currentWorkspace?.role === 'owner' || currentWorkspace?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* ── Header ── */}
      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="max-w-[960px] mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-white">AURA</span>
          </Link>

          {/* Workspace switcher */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <select
              value={currentWorkspace?.id || ''}
              onChange={e => {
                const ws = workspaces.find(w => w.id === e.target.value);
                if (ws) setCurrentWorkspace(ws);
              }}
              className="bg-[#0e0e1a] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-white cursor-pointer focus:outline-none focus:border-[#8b5cf6] max-w-[200px]"
            >
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowCreateWs(true)}
              className="text-[#6b6b8a] hover:text-white transition-colors cursor-pointer text-xs"
              title="新建工作空间"
            >
              ＋ 新建
            </button>

            {currentWorkspace && (
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
                ${currentWorkspace.plan === 'pro' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-white/[0.05] text-[#6b6b8a]'}`}>
                {PLAN_LABELS[currentWorkspace.plan] || currentWorkspace.plan}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-white font-medium">{user?.name}</div>
              <div className="text-xs text-[#6b6b8a]">{user?.email}</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-transparent border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-[#6b6b8a] cursor-pointer hover:text-white hover:border-white/[0.2] transition-all"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {currentWorkspace ? currentWorkspace.name : '加载中…'} 👋
            </h1>
            <p className="text-[#6b6b8a] text-sm">
              {currentWorkspace
                ? `${ROLE_LABELS[currentWorkspace.role] || currentWorkspace.role} · ${currentWorkspace.memberCount} 位成员 · ${currentWorkspace.configCount} 个配置`
                : '管理你的 AI 人格配置'}
            </p>
          </div>
          <Link href="/"
            className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 hover:shadow-lg transition-all">
            开始测评
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: '概览' },
            { id: 'configs', label: `配置 (${configs.length})` },
            { id: 'members', label: `成员 (${currentWorkspace?.memberCount || 0})` },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-sm cursor-pointer transition-all duration-200 border
                ${activeTab === id
                  ? 'bg-[#0e0e1a] border-[#8b5cf6] text-white'
                  : 'bg-transparent border-white/[0.06] text-[#6b6b8a] hover:text-white hover:border-white/[0.15]'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '保存的配置', value: configs.length, icon: '📁', color: '#8b5cf6' },
                { label: '完成测评', value: analytics?.eventCounts?.quiz_completed || 0, icon: '✅', color: '#10b981' },
                { label: 'AI 增强', value: analytics?.eventCounts?.ai_enhance_completed || 0, icon: '✨', color: '#06b6d4' },
                { label: '成员数', value: currentWorkspace?.memberCount || 0, icon: '👥', color: '#ec4899' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-5">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                  <div className="text-xs text-[#6b6b8a] mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Recent configs */}
            {configs.length > 0 && (
              <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#9090b0] uppercase tracking-widest">最近配置</h2>
                  <button onClick={() => setActiveTab('configs')} className="text-xs text-[#8b5cf6] cursor-pointer hover:underline">查看全部</button>
                </div>
                <div className="space-y-2">
                  {configs.slice(0, 3).map(config => (
                    <div key={config.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <div>
                        <div className="text-sm text-white font-medium">{config.name}</div>
                        <div className="text-xs text-[#6b6b8a]">{new Date(config.updatedAt).toLocaleDateString('zh-CN')}</div>
                      </div>
                      {config.isPublic && <span className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-full">公开</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Configs ── */}
        {activeTab === 'configs' && (
          <div className="animate-in fade-in duration-300">
            {configsLoading ? (
              <div className="text-center py-12 text-[#6b6b8a]">加载中…</div>
            ) : configs.length === 0 ? (
              <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">📭</div>
                <div className="text-[#6b6b8a] mb-4">此工作空间还没有保存的配置</div>
                <Link href="/" className="inline-block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">去生成配置</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {configs.map(config => (
                  <div key={config.id}
                    className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-5 hover:border-[rgba(139,92,246,0.3)] transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{config.name}</h3>
                          {config.isPublic && <span className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-full flex-shrink-0">公开</span>}
                        </div>
                        <div className="text-xs text-[#6b6b8a]">
                          更新于 {new Date(config.updatedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <button onClick={() => deleteConfig(config.id)}
                        className="text-xs text-[#6b6b8a] hover:text-[#f87171] transition-colors cursor-pointer px-2 py-1">
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Members ── */}
        {activeTab === 'members' && (
          <div className="animate-in fade-in duration-300">
            {/* Invite button */}
            <div className="flex justify-end mb-4">
              {isAdmin && (
                <button
                  onClick={() => setShowInvite(v => !v)}
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:shadow-lg transition-all"
                >
                  邀请成员
                </button>
              )}
            </div>

            {/* Invite form */}
            {showInvite && (
              <div className="bg-[#0e0e1a] border border-[#8b5cf6]/30 rounded-2xl p-5 mb-4 space-y-3">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="被邀请人邮箱"
                    className="flex-1 bg-[#080810] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4a4a6a] focus:outline-none focus:border-[#8b5cf6]"
                  />
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="bg-[#080810] border border-white/[0.1] rounded-xl px-3 py-2.5 text-white text-sm cursor-pointer focus:outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="member">成员</option>
                    <option value="admin">管理员</option>
                  </select>
                  <button
                    onClick={inviteMember}
                    disabled={inviting}
                    className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {inviting ? '邀请中…' : '发送邀请'}
                  </button>
                </div>
              </div>
            )}

            {/* Member list */}
            {membersLoading ? (
              <div className="text-center py-12 text-[#6b6b8a]">加载中…</div>
            ) : (
              <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl overflow-hidden">
                {members.map((member, i) => (
                  <div key={member.id}
                    className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {member.user.name?.[0] || member.user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">{member.user.name || member.user.email.split('@')[0]}</div>
                        <div className="text-xs text-[#6b6b8a]">{member.user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${member.role === 'owner' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                          member.role === 'admin' ? 'bg-[#8b5cf6]/10 text-[#a78bfa]' : 'bg-white/[0.05] text-[#6b6b8a]'}`}>
                        {ROLE_LABELS[member.role] || member.role}
                      </span>
                      {member.role !== 'owner' && isAdmin && (
                        <button
                          onClick={() => removeMember(member.user.id)}
                          className="text-xs text-[#6b6b8a] hover:text-[#f87171] cursor-pointer transition-colors"
                        >
                          移除
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create Workspace Modal ── */}
      {showCreateWs && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={e => { if (e.target === e.currentTarget) setShowCreateWs(false); }}>
          <div className="bg-[#0e0e1a] border border-white/[0.1] rounded-2xl p-8 w-full max-w-[420px]">
            <h2 className="text-xl font-bold text-white mb-6">新建工作空间</h2>
            <div className="mb-6">
              <label className="block text-sm text-[#9090b0] mb-1.5">工作空间名称</label>
              <input
                type="text"
                value={newWsName}
                onChange={e => setNewWsName(e.target.value)}
                placeholder="例如：团队项目、个人收藏"
                className="w-full bg-[#080810] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder-[#4a4a6a] focus:outline-none focus:border-[#8b5cf6]"
                onKeyDown={e => e.key === 'Enter' && createWorkspace()}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCreateWs(false)}
                className="flex-1 bg-transparent border border-white/[0.08] text-[#9090b0] py-3 rounded-xl text-sm cursor-pointer hover:text-white transition-colors">
                取消
              </button>
              <button onClick={createWorkspace} disabled={creatingWs || !newWsName.trim()}
                className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white py-3 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50">
                {creatingWs ? '创建中…' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
