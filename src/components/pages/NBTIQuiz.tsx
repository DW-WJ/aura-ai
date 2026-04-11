'use client';

import { useState, useEffect } from 'react';
import { nbtiQuestions, nbtiTypes, rarityConfig, NBTIQuestion } from '@/data/nbti-questions';

interface Props {
  onComplete: (result: NBTIResult) => void;
  onBack: () => void;
}

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
    E: number; I: number;
    S: number; N: number;
    T: number; F: number;
    J: number; P: number;
    silicon: number; carbon: number;
  };
}

export default function NBTIQuiz({ onComplete, onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
    silicon: 0, carbon: 0,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const question = nbtiQuestions[currentQ];
  const progress = ((currentQ + 1) / nbtiQuestions.length) * 100;

  const handleSelect = (optionIndex: number) => {
    if (animating) return;
    setSelected(optionIndex);
  };

  const handleNext = () => {
    if (selected === null || animating) return;

    // 累加分数
    const optionScores = question.options[selected].scores;
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, value]) => {
      newScores[key as keyof typeof newScores] += value || 0;
    });
    setScores(newScores);

    setAnimating(true);
    setTimeout(() => {
      if (currentQ < nbtiQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setAnimating(false);
      } else {
        // 计算结果
        const result = calculateResult(newScores);
        onComplete(result);
      }
    }, 300);
  };

  const calculateResult = (finalScores: typeof scores): NBTIResult => {
    // 确定每个维度的倾向
    const E_I = finalScores.E >= finalScores.I ? 'E' : 'I';
    const S_N = finalScores.S >= finalScores.N ? 'S' : 'N';
    const T_F = finalScores.T >= finalScores.F ? 'T' : 'F';
    const J_P = finalScores.J >= finalScores.P ? 'J' : 'P';
    
    const typeCode = E_I + S_N + T_F + J_P;
    const typeInfo = nbtiTypes[typeCode];

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Progress bar */}
      <div className="fixed top-[60px] left-0 right-0 z-40 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b6b8a]">NBTI 测评</span>
            <span className="text-sm text-[#8b5cf6]">{currentQ + 1} / {nbtiQuestions.length}</span>
          </div>
          <div className="h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className={`w-full max-w-2xl transition-all duration-300 ${animating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
        {/* Scenario */}
        <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎭</span>
            <div>
              <div className="text-xs text-[#6b6b8a] mb-1">情境 #{question.id}</div>
              <p className="text-lg text-[#f0f0f8] leading-relaxed">{question.scenario}</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200
                ${selected === index 
                  ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-white' 
                  : 'bg-[#0f0f1a] border-[#2a2a3e] text-[#b0b0c0] hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
                  ${selected === index ? 'bg-[#8b5cf6] text-white' : 'bg-[#1a1a2e] text-[#6b6b8a]'}`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="text-[#6b6b8a] hover:text-white transition-colors text-sm"
          >
            ← 返回首页
          </button>
          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200
              ${selected !== null 
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white hover:shadow-lg hover:shadow-purple-500/25' 
                : 'bg-[#1a1a2e] text-[#4a4a5a] cursor-not-allowed'}`}
          >
            {currentQ < nbtiQuestions.length - 1 ? '下一题' : '查看结果'}
          </button>
        </div>
      </div>
    </div>
  );
}
