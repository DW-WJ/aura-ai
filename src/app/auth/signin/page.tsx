'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Register
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || '注册失败');
          return;
        }

        setSuccess('注册成功！正在登录…');
        // Auto sign in after register
        const result = await signIn('credentials', {
          email, password, redirect: false,
        });
        if (result?.ok) {
          router.push('/dashboard');
        }
      } else {
        // Sign in
        const result = await signIn('credentials', {
          email, password, redirect: false,
        });

        if (result?.error) {
          setError('邮箱或密码错误');
          return;
        }

        router.push('/dashboard');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-bold text-xl text-white">AURA</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === 'signin' ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-[#6b6b8a] text-sm">
            {mode === 'signin' ? '登录以保存和管理你的 AI 配置' : '注册后可保存多个 AI 人格配置'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0e0e1a] border border-white/[0.08] rounded-2xl p-8">

          {/* Mode toggle */}
          <div className="flex bg-[#080810] rounded-xl p-1 mb-6">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${mode === m
                    ? 'bg-[#8b5cf6] text-white shadow-sm'
                    : 'text-[#6b6b8a] hover:text-white'
                  }`}
              >
                {m === 'signin' ? '登录' : '注册'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-[#9090b0] mb-1.5">昵称（可选）</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="你的名字"
                  className="w-full bg-[#080810] border border-white/[0.1] rounded-xl px-4 py-3
                    text-white placeholder-[#4a4a6a] text-sm
                    focus:outline-none focus:border-[#8b5cf6] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-[#9090b0] mb-1.5">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-[#080810] border border-white/[0.1] rounded-xl px-4 py-3
                  text-white placeholder-[#4a4a6a] text-sm
                  focus:outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#9090b0] mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? '至少 8 位' : '输入密码'}
                required
                minLength={mode === 'signup' ? 8 : 1}
                className="w-full bg-[#080810] border border-white/[0.1] rounded-xl px-4 py-3
                  text-white placeholder-[#4a4a6a] text-sm
                  focus:outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>

            {/* Error / Success */}
            {error && (
              <div className="bg-[#f87171]/10 border border-[#f87171]/30 rounded-xl px-4 py-3 text-[#f87171] text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl px-4 py-3 text-[#10b981] text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white
                py-3 rounded-xl font-semibold text-sm cursor-pointer
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(139,92,246,0.4)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? '处理中…' : mode === 'signin' ? '登录' : '注册'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[#4a4a6a] text-xs">或</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full bg-transparent border border-white/[0.1] rounded-xl py-3
              text-[#9090b0] text-sm font-medium cursor-pointer
              transition-all duration-200 hover:border-white/[0.2] hover:text-white
              flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 登录
          </button>
        </div>

        <p className="text-center text-[#4a4a6a] text-xs mt-6">
          继续即表示你同意我们的
          <Link href="/about" className="text-[#8b5cf6] hover:underline mx-1">服务条款</Link>
          和
          <Link href="/about" className="text-[#8b5cf6] hover:underline mx-1">隐私政策</Link>
        </p>
      </div>
    </div>
  );
}
