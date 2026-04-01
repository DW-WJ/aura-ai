'use client';

import { useEffect, useState } from 'react';
import { Lang } from '@/types';

interface Props {
  lang: Lang;
  onStart: () => void;
}

export default function WelcomePage({ lang, onStart }: Props) {
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t1);
  }, []);

  const t = {
    zh: {
      eyebrow: 'AI 人格配置系统',
      title1: '打造属于你的',
      title2: '专属 AI 伙伴',
      sub: '回答 16 个问题，我们为你生成一个有性格、有记忆、真正懂你的 AI 助手配置。',
      cta: '开始配置',
      f1: '16 题精准测评',
      f2: '多维人格分析',
      f3: '高质量配置导出',
    },
    en: {
      eyebrow: 'AI Personality System',
      title1: 'Build Your Own',
      title2: 'Personal AI Partner',
      sub: "Answer 16 questions. We'll generate a personalized AI assistant config that truly understands you.",
      cta: 'Get Started',
      f1: '16-Question Assessment',
      f2: 'Multi-Dimensional Analysis',
      f3: 'High-Quality Config Export',
    },
  }[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] bg-gradient-to-br from-[#8b5cf6] to-transparent
            transition-all duration-1500 ease-out
            ${mounted ? 'opacity-20 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ top: '-20%', left: '-10%' }}
        />
        <div 
          className={`absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[80px] bg-gradient-to-br from-[#06b6d4] to-transparent
            transition-all duration-1500 delay-300 ease-out
            ${mounted ? 'opacity-15 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ bottom: '-10%', right: '-5%' }}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 transition-all duration-800 ease-out transform
        ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* eyebrow */}
        <div className={`inline-flex items-center gap-2 bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)]
          rounded-full px-4 py-[6px] text-xs tracking-widest text-[#8b5cf6] uppercase mb-9
          transition-all duration-500 delay-200 transform
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]" />
          </span>
          {t.eyebrow}
        </div>

        {/* title */}
        <h1 className={`text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em] mb-6
          transition-all duration-700 delay-300
          ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {t.title1}<br />
          <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            {t.title2}
          </span>
        </h1>

        {/* subtitle */}
        <p className={`text-[1.05rem] text-[#6b6b8a] max-w-[480px] leading-[1.8] mb-[52px] mx-auto
          transition-all duration-500 delay-500
          ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {t.sub}
        </p>

        {/* CTA */}
        <div className={`transition-all duration-500 delay-700
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1]
              border-none rounded-2xl px-11 py-[18px] text-white text-base font-semibold
              cursor-pointer transition-all duration-300 shadow-[0_0_48px_rgba(139,92,246,0.35)]
              hover:-translate-y-1.5 hover:shadow-[0_12px_60px_rgba(139,92,246,0.5)]
              active:scale-[0.98] tracking-wide overflow-hidden"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 overflow-hidden rounded-2xl">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out
                bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </span>
            <span className="relative z-10 flex items-center gap-2">
              {t.cta}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>

        {/* features */}
        <div className={`flex gap-6 md:gap-9 mt-[72px] flex-wrap justify-center
          transition-all duration-500 delay-1000
          ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { label: t.f1, icon: '✦' },
            { label: t.f2, icon: '✦' },
            { label: t.f3, icon: '✦' },
          ].map((f, i) => (
            <div key={f.label} className="flex items-center gap-2 text-sm text-[#6b6b8a]">
              <span className="text-[#8b5cf6] text-xs">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080810] to-transparent pointer-events-none" />
    </div>
  );
}
