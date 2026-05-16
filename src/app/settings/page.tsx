'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Password
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMessage, setPwdMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        await update({ name: name.trim() });
        setMessage('昵称已更新');
      } else {
        const data = await res.json();
        setMessage(data.error || '更新失败');
      }
    } catch {
      setMessage('网络错误');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPwd || !newPwd || !confirmPwd) {
      setPwdMessage('请填写所有字段');
      return;
    }
    if (newPwd.length < 6) {
      setPwdMessage('新密码至少 6 位');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMessage('两次输入的新密码不一致');
      return;
    }
    setPwdSaving(true);
    setPwdMessage('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd }),
      });
      if (res.ok) {
        setPwdMessage('密码已更新');
        setOldPwd('');
        setNewPwd('');
        setConfirmPwd('');
      } else {
        const data = await res.json();
        setPwdMessage(data.error || '修改失败');
      }
    } catch {
      setPwdMessage('网络错误');
    } finally {
      setPwdSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-[#6b6b8a] text-sm animate-pulse">加载中…</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="max-w-[600px] mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-white">AURA</span>
          </Link>
          <span className="text-[#6b6b8a]">/</span>
          <span className="text-sm text-white">个人设置</span>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold">个人设置 ⚙️</h1>

        {/* Profile */}
        <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[#9090b0] uppercase tracking-widest">个人信息</h2>

          {/* Avatar placeholder */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="text-white font-medium">{session.user?.name || '未设置昵称'}</div>
              <div className="text-sm text-[#6b6b8a]">{session.user?.email}</div>
            </div>
          </div>

          {/* Name edit */}
          <div>
            <label className="block text-sm text-[#9090b0] mb-1.5">昵称</label>
            <div className="flex gap-3">
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="flex-1 bg-[#080810] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
                onKeyDown={e => e.key === 'Enter' && handleUpdateName()} />
              <button onClick={handleUpdateName} disabled={saving}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 hover:shadow-lg transition-all">
                {saving ? '…' : '保存'}
              </button>
            </div>
            {message && (
              <div className={`text-xs mt-2 ${message === '昵称已更新' ? 'text-[#10b981]' : 'text-[#f87171]'}`}>{message}</div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[#9090b0] uppercase tracking-widest">修改密码</h2>

          <div>
            <label className="block text-sm text-[#9090b0] mb-1.5">当前密码</label>
            <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)}
              className="w-full bg-[#080810] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8b5cf6]" />
          </div>

          <div>
            <label className="block text-sm text-[#9090b0] mb-1.5">新密码</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
              className="w-full bg-[#080810] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8b5cf6]" />
          </div>

          <div>
            <label className="block text-sm text-[#9090b0] mb-1.5">确认新密码</label>
            <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
              className="w-full bg-[#080810] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
              onKeyDown={e => e.key === 'Enter' && handleChangePassword()} />
          </div>

          <button onClick={handleChangePassword} disabled={pwdSaving}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 hover:shadow-lg transition-all">
            {pwdSaving ? '修改中…' : '修改密码'}
          </button>

          {pwdMessage && (
            <div className={`text-xs ${pwdMessage === '密码已更新' ? 'text-[#10b981]' : 'text-[#f87171]'}`}>{pwdMessage}</div>
          )}
        </div>

        {/* Danger zone */}
        <div className="bg-[#0e0e1a] border border-[#f87171]/20 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#f87171] uppercase tracking-widest mb-4">危险操作</h2>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-transparent border border-[#f87171]/30 text-[#f87171] px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-[#f87171]/10 transition-all">
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
