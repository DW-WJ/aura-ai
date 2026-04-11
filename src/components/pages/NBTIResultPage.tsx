'use client';

import { useState, useEffect } from 'react';
import { NBTIResult } from './NBTIQuiz';
import { rarityConfig } from '@/data/nbti-questions';

interface Props {
  result: NBTIResult;
  onRestart: () => void;
}

export default function NBTIResultPage({ result, onRestart }: Props) {
  const [mounted, setMounted] = useState(false);
  const [showRoast, setShowRoast] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowRoast(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const rarity = rarityConfig[result.rarity as keyof typeof rarityConfig];
  const siliconPercent = Math.round((result.scores.silicon / (result.scores.silicon + result.scores.carbon)) * 100);
  const carbonPercent = 100 - siliconPercent;

  // 计算各维度百分比
  const getPercent = (a: number, b: number) => Math.round((a / (a + b)) * 100) || 50;
  const dimensions = [
    { label: '外向 E', value: getPercent(result.scores.E, result.scores.I), opposite: '内向 I', oppositeValue: 100 - getPercent(result.scores.E, result.scores.I) },
    { label: '感知 S', value: getPercent(result.scores.S, result.scores.N), opposite: '直觉 N', oppositeValue: 100 - getPercent(result.scores.S, result.scores.N) },
    { label: '思考 T', value: getPercent(result.scores.T, result.scores.F), opposite: '情感 F', oppositeValue: 100 - getPercent(result.scores.T, result.scores.F) },
    { label: '判断 J', value: getPercent(result.scores.J, result.scores.P), opposite: '感知 P', oppositeValue: 100 - getPercent(result.scores.J, result.scores.P) },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 transition-all duration-1000"
        style={{ backgroundColor: rarity.color }}
      />

      <div className={`relative z-10 w-full max-w-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a2e] border border-[#2a2a3e] mb-4">
            <span className="text-sm text-[#6b6b8a]">NBTI 测评结果</span>
          </div>
          
          {/* Type code */}
          <div 
            className="text-6xl md:text-8xl font-bold mb-2 transition-all duration-500"
            style={{ color: rarity.color, textShadow: rarity.glow }}
          >
            {result.type}
          </div>
          
          {/* Type name */}
          <div className="text-2xl text-white font-medium mb-2">{result.name}</div>
          
          {/* Rarity badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: `${rarity.color}20`, color: rarity.color, border: `1px solid ${rarity.color}40` }}
          >
            <span>✦</span>
            <span>{rarity.label}</span>
            <span className="text-xs opacity-60">({rarity.rate})</span>
          </div>
          
          {/* Title */}
          <div className="text-lg text-[#a0a0b0]">{result.title}</div>
        </div>

        {/* Element & Silicon/Carbon */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl p-4 text-center">
            <div className="text-sm text-[#6b6b8a] mb-2">灵魂元素</div>
            <div className="text-2xl font-medium text-white">{result.element}</div>
          </div>
          <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl p-4 text-center">
            <div className="text-sm text-[#6b6b8a] mb-2">属性倾向</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#06b6d4]">硅基 {siliconPercent}%</span>
              <span className="text-[#6b6b8a]">|</span>
              <span className="text-[#f59e0b]">碳基 {carbonPercent}%</span>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl p-6 mb-8">
          <div className="text-sm text-[#6b6b8a] mb-4">维度分析</div>
          <div className="space-y-4">
            {dimensions.map((dim, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#8b5cf6]">{dim.label} {dim.value}%</span>
                  <span className="text-[#06b6d4]">{dim.opposite} {dim.oppositeValue}%</span>
                </div>
                <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] transition-all duration-1000"
                    style={{ width: `${dim.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roast */}
        <div 
          className={`bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl p-6 mb-8 transition-all duration-500 ${showRoast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔥</span>
            <span className="text-sm text-[#f59e0b] font-medium">毒舌解读</span>
          </div>
          <p className="text-[#b0b0c0] leading-relaxed">{result.roast}</p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span>💪</span>
              <span className="text-sm text-[#22c55e] font-medium">优势</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.strengths.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-sm border border-[#22c55e]/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span>😅</span>
              <span className="text-sm text-[#ef4444] font-medium">短板</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.weaknesses.map((w, i) => (
                <span key={i} className="px-3 py-1 bg-[#ef4444]/10 text-[#ef4444] rounded-full text-sm border border-[#ef4444]/20">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Motto */}
        <div className="bg-gradient-to-r from-[#8b5cf6]/10 to-[#06b6d4]/10 border border-[#8b5cf6]/20 rounded-xl p-6 mb-8 text-center">
          <div className="text-sm text-[#6b6b8a] mb-2">人生格言</div>
          <p className="text-lg text-white font-medium italic">"{result.motto}"</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-xl hover:bg-[#2a2a3e] transition-all"
          >
            再测一次
          </button>
          <button
            onClick={() => {
              const text = `我的 NBTI 类型是 ${result.type} - ${result.name}\n${result.title}\n\n${result.roast}`;
              if (navigator.share) {
                navigator.share({ title: 'NBTI 测评结果', text });
              } else {
                navigator.clipboard.writeText(text);
                alert('已复制到剪贴板！');
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            分享结果
          </button>
        </div>
      </div>
    </div>
  );
}
