'use client';

import { useState, useEffect } from 'react';
import { SBTI_QUESTIONS, ALCOHOL_QUESTION, matchPersonality } from '@/data/sbti-questions';
import Confetti from './Confetti';

interface Props {
  onComplete: (result: ReturnType<typeof matchPersonality>) => void;
  onBack: () => void;
}

export default function SBTIQuiz({ onComplete, onBack }: Props) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof SBTI_QUESTIONS>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [started, setStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Fisher-Yates shuffle
    const arr = [...SBTI_QUESTIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledQuestions(arr);
  }, []);

  const questions = shuffledQuestions;
  const question = questions[currentQ];
  const isAlcohol = question && 'id' in question && question.id === 31;
  const total = questions.length + 1; // +1 for alcohol question
  const progress = (currentQ / total) * 100;

  const handleSelect = (idx: number) => {
    if (animating) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null || animating) return;

    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setAnimating(true);

    setTimeout(() => {
      setSelected(null);
      setAnimating(false);

      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else if (currentQ === questions.length - 1) {
        // Show alcohol question
        setCurrentQ(prev => prev + 1);
      } else {
        // All done
        const result = matchPersonality([...newAnswers, selected]);
        setShowConfetti(true);
        setTimeout(() => {
          onComplete(result);
        }, 1500);
      }
    }, 300);
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative">
        <style jsx global>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.4);opacity:0} }
          @keyframes gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
          .pulse-ring { animation: pulse-ring 1.5s ease-out infinite; }
        `}</style>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] bg-gradient-to-br from-[#f97316] to-[#ec4899] animate-float" style={{top:'10%',left:'-15%'}} />
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] bg-gradient-to-br from-[#ec4899] to-[#a855f7] animate-float" style={{bottom:'10%',right:'-10%',animationDelay:'1.5s'}} />
        </div>

        <div className="relative z-10 max-w-md w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.25)] rounded-full px-4 py-2 text-xs text-[#f97316] mb-8 tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#f97316]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f97316]" />
            </span>
            SBTI · 发疯人格测试
          </div>

          <h2 className="text-4xl font-bold mb-3 text-white">
            <span className="bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#a855f7] bg-clip-text text-transparent animate-gradient">
              准备好发疯了吗？
            </span>
          </h2>

          <p className="text-[#6b6b8a] mb-10 leading-relaxed">
            31 道离谱题目，没有标准答案。<br />
            测完你就知道自己是哪种神经病了。
          </p>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { icon: '🎲', label: '题目随机打乱' },
              { icon: '🌶️', label: '画风比较离谱' },
              { icon: '🎭', label: '结果极度抽象' },
            ].map(item => (
              <div key={item.label} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs text-[#6b6b8a]">{item.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ec4899] text-white font-bold text-base hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            开始发疯 →
          </button>

          <button
            onClick={onBack}
            className="mt-4 text-[#4a4a6a] text-sm hover:text-white transition-colors"
          >
            ← 返回选择
          </button>
        </div>
      </div>
    );
  }

  // After all regular questions, show alcohol question
  if (currentQ >= questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] bg-gradient-to-br from-[#f97316] to-[#ec4899] animate-pulse" style={{top:'20%',left:'-20%'}} />
        </div>

        <div className="relative z-10 max-w-md w-full slide-in-from-bottom-2">
          <div className="text-sm text-[#f97316] mb-6 tracking-widest uppercase">
            ← {currentQ}/{total}
          </div>

          <div className="w-full bg-[#1a1a2e] rounded-full h-1.5 mb-10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#f97316] to-[#ec4899] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>

          <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
            🍺 最后一道：喝酒吗？
          </h2>

          <div className="space-y-3">
            {ALCOHOL_QUESTION.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200
                  ${selected === idx
                    ? 'border-[#f97316] bg-[rgba(249,115,22,0.1)] text-white'
                    : 'border-[#2a2a3e] bg-[#0f0f1a] text-[#a0a0c0] hover:border-[#f97316]/40'
                  }`}
              >
                <span className="text-[#f97316] mr-3 font-bold">{['A', 'B', 'C'][idx]}</span>
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`mt-8 w-full py-4 rounded-xl font-bold text-base transition-all duration-200
              ${selected !== null
                ? 'bg-gradient-to-r from-[#f97316] to-[#ec4899] text-white hover:opacity-90 active:scale-[0.98]'
                : 'bg-[#2a2a3e] text-[#4a4a6a] cursor-not-allowed'
              }`}
          >
            看结果 🚀
          </button>
        </div>

        {showConfetti && <Confetti active={showConfetti} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative">
      <style jsx global>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes slideInFromBottom { from { opacity:0;transform:translateY(8px) } to { opacity:1;transform:translateY(0) } }
        .slide-in-from-bottom-2 { animation: slideInFromBottom 0.35s ease both; }
        .slide-in-from-bottom-3 { animation: slideInFromBottom 0.3s ease both; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] bg-gradient-to-br from-[#f97316] to-[#ec4899] animate-float" style={{top:'10%',left:'-15%'}} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] bg-gradient-to-br from-[#ec4899] to-[#a855f7] animate-float" style={{bottom:'10%',right:'-10%',animationDelay:'1.5s'}} />
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (currentQ > 0) {
                setCurrentQ(prev => prev - 1);
                setAnswers(prev => prev.slice(0, -1));
                setSelected(null);
              } else {
                setStarted(false);
              }
            }}
            className="text-[#6b6b8a] hover:text-white transition-colors text-sm"
          >
            ← {currentQ > 0 ? '上一题' : '返回'}
          </button>
          <span className="text-sm text-[#6b6b8a]">
            {currentQ + 1}/{total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#1a1a2e] rounded-full h-1.5 mb-10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f97316] to-[#ec4899] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-xl font-bold text-white mb-8 leading-relaxed text-left">
            {question?.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question?.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200
                  ${selected === idx
                    ? 'border-[#f97316] bg-[rgba(249,115,22,0.1)] text-white shadow-lg shadow-orange-500/10'
                    : 'border-[#2a2a3e] bg-[#0f0f1a] text-[#a0a0c0] hover:border-[#f97316]/40 hover:bg-[#0f0f1a]/80'
                  }`}
              >
                <span className="text-[#f97316] mr-3 font-bold">{['A', 'B', 'C'][idx]}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={selected === null}
          className={`mt-8 w-full py-4 rounded-xl font-bold text-base transition-all duration-200
            ${selected !== null
              ? 'bg-gradient-to-r from-[#f97316] to-[#ec4899] text-white hover:opacity-90 active:scale-[0.98] shadow-lg shadow-orange-500/20'
              : 'bg-[#2a2a3e] text-[#4a4a6a] cursor-not-allowed'
            }`}
        >
          {currentQ < questions.length - 1 ? '下一题 →' : '最后一道了！'}
        </button>
      </div>

      {showConfetti && <Confetti active={showConfetti} />}
    </div>
  );
}
