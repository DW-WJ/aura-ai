'use client';

import { Lang } from '@/types';

interface Props {
  lang: Lang;
  onToggle: () => void;
  step?: string;
}

export default function Nav({ lang, onToggle, step }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-10 
      py-3 md:py-[18px] bg-[rgba(8,8,16,0.92)] backdrop-blur-[20px] 
      border-b border-white/[0.06]">
      
      <div className="text-[11px] md:text-sm font-bold tracking-[0.25em] md:tracking-[0.2em] 
        bg-gradient-to-r from-white to-[#8888a0] bg-clip-text text-transparent">
        AURA
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {step && (
          <span className="text-[10px] md:text-xs text-[#6b6b8a] tracking-wide hidden sm:block">{step}</span>
        )}
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