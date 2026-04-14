'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { nbtiQuestions, nbtiTypes } from '@/data/nbti-questions';

// NBTIResult type (exported from NBTIQuiz for use in page.tsx)
export interface NBTIResult {
  type: string;
  name: string;
  rarity: string;
  siliconCarbon: string;
  element: string;
  title: string;
  roast: string;
  strengths: string[];
  weaknesses: string[];
  motto: string;
  scores: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
    silicon: number; carbon: number;
  };
}
import { analytics } from '@/lib/analytics';

interface Props {
  onComplete: (result: NBTIResult) => void;
  onBack: () => void;
}

const STORAGE_KEY = 'nbti_answers';

export default function NBTIQuiz({ onComplete, onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
    silicon: 0, carbon: 0,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const question = nbtiQuestions[currentQ];
  const progress = ((currentQ + 1) / nbtiQuestions.length) * 100;

  // Restore from sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setScores(data.scores);
        setCurrentQ(Math.min(data.currentQ, nbtiQuestions.length - 1));
        setSelected(data.selected);
      }
    } catch { /* ignore */ }
    analytics.trackQuizStart();
    analytics.startSession('/nbti-quiz', undefined);
  }, []);

  // Persist
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ scores, currentQ, selected }));
    } catch { /* ignore */ }
  }, [scores, currentQ, selected]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const next = Math.min(selected === null ? 0 : selected + 1, question.options.length - 1);
        setSelected(next);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prev = Math.max(selected === null ? 0 : selected - 1, 0);
        setSelected(prev);
      } else if (e.key === 'Enter' && selected !== null) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'h') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, question.options.length]);

  const handleSelect = (optionIndex: number) => {
    if (animating) return;
    setSelected(optionIndex);
  };

  const handleNext = useCallback(() => {
    if (selected === null) return;
    const optionScores = question.options[selected].scores;
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, value]) => {
      newScores[key as keyof typeof newScores] += value || 0;
    });
    setScores(newScores);
    setDirection('forward');
    setAnimating(true);
    setTimeout(() => {
      if (currentQ < nbtiQuestions.length - 1) {
        setCurrentQ(q => q + 1);
        setSelected(null);
        setAnimating(false);
      } else {
        const result = calculateResult(newScores);
        onComplete(result);
      }
    }, 250);
  }, [selected, scores, currentQ, question, onComplete, animating]);

  const goPrev = useCallback(() => {
    if (currentQ === 0) { onBack(); return; }
    setDirection('back');
    setAnimating(true);
    setTimeout(() => {
      setCurrentQ(q => q - 1);
      setSelected(null);
      setAnimating(false);
    }, 250);
  }, [currentQ, onBack]);

  const fillRandomly = () => {
    // Auto-complete all remaining questions with random answers
    let s = { ...scores };
    let sq = currentQ;
    let sel = selected;
    const answerMap: Record<number, number> = {};
    for (let i = sq; i < nbtiQuestions.length; i++) {
      const pick = Math.floor(Math.random() * nbtiQuestions[i].options.length);
      answerMap[i] = pick;
      const optScores = nbtiQuestions[i].options[pick].scores;
      Object.entries(optScores).forEach(([k, v]) => {
        s = { ...s, [k]: (s[k as keyof typeof s] || 0) + (v || 0) };
      });
    }
    setScores(s);
    // Show a random intermediate state then jump to result
    setAnimating(true);
    setTimeout(() => {
      const result = calculateResult(s);
      onComplete(result);
    }, 300);
  };

  const calculateResult = (finalScores: typeof scores): NBTIResult => {
    const E_I = finalScores.E >= finalScores.I ? 'E' : 'I';
    const S_N = finalScores.S >= finalScores.N ? 'S' : 'N';
    const T_F = finalScores.T >= finalScores.F ? 'T' : 'F';
    const J_P = finalScores.J >= finalScores.P ? 'J' : 'P';
    const typeCode = E_I + S_N + T_F + J_P;
    const typeInfo = nbtiTypes[typeCode] ?? nbtiTypes['INTP']!;
    return {
      type: typeCode,
      name: typeInfo.name,
      rarity: typeInfo.rarity,
      siliconCarbon: typeInfo.siliconCarbon,
      element: typeInfo.element,
      title: typeInfo.title,
      roast: typeInfo.roast,
      strengths: typeInfo.strengths,
      weaknesses: typeInfo.weaknesses,
      motto: typeInfo.motto,
      scores: finalScores,
    };
  };

  const animClass = animating
    ? 'opacity-0 translate-y-4'
    : direction === 'forward'
      ? 'opacity-100 translate-y-0'
      : 'opacity-100 translate-y-0';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">

      {/* Progress */}
      <div className="fixed top-[60px] left-0 right-0 z-40 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b6b8a] font-medium">🧬 NBTI 测评</span>
            <span className="text-sm font-mono" style={{ color: '#06b6d4' }}>
              {currentQ + 1} <span className="text-[#4a4a5a]">/</span> {nbtiQuestions.length}
            </span>
          </div>
          <div className="h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#06b6d4] to-[#06b6d4]cc transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div
        className={`w-full max-w-2xl transition-all duration-250 ease-out ${animClass}`}
        key={currentQ}
      >
        {/* Scenario */}
        <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-7 mb-5">
          <div className="flex items-start gap-4 mb-2">
            <span className="text-3xl mt-0.5">🎭</span>
            <div>
              <div className="text-xs text-[#4a4a5a] mb-2 tracking-wider">
                情境 #{question.id} / {nbtiQuestions.length}
              </div>
              <p className="text-xl text-[#f0f0f8] leading-relaxed font-medium">
                {question.scenario}
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const letters = ['A', 'B', 'C', 'D', 'E'];
            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-full text-left p-4.5 rounded-xl border transition-all duration-150
                  ${isSelected
                    ? 'bg-[#06b6d4]/15 border-[#06b6d4] text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-[#0f0f1a] border-[#2a2a3e] text-[#a0a0b0] hover:border-[#06b6d4]/50 hover:bg-[#06b6d4]/8 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all
                    ${isSelected ? 'bg-[#06b6d4] text-white shadow-md' : 'bg-[#1a1a2e] text-[#6b6b8a]'}`}>
                    {letters[index] ?? letters[4]}
                  </span>
                  <span className="flex-1 text-[0.95rem] leading-relaxed">{option.text}</span>
                  {isSelected && (
                    <svg className="w-5 h-5 text-[#06b6d4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard hint */}
        <div className="mt-3 text-center text-xs text-[#3a3a4a]">
          ↑↓ 选择 · Enter 确认 · ← 返回
        </div>

        {/* Nav */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={goPrev}
            className="flex items-center gap-1.5 text-[#6b6b8a] hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>

          <button
            onClick={fillRandomly}
            className="text-xs text-[#4a4a5a] hover:text-[#6b6b8a] transition-colors px-3 py-1.5"
          >
            🎲 随机
          </button>

          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2
              ${selected !== null
                ? 'bg-gradient-to-r from-[#06b6d4] to-[#06b6d4]cc text-white hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95'
                : 'bg-[#1a1a2e] text-[#4a4a5a] cursor-not-allowed'}`}
          >
            {currentQ < nbtiQuestions.length - 1 ? (
              <>下一题 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
            ) : (
              <>查看结果 <span className="text-xs opacity-70">→</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
