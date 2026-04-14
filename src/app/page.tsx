'use client';

import { useState } from 'react';
import { Lang, PageState } from '@/types';
import { buildResult } from '@/lib/buildResult';
import ParticleBackground from '@/components/ui/ParticleBackground';
import WelcomePage from '@/components/pages/WelcomePage';
import QuizPage from '@/components/pages/QuizPage';
import LoadingPage from '@/components/pages/LoadingPage';
import ResultPage from '@/components/pages/ResultPage';
import NBTIQuiz, { NBTIResult } from '@/components/pages/NBTIQuiz';
import NBTIResultPage from '@/components/pages/NBTIResultPage';
import SBTIQuiz from '@/components/pages/SBTIQuiz';
import SBTIResultPage from '@/components/pages/SBTIResultPage';
import { SBTIPersonality } from '@/data/sbti-questions';

type AppMode = 'aura' | 'nbti' | 'sbti';

// Shared layout wrapper
function QuizLayout({ children, showParticle = false }: { children: React.ReactNode; showParticle?: boolean }) {
  return (
    <main className="min-h-screen bg-[#080810] text-[#f0f0f8] relative">
      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .a-fade-up { animation: fadeUp 0.5s ease both; }
        .a-slide-in { animation: slideIn 0.4s ease both; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .shimmer-text { background: linear-gradient(90deg, #8b5cf6, #a78bfa, #06b6d4, #8b5cf6); background-size: 300% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite; }
        @keyframes shimmer { to { background-position: 300% center; } }
      `}</style>
      {showParticle && <ParticleBackground />}
      {children}
    </main>
  );
}

export default function Home() {
  const [mode, setMode] = useState<AppMode | null>(null);
  const [page, setPage] = useState<PageState>('welcome');
  const [lang, setLang] = useState<Lang>('zh');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof buildResult> | null>(null);
  const [nbtiResult, setNbtiResult] = useState<NBTIResult | null>(null);
  const [sbtiResult, setSbtiResult] = useState<SBTIPersonality | null>(null);

  // AURA handlers
  const handleStartAURA = () => { setMode('aura'); setPage('quiz'); };
  const handleQuizComplete = (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setPage('loading');
    const res = buildResult(finalAnswers, lang);
    setTimeout(() => { setResult(res); setPage('result'); }, 2600);
  };
  // NBTI handlers
  const handleStartNBTI = () => { setMode('nbti'); };
  const handleNBTIComplete = (res: NBTIResult) => { setNbtiResult(res); };
  // SBTI handlers
  const handleStartSBTI = () => { setMode('sbti'); };
  const handleSBTIComplete = (res: SBTIPersonality) => { setSbtiResult(res); };
  // Common handlers
  const handleRestart = () => {
    setMode(null); setPage('welcome');
    setAnswers({}); setResult(null); setNbtiResult(null); setSbtiResult(null);
  };
  const handleBack = () => { setMode(null); setPage('welcome'); };
  const handleSBTIBack = () => { setMode(null); setPage('welcome'); setSbtiResult(null); };

  // ── Home / Welcome ──────────────────────────────────────────────────────
  if (mode === null) {
    return (
      <main className="min-h-screen bg-[#080810] text-[#f0f0f8] relative">
        <style jsx global>{`
          @keyframes bgFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
          .a-bg-float { animation: bgFloat 6s ease-in-out infinite; }
          .a-hero-title { animation: fadeUp 0.6s ease 0.1s both; }
          .a-hero-sub { animation: fadeUp 0.6s ease 0.2s both; }
          .a-card-nbti { animation: fadeUp 0.6s ease 0.2s both; }
          .a-card-sbti { animation: fadeUp 0.6s ease 0.3s both; }
          .a-card-aura { animation: fadeUp 0.6s ease 0.4s both; }
          .a-footer { animation: fadeUp 0.6s ease 0.6s both; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        `}</style>
        <HomePage onSelectAURA={handleStartAURA} onSelectNBTI={handleStartNBTI} onSelectSBTI={handleStartSBTI} />
        <a href="/admin" className="fixed bottom-4 right-4 text-[#2a2a3a] hover:text-[#4a4a6a] text-xs transition-colors duration-300 select-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>◈</a>
      </main>
    );
  }

  // ── SBTI ──────────────────────────────────────────────────────────────────
  if (mode === 'sbti') {
    if (sbtiResult) {
      return (
        <QuizLayout>
          <SBTIResultPage result={sbtiResult} onRestart={handleRestart} />
        </QuizLayout>
      );
    }
    return (
      <QuizLayout>
        <SBTIQuiz onComplete={handleSBTIComplete} onBack={handleSBTIBack} />
      </QuizLayout>
    );
  }

  // ── NBTI ─────────────────────────────────────────────────────────────────
  if (mode === 'nbti') {
    if (nbtiResult) {
      return (
        <QuizLayout showParticle>
          <NBTIResultPage result={nbtiResult} onRestart={handleRestart} />
        </QuizLayout>
      );
    }
    return (
      <QuizLayout showParticle>
        <NBTIQuiz onComplete={handleNBTIComplete} onBack={handleBack} />
      </QuizLayout>
    );
  }

  // ── AURA ─────────────────────────────────────────────────────────────────
  return (
    <QuizLayout>
      <ParticleBackground />
      {page === 'welcome' && <WelcomePage lang={lang} onStart={() => setPage('quiz')} />}
      {page === 'quiz' && <QuizPage lang={lang} onComplete={handleQuizComplete} onBack={handleBack} />}
      {page === 'loading' && <LoadingPage lang={lang} />}
      {page === 'result' && result && <ResultPage result={result} lang={lang} answers={answers} onRestart={handleRestart} />}
    </QuizLayout>
  );
}

// ── Home Page (card grid) ─────────────────────────────────────────────────────
function HomePage({ onSelectAURA, onSelectNBTI, onSelectSBTI }: {
  onSelectAURA: () => void; onSelectNBTI: () => void; onSelectSBTI: () => void;
}) {
  const cards = [
    {
      key: 'nbti', label: '🧬 人格', badge: '🧬 人格', badgeBg: 'bg-[#06b6d4]/20', badgeText: 'text-[#06b6d4]',
      accentColor: '#06b6d4', shadowColor: 'shadow-cyan-500/10', borderHover: 'hover:border-[#06b6d4]/60',
      title: 'NBTI 测评', desc: '24 道情境题 · 16 种人格 · 稀有度系统',
      tags: ['毒舌解读', '硅基/碳基', '灵魂元素'],
      btn: '开始测试', onClick: onSelectNBTI, animClass: 'a-card-nbti',
    },
    {
      key: 'sbti', label: '🔥 爆火', badge: '🔥 爆火', badgeBg: 'bg-[#f97316]/20', badgeText: 'text-[#f97316]',
      accentColor: '#f97316', shadowColor: 'shadow-orange-500/10', borderHover: 'hover:border-[#f97316]/60',
      title: 'SBTI 发疯测试', desc: '31 道离谱题 · 27 种抽象人格 · 发疯专属',
      tags: ['随机打乱', '荒诞玩梗', '极度自嘲'],
      btn: '开始发疯', onClick: onSelectSBTI, animClass: 'a-card-sbti',
    },
    {
      key: 'aura', label: '✨ 经典', badge: '✨ 经典', badgeBg: 'bg-[#8b5cf6]/20', badgeText: 'text-[#8b5cf6]',
      accentColor: '#8b5cf6', shadowColor: 'shadow-purple-500/10', borderHover: 'hover:border-[#8b5cf6]/60',
      title: 'AURA 配置', desc: '16 道题目 · AI 人格配置 · 可导出',
      tags: ['人格雷达图', 'AI 增强', 'Markdown 导出'],
      btn: '开始配置', onClick: onSelectAURA, animClass: 'a-card-aura',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="a-bg-float absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #8b5cf640, transparent)', top: '-20%', left: '-15%' }} />
        <div className="a-bg-float absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #06b6d460, transparent)', bottom: '-10%', right: '-5%', animationDelay: '2s' }} />
        <div className="a-bg-float absolute w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #f9731640, transparent)', top: '50%', right: '10%', animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="text-center mb-14 relative z-10">
        <div className="a-hero-title inline-flex items-center gap-2 bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)] rounded-full px-5 py-2 text-xs tracking-widest text-[#8b5cf6] uppercase mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]" />
          </span>
          人格探索系统
        </div>
        <h1 className="a-hero-title text-5xl md:text-6xl font-black mb-4">
          <span className="shimmer-text">发现你的灵魂光谱</span>
        </h1>
        <p className="a-hero-sub text-[#6b6b8a] text-lg">选择一个测评，开始探索</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full relative z-10">
        {cards.map((card) => (
          <button
            key={card.key}
            onClick={card.onClick}
            className={`group relative bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-8 text-left transition-all duration-300 ${card.borderHover} hover:${card.shadowColor} ${card.animClass}`}
          >
            {/* Badge */}
            <div className={`absolute top-4 right-4 px-2 py-1 ${card.badgeBg} ${card.badgeText} text-xs rounded-full font-medium`}>
              {card.badge}
            </div>

            {/* Icon */}
            <div className="text-5xl mb-5 mt-2">
              {card.key === 'nbti' ? '🧬' : card.key === 'sbti' ? '🎭' : '🤖'}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors"
              style={{ color: card.key === 'nbti' ? undefined : card.key === 'sbti' ? undefined : undefined }}>
              {card.title}
            </h3>

            {/* Desc */}
            <p className="text-[#6b6b8a] text-sm mb-5 leading-relaxed">{card.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {card.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-[#1a1a2e] text-[#a0a0b0] rounded-lg border border-[#2a2a3e]">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center text-sm font-semibold" style={{ color: card.accentColor }}>
              <span>{card.btn}</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="a-footer mt-14 text-center text-[#3a3a4a] text-xs relative z-10">
        支持硅基和碳基 · 发现你的灵魂光谱
      </p>
    </div>
  );
}
