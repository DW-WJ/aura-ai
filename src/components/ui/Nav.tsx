'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Lang } from '@/types';

interface Props {
  lang: Lang;
  onToggle: () => void;
  step?: string;
}

export default function Nav({ lang, onToggle, step }: Props) {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-10 
      py-3 md:py-[18px] bg-[rgba(8,8,16,0.92)] backdrop-blur-[20px] 
      border-b border-white/[0.06]">
      
      <Link href="/" className="text-[11px] md:text-sm font-bold tracking-[0.25em] md:tracking-[0.2em] 
        bg-gradient-to-r from-white to-[#8888a0] bg-clip-text text-transparent cursor-pointer">
        AURA
      </Link>
      
      <div className="flex items-center gap-2 md:gap-4">
        {step && (
          <span className="text-[10px] md:text-xs text-[#6b6b8a] tracking-wide hidden sm:block">{step}</span>
        )}
        
        {/* Auth section */}
        {status === 'loading' ? (
          <div className="w-16 h-6 bg-white/[0.05] rounded-lg animate-pulse" />
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="text-xs text-[#9090b0] hover:text-white transition-colors hidden sm:block"
            >
              {session.user.name || session.user.email}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-transparent border border-white/[0.08] rounded-lg px-2.5 md:px-3 py-1.5 md:py-[5px]
                text-[10px] md:text-xs text-[#8888a0] cursor-pointer transition-all duration-200
                hover:border-[rgba(248,113,113,0.5)] hover:text-[#f87171] font-medium"
            >
              {lang === 'zh' ? '退出' : 'Sign out'}
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="bg-[#8b5cf6] rounded-lg px-3 md:px-4 py-1.5 md:py-[5px]
              text-[10px] md:text-xs text-white cursor-pointer transition-all duration-200
              hover:bg-[#7c3aed] font-medium"
          >
            {lang === 'zh' ? '登录' : 'Sign in'}
          </Link>
        )}
        
        {/* Language toggle */}
        <button
          onClick={onToggle}
          className="bg-transparent border border-white/[0.08] rounded-lg px-2.5 md:px-3 py-1.5 md:py-[5px]
            text-[10px] md:text-xs text-[#8888a0] cursor-pointer transition-all duration-200
            hover:border-[rgba(139,92,246,0.5)] hover:text-white font-medium"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </div>
    </nav>
  );
}
