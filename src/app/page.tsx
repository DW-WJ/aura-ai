'use client';

import { useState } from 'react';
import { Lang, PageState } from '@/types';
import { buildResult } from '@/lib/buildResult';
import ParticleBackground from '@/components/ui/ParticleBackground';
import WelcomePage from '@/components/pages/WelcomePage';
import QuizPage from '@/components/pages/QuizPage';
import LoadingPage from '@/components/pages/LoadingPage';
import ResultPage from '@/components/pages/ResultPage';

export default function Home() {
  const [page, setPage] = useState<PageState>('welcome');
  const [lang, setLang] = useState<Lang>('zh');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof buildResult> | null>(null);
  const [quizData, setQuizData] = useState<Record<string, string>>({});

  const handleStart = () => {
    setPage('quiz');
  };

  const handleQuizComplete = (finalAnswers: Record<string, string>) => {
    setPage('loading');
    setTimeout(() => {
      const res = buildResult(finalAnswers, lang);
      setResult(res);
      setPage('result');
    }, 2600);
  };

  const handleRestart = () => {
    setPage('welcome');
    setAnswers({});
    setQuizData({});
    setResult(null);
  };

  const handleBack = () => {
    setPage('welcome');
  };

  return (
    <main className="min-h-screen bg-[#080810] text-[#f0f0f8] relative">
      <style jsx global>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(-20px) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        .animate-in {
          animation-fill-mode: both;
        }
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
        <WelcomePage lang={lang} onStart={handleStart} />
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
        <ResultPage result={result} lang={lang} onRestart={handleRestart} />
      )}
    </main>
  );
}
