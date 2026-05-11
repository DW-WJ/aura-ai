'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const links: Array<{ href: string; label: string; highlight?: boolean }> = [
    { href: '/', label: '首页' },
    { href: '/features', label: '功能' },
    { href: '/use-cases', label: '场景' },
    { href: '/loadings', label: '⚡ 加载动画', highlight: true },
    { href: '/about', label: '关于' },
    { href: '/pricing', label: '价格' },
    { href: '/blog', label: '博客' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: '联系' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080810]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-bold text-lg text-white">AURA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive(link.href)
                    ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                    : link.highlight
                    ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                    : 'text-[#9090b0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Auth */}
            {status === 'loading' ? (
              <div className="w-16 h-8 bg-white/[0.05] rounded-lg animate-pulse hidden md:block" />
            ) : session?.user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="text-sm text-[#9090b0] hover:text-white transition-colors"
                >
                  {session.user.name || session.user.email}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-[#6b6b8a] hover:text-[#f87171] transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden md:block bg-white/[0.08] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/[0.12] transition-all"
              >
                登录
              </Link>
            )}
            
            <Link
              href="/dashboard"
              className="hidden md:block bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
            >
              {session ? '控制台' : '开始测评'}
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[56px] left-0 right-0 bottom-0 bg-[#080810]/98 z-40 lg:hidden">
          <div className="p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]'
                    : link.highlight
                    ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                    : 'text-[#9090b0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile auth */}
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-[#9090b0] hover:text-white hover:bg-white/[0.05]"
                >
                  控制台 ({session.user.name || session.user.email})
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-[#f87171] hover:bg-white/[0.05]"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-[#8b5cf6] hover:bg-[#8b5cf6]/10"
              >
                登录 / 注册
              </Link>
            )}
            
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-4 py-3 rounded-lg font-semibold text-center mt-4"
            >
              {session ? '控制台' : '开始测评'}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
