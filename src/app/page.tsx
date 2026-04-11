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

type AppMode = 'aura' | 'nbti';

export default function Home() {
  const [mode, setMode] = useState<AppMode | null>(null);
  const [page, setPage] = useState<PageState>('welcome');
  const [lang, setLang] = useState<Lang>('zh');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof buildResult> | null>(null);
  const [nbtiResult, setNbtiResult] = useState<NBTIResult | null>(null);

  // AURA handlers
  const handleStartAURA = () => {
    setMode('aura');
    setPage('quiz');
  };

  const handleQuizComplete = (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setPage('loading');
    const res = buildResult(finalAnswers, lang);
    setTimeout(() => {
      setResult(res);
      setPage('result');
    }, 2600);
  };

  // NBTI handlers
  const handleStartNBTI = () => {
    setMode('nbti');
  };

  const handleNBTIComplete = (res: NBTIResult) => {
    setNbtiResult(res);
  };

  // Common handlers
  const handleRestart = () => {
    setMode(null);
    setPage('welcome');
    setAnswers({});
    setResult(null);
    setNbtiResult(null);
  };

  const handleBack = () => {
    setMode(null);
    setPage('welcome');
  };

  // Home page with two options
  if (mode === null) {
    return (
      <main className="min-h-screen bg-[#080810] text-[#f0f0f8] relative">
        <style jsx global>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
        `}</style>
        <ParticleBackground />
        <HomePage onSelectAURA={handleStartAURA} onSelectNBTI={handleStartNBTI} />
        
        {/* Owner entry */}
        <a
          href="/admin"
          className="fixed bottom-4 right-4 text-[#2a2a3a] hover:text-[#4a4a6a] text-xs transition-colors duration-300 select-none"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          ◈
        </a>
      </main>
    );
  }

  // NBTI mode
  if (mode === 'nbti') {
    if (nbtiResult) {
      return (
        <main className="min-h-screen bg-[#080810] text-[#f0f0f8] relative">
          <ParticleBackground />
          <NBTIResultPage result={nbtiResult} onRestart={handleRestart} />
        </main>
      );
    }
    return (
      <main className="min-h-screen bg-[#080810] text-[#f0f0f8] relative">
        <ParticleBackground />
        <NBTIQuiz onComplete={handleNBTIComplete} onBack={handleBack} />
      </main>
    );
  }

  // AURA mode
  return (
    <main className="min-h-screen bg-[#080810] text-[#f0f0f8] relative">
      <style jsx global>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(-20px) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        .animate-in { animation-fill-mode: both; }
        .fade-in { animation: fadeIn 0.4s ease both; }
        .slide-in-from-bottom-2 { animation: slideInFromBottom 0.4s ease both; }
        .slide-in-from-bottom-3 { animation: slideInFromBottom3 0.35s ease both; }
        .slide-in-from-bottom-4 { animation: slideInFromBottom4 0.4s ease both; }
        .slide-in-from-bottom-6 { animation: slideInFromBottom6 0.5s ease both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInFromBottom { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInFromBottom3 { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInFromBottom4 { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInFromBottom6 { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <ParticleBackground />

      {page === 'welcome' && (
        <WelcomePage lang={lang} onStart={() => setPage('quiz')} />
      )}

      {page === 'quiz' && (
        <QuizPage
          lang={lang}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      )}

      {page === 'loading' && (
        <LoadingPage lang={lang} />
      )}

      {page === 'result' && result && (
        <ResultPage
          result={result}
          lang={lang}
          answers={answers}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}

// Home page with two cards
function HomePage({ onSelectAURA, onSelectNBTI }: { onSelectAURA: () => void; onSelectNBTI: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] bg-gradient-to-br from-[#8b5cf6] to-transparent animate-pulse" style={{ top: '-20%', left: '-10%' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[80px] bg-gradient-to-br from-[#06b6d4] to-transparent animate-pulse" style={{ bottom: '-10%', right: '-5%', animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)] rounded-full px-4 py-2 text-xs tracking-widest text-[#8b5cf6] uppercase mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]" />
          </span>
          人格探索系统
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent">
            发现你的灵魂光谱
          </span>
        </h1>
        <p className="text-[#6b6b8a] text-lg">选择一个测评，开始探索</p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full relative z-10">
        {/* NBTI Card */}
        <button
          onClick={onSelectNBTI}
          className="group relative bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-8 text-left hover:border-[#06b6d4]/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="absolute top-4 right-4 px-2 py-1 bg-[#06b6d4]/20 text-[#06b6d4] text-xs rounded-full">
            🔥 热门
          </div>
          
          <div className="text-4xl mb-4">🧬</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#06b6d4] transition-colors">
            NBTI 测评
          </h3>
          <p className="text-[#6b6b8a] text-sm mb-4">
            24 道情境题 · 16 种人格 · 稀有度系统
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs px-2 py-1 bg-[#1a1a2e] text-[#a0a0b0] rounded">毒舌解读</span>
            <span className="text-xs px-2 py-1 bg-[#1a1a2e] text-[#a0a0b0] rounded">硅基/碳基</span>
            <span className="text-xs px-2 py-1 bg-[#1a1a2e] text-[#a0a0b0] rounded">灵魂元素</span>
          </div>
          
          <div className="flex items-center text-[#06b6d4] text-sm font-medium">
            <span>开始测试</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* AURA Card */}
        <button
          onClick={onSelectAURA}
          className="group relative bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-8 text-left hover:border-[#8b5cf6]/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="absolute top-4 right-4 px-2 py-1 bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs rounded-full">
            ✨ 经典
          </div>
          
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#8b5cf6] transition-colors">
            AURA 配置
          </h3>
          <p className="text-[#6b6b8a] text-sm mb-4">
            16 道题目 · AI 人格配置 · 可导出
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs px-2 py-1 bg-[#1a1a2e] text-[#a0a0b0] rounded">人格雷达图</span>
            <span className="text-xs px-2 py-1 bg-[#1a1a2e] text-[#a0a0b0] rounded">AI 增强</span>
            <span className="text-xs px-2 py-1 bg-[#1a1a2e] text-[#a0a0b0] rounded">Markdown 导出</span>
          </div>
          
          <div className="flex items-center text-[#8b5cf6] text-sm font-medium">
            <span>开始配置</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-[#4a4a5a] text-xs relative z-10">
        <p>支持硅基和碳基 · 发现你的灵魂光谱</p>
      </div>
    </div>
  );
}
