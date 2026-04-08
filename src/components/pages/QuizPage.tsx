'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Lang } from '@/types';
import { questions_zh, questions_en } from '@/data/questions';
import { useQuizKeyboard } from '@/hooks/useQuizKeyboard';
import { analytics } from '@/lib/analytics';

interface Props {
  lang: Lang;
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const STORAGE_KEY = 'aura_quiz_answers';

export default function QuizPage({ lang, onComplete, onBack }: Props) {
  const questions = lang === 'zh' ? questions_zh : questions_en;
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const startTime = useRef(Date.now());

  // Track quiz start
  useEffect(() => {
    analytics.quizStarted(lang);
  }, [lang]);

  // Restore from localStorage on mount
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  // Persist on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch { /* ignore */ }
  }, [answers]);

  const q = questions[current];

  const currentIndex = q.options.findIndex(o => o.value === answers[q.id]);

  const select = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [q.id]: value }));
  }, [q.id]);

  const goNext = useCallback(() => {
    if (!answers[q.id]) return;
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setAnimKey(k => k + 1);
    } else {
      const duration = Date.now() - startTime.current;
      analytics.quizCompleted(lang, duration);
      onComplete(answers);
    }
  }, [answers, q.id, current, questions.length, onComplete, lang]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setCurrent(c => c - 1);
      setAnimKey(k => k + 1);
    } else {
      onBack();
    }
  }, [current, onBack]);

  useQuizKeyboard({
    optionCount: q.options.length,
    selectedIndex: currentIndex,
    onSelect: (index) => {
      if (index >= 0 && index < q.options.length) {
        select(q.options[index].value);
      }
    },
    onConfirm: goNext,
    onPrev: goPrev,
  });

  const progress = ((current + 1) / questions.length) * 100;

  const t = lang === 'zh' ? {
    question: '问题',
    back: '返回',
    next: '继续',
    generate: '生成 ✦',
    random: '随机跳过',
    answered: '已答',
    keyboardHint: '使用 ↑↓ 选择，Enter 确认',
  } : {
    question: 'Question',
    back: 'Back',
    next: 'Next',
    generate: 'Generate ✦',
    random: 'Skip All',
    answered: '',
    keyboardHint: '↑↓ to select, Enter to confirm',
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/[0.05] z-40">
        <div
          className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] transition-all duration-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-[620px]">

          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goPrev}
              className="bg-transparent border border-white/[0.08] rounded-xl px-4 py-2
                text-[13px] text-[#6b6b8a] cursor-pointer transition-all duration-200
                hover:border-[rgba(139,92,246,0.5)] hover:text-white"
            >
              ← {t.back}
            </button>

            <div className="flex items-center gap-3">
              {/* Random fill */}
              <button
                onClick={() => {
                  const filled: Record<string, string> = {};
                  questions.forEach(qu => {
                    filled[qu.id] = qu.options[Math.floor(Math.random() * qu.options.length)].value;
                  });
                  onComplete(filled);
                }}
                className="bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-xl px-4 py-2
                  text-[12px] text-[#a78bfa] cursor-pointer transition-all duration-200 font-medium
                  hover:bg-[rgba(139,92,246,0.2)] hover:border-[rgba(139,92,246,0.5)]"
              >
                🎲 {t.random}
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b8a]">
                <span className="text-[#8b5cf6] font-semibold">{current + 1}</span>
                <span>/</span>
                <span>{questions.length}</span>
                {Object.keys(answers).length > 0 && (
                  <span className="text-[#10b981] ml-1">· {Object.keys(answers).length}{t.answered}</span>
                )}
              </div>
            </div>
          </div>

          {/* category badge */}
          <div className="inline-flex items-center gap-1.5 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)]
            rounded-full px-3 py-[4px] text-[10px] tracking-widest uppercase text-[#8b5cf6] mb-4">
            {q.category}
          </div>

          {/* question */}
          <div key={animKey} className="animate-in slide-in-from-bottom-3 fade-in duration-250">
            <div className="text-[1.2rem] md:text-[1.35rem] font-semibold leading-[1.5] tracking-[-0.01em] mb-6 text-[#e2e8f0]">
              {q.text}
            </div>

            {/* keyboard hint */}
            <div className="text-[10px] text-[#4a4a6a] mb-3 tracking-wide">
              {t.keyboardHint}
            </div>

            {/* options */}
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt.value;
                const isFocused = currentIndex === i;
                return (
                  <button
                    key={opt.value}
                    onClick={() => select(opt.value)}
                    className={`
                      w-full text-left bg-[#0e0e1a] border rounded-2xl px-5 py-4
                      cursor-pointer transition-all duration-200 flex items-center gap-4
                      text-[0.9rem] md:text-[0.95rem] leading-relaxed
                      ${isSelected
                        ? 'border-[#8b5cf6] text-white bg-[#13131f] shadow-[0_0_24px_rgba(139,92,246,0.12)]'
                        : isFocused
                        ? 'border-[rgba(139,92,246,0.45)] text-[#c0c0d8] -translate-y-0.5 bg-[#0f0f1a]'
                        : 'border-white/[0.07] text-[#9090b0] hover:border-[rgba(139,92,246,0.5)] hover:text-white hover:-translate-y-0.5 hover:bg-[#0f0f1a]'
                      }`}
                  >
                    <span className={`
                      w-[22px] h-[22px] rounded-full border-[1.5px] flex-shrink-0
                      flex items-center justify-center transition-all duration-200
                      ${isSelected ? 'border-[#8b5cf6] bg-[#8b5cf6]' : isFocused ? 'border-[#8b5cf6]/60' : 'border-white/[0.12]'}`}>
                      {isSelected && (
                        <span className="w-[8px] h-[8px] rounded-full bg-white" />
                      )}
                    </span>
                    {opt.label}
                    {isFocused && (
                      <span className="ml-auto text-[#6b6b8a] text-[10px] border border-white/[0.08] px-1.5 py-0.5 rounded">
                        ↵
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom next button */}
          <div className="mt-8">
            <button
              onClick={goNext}
              disabled={!answers[q.id]}
              className={`w-full border-none rounded-2xl
                py-4 text-white text-[15px] font-semibold
                transition-all duration-200 flex items-center justify-center gap-2
                ${answers[q.id]
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(139,92,246,0.45)] active:scale-[0.99]'
                  : 'bg-[#6b6b8a] cursor-not-allowed opacity-50'
                }`}
            >
              {current === questions.length - 1 ? t.generate : `${t.next} →`}
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-[4px] mt-6 flex-wrap max-w-[400px] mx-auto">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-[5px] h-[5px] rounded-full transition-all duration-300 flex-shrink-0
                  ${i < current ? 'bg-[#8b5cf6]/40' : ''}
                  ${i === current ? 'bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6] scale-[1.4]' : ''}
                  ${i > current ? 'bg-white/[0.07]' : ''}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
