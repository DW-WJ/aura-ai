'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Config {
  id: string;
  name: string;
  statsJson: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsData {
  totalEvents: number;
  eventCounts: Record<string, number>;
  configCount: number;
  recentConfigs: Config[];
  period: string;
}

const EVENT_LABELS: Record<string, string> = {
  quiz_started: '开始测评',
  quiz_completed: '完成测评',
  ai_enhance_started: 'AI 增强',
  ai_enhance_completed: 'AI 增强完成',
  config_copied: '复制配置',
  config_downloaded: '下载配置',
  quiz_restarted: '重新测评',
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'stats'>('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, configsRes] = await Promise.all([
          fetch(`/api/analytics?period=${period}`),
          fetch('/api/configs'),
        ]);
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        if (configsRes.ok) {
          const data = await configsRes.json();
          setConfigs(data.configs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, period]);

  const deleteConfig = async (id: string) => {
    if (!confirm('确定删除这个配置吗？')) return;
    const res = await fetch(`/api/configs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfigs(prev => prev.filter(c => c.id !== id));
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-[#6b6b8a] text-sm animate-pulse">加载中…</div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 py-4">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-bold text-white">AURA</span>
            </Link>
            <span className="text-[#4a4a6a]">/</span>
            <span className="text-[#9090b0] text-sm">控制台</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-white font-medium">{user?.name}</div>
              <div className="text-xs text-[#6b6b8a]">{user?.email}</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-transparent border border-white/[0.08] rounded-lg px-3 py-1.5
                text-xs text-[#6b6b8a] cursor-pointer hover:text-white hover:border-white/[0.2] transition-all"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            你好，{user?.name?.split(' ')[0] || '用户'} 👋
          </h1>
          <p className="text-[#6b6b8a] text-sm">管理你的 AI 人格配置和使用统计</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '保存的配置', value: configs.length, icon: '📁', color: '#8b5cf6' },
            { label: '完成测评', value: analytics?.eventCounts?.quiz_completed || 0, icon: '✅', color: '#10b981' },
            { label: 'AI 增强次数', value: analytics?.eventCounts?.ai_enhance_completed || 0, icon: '✨', color: '#06b6d4' },
            { label: '复制配置', value: analytics?.eventCounts?.config_copied || 0, icon: '📋', color: '#ec4899' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-5">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs text-[#6b6b8a] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { id: 'overview', label: '概览' },
            { id: 'configs', label: `我的配置 (${configs.length})` },
            { id: 'stats', label: '使用统计' },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
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
            <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#9090b0] uppercase tracking-widest mb-4">快速操作</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/"
                  className="flex items-center gap-3 bg-gradient-to-r from-[#8b5cf6]/10 to-[#6366f1]/10
                    border border-[#8b5cf6]/20 rounded-xl p-4 hover:border-[#8b5cf6]/50 transition-all">
                  <span className="text-2xl">✦</span>
                  <div>
                    <div className="font-medium text-white text-sm">开始新测评</div>
                    <div className="text-xs text-[#6b6b8a]">生成新的 AI 人格配置</div>
                  </div>
                </Link>
                <button
                  onClick={() => setActiveTab('configs')}
                  className="flex items-center gap-3 bg-[#080810] border border-white/[0.06]
                    rounded-xl p-4 hover:border-white/[0.15] transition-all text-left cursor-pointer">
                  <span className="text-2xl">📁</span>
                  <div>
                    <div className="font-medium text-white text-sm">查看配置</div>
                    <div className="text-xs text-[#6b6b8a]">管理已保存的配置</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent configs */}
            {configs.length > 0 && (
              <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-[#9090b0] uppercase tracking-widest mb-4">最近配置</h2>
                <div className="space-y-2">
                  {configs.slice(0, 3).map(config => (
                    <div key={config.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <div>
                        <div className="text-sm text-white font-medium">{config.name}</div>
                        <div className="text-xs text-[#6b6b8a]">
                          {new Date(config.updatedAt).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                      {config.isPublic && (
                        <span className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-full">公开</span>
                      )}
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
            {configs.length === 0 ? (
              <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">📭</div>
                <div className="text-[#6b6b8a] mb-4">还没有保存的配置</div>
                <Link href="/"
                  className="inline-block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white
                    px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                  去生成配置
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {configs.map(config => (
                  <div key={config.id}
                    className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-5
                      hover:border-[rgba(139,92,246,0.3)] transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{config.name}</h3>
                          {config.isPublic && (
                            <span className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-full flex-shrink-0">公开</span>
                          )}
                        </div>
                        <div className="text-xs text-[#6b6b8a]">
                          更新于 {new Date(config.updatedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => deleteConfig(config.id)}
                          className="text-xs text-[#6b6b8a] hover:text-[#f87171] transition-colors cursor-pointer px-2 py-1"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Stats ── */}
        {activeTab === 'stats' && (
          <div className="animate-in fade-in duration-300 space-y-4">
            {/* Period selector */}
            <div className="flex gap-2">
              {[
                { value: '7d', label: '近 7 天' },
                { value: '30d', label: '近 30 天' },
                { value: 'all', label: '全部' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setPeriod(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all border
                    ${period === value
                      ? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50 text-[#a78bfa]'
                      : 'bg-transparent border-white/[0.06] text-[#6b6b8a] hover:text-white'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Event breakdown */}
            <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#9090b0] uppercase tracking-widest mb-5">行为统计</h2>
              {analytics && Object.keys(analytics.eventCounts).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(analytics.eventCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([event, count]) => {
                      const max = Math.max(...Object.values(analytics.eventCounts));
                      const pct = (count / max) * 100;
                      return (
                        <div key={event} className="flex items-center gap-3">
                          <div className="text-xs text-[#9090b0] w-[100px] flex-shrink-0">
                            {EVENT_LABELS[event] || event}
                          </div>
                          <div className="flex-1 h-[6px] bg-[#13131f] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-xs text-[#6b6b8a] w-[24px] text-right flex-shrink-0">{count}</div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-[#6b6b8a] text-sm text-center py-6">
                  暂无统计数据
                </div>
              )}
            </div>

            <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#9090b0] uppercase tracking-widest">总事件数</h2>
                <span className="text-2xl font-bold text-[#8b5cf6]">{analytics?.totalEvents || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
