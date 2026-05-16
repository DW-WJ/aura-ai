'use client';

import { useState, useEffect, useRef } from 'react';
import { NBTIResult } from './NBTIQuiz';
import { rarityConfig } from '@/data/nbti-questions';
import { useSaveConfig } from '@/lib/useSaveConfig';

interface Props {
  result: NBTIResult;
  onRestart: () => void;
}

export default function NBTIResultPage({ result, onRestart }: Props) {
  const [mounted, setMounted] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [aiPhase, setAiPhase] = useState<'idle' | 'loading' | 'streaming' | 'done' | 'error'>('idle');
  const [aiText, setAiText] = useState('');
  const [modelName, setModelName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const aiBoxRef = useRef<HTMLDivElement>(null);

  const rarity = rarityConfig[result.rarity as keyof typeof rarityConfig];
  const totalSC = result.scores.silicon + result.scores.carbon;
  const siliconPercent = totalSC > 0 ? Math.round((result.scores.silicon / totalSC) * 100) : 50;
  const carbonPercent = totalSC > 0 ? Math.round((result.scores.carbon / totalSC) * 100) : 50;

  // Auto-save to workspace
  const { saveStatus } = useSaveConfig({
    quizType: 'nbti',
    name: `NBTI ${result.type} - ${result.name}`,
    configText: JSON.stringify({ type: result.type, name: result.name, title: result.title, rarity: result.rarity, element: result.element, roast: result.roast, strengths: result.strengths, weaknesses: result.weaknesses, motto: result.motto, scores: result.scores }, null, 2),
    statsJson: { quizType: 'nbti', type: result.type, rarity: result.rarity },
  });

  const getPercent = (a: number, b: number) => Math.round((a / (a + b)) * 100) || 50;
  const dimensions = [
    { label: '外向 E', value: getPercent(result.scores.E, result.scores.I), opposite: '内向 I', oppositeValue: 100 - getPercent(result.scores.E, result.scores.I) },
    { label: '感知 S', value: getPercent(result.scores.S, result.scores.N), opposite: '直觉 N', oppositeValue: 100 - getPercent(result.scores.S, result.scores.N) },
    { label: '思考 T', value: getPercent(result.scores.T, result.scores.F), opposite: '情感 F', oppositeValue: 100 - getPercent(result.scores.T, result.scores.F) },
    { label: '判断 J', value: getPercent(result.scores.J, result.scores.P), opposite: '感知 P', oppositeValue: 100 - getPercent(result.scores.J, result.scores.P) },
  ];

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowRoast(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // 自动触发 AI 深度解读
  useEffect(() => {
    if (mounted && aiPhase === 'idle') {
      startAIEnhance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // 自动滚动
  useEffect(() => {
    if (aiPhase === 'streaming' && aiBoxRef.current) {
      aiBoxRef.current.scrollTop = aiBoxRef.current.scrollHeight;
    }
  }, [aiText, aiPhase]);

  const startAIEnhance = async () => {
    if (aiPhase === 'streaming') return;
    setAiPhase('loading');
    setAiText('');
    setErrorMsg('');

    const prompt = `你是 NBTI 人格分析师。用户的人格类型是 ${result.type}（${result.name}），稀有度：${rarity.label}，称号：${result.title}，灵魂元素：${result.element}，硅基/碳基：${siliconPercent}% 硅基 / ${carbonPercent}% 碳基。

基础毒舌解读：${result.roast}

请用幽默毒舌、犀利讽刺的风格，生成一段 200-300 字的"AI 深度解读"，包括：
1. 这种人格在现实生活中最社死的一个典型场景（要具体、有画面感）
2. 他们最容易被误解的地方，以及他们最想反驳但又不好意思说的话
3. 一句让他们"被戳中"的人生建议

风格要求：像朋友在群里吐槽你，不是一本正经的心理分析。多用"你"而不是"他们"。可以适当用点网络梗。`;

    try {
      const res = await fetch('/api/sbti-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      setAiPhase('streaming');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (!raw) continue;
            if (currentEvent === 'start') {
              setModelName(raw);
            } else if (currentEvent === 'delta') {
              try {
                const parsed = JSON.parse(raw);
                setAiText(p => p + (parsed.content ?? ''));
              } catch {
                setAiText(p => p + raw);
              }
            } else if (currentEvent === 'error') {
              throw new Error(raw);
            }
          }
        }
      }
      setAiPhase('done');
    } catch (err: unknown) {
      setAiPhase('error');
      setErrorMsg(err instanceof Error ? err.message : 'AI 解读生成失败');
    }
  };

  const handleShare = () => {
    const text = `我的 NBTI 类型是 ${result.type}（${result.name}）\n${result.title} · ${rarity.label}级人格 · ${siliconPercent}% 硅基\n\n来测测你的灵魂光谱 👉 https://aura.dw.wjdc.ink`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('结果已复制到剪贴板！');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 text-white">
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-8px)}
        }
        @keyframes blink {
          0%,100%{opacity:1}
          50%{opacity:0}
        }
        .shimmer { background: linear-gradient(90deg, ${rarity.color}, #fff, ${rarity.color}); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 3s linear infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .streaming-cursor { display: inline-block; width: 2px; height: 1em; background: ${rarity.color}; margin-left: 2px; vertical-align: middle; animation: blink 0.7s infinite; }
      `}</style>

      <div className="max-w-2xl w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-xs uppercase tracking-widest" style={{ color: rarity.color }}>
            {rarity.label} · NBTI 人格报告
          </div>
          <h1 className="text-5xl font-black shimmer">{result.type}</h1>
          <div className="text-2xl font-bold" style={{ color: rarity.color }}>{result.name}</div>
          {/* Save status */}
          {saveStatus === 'saving' && <div className="text-xs text-[#6b6b8a] animate-pulse mt-1">💾 正在保存…</div>}
          {saveStatus === 'saved' && <div className="text-xs text-[#10b981] mt-1">✅ 已保存到工作空间</div>}
          {saveStatus === 'error' && <div className="text-xs text-[#f87171] mt-1">⚠️ 保存失败（未登录）</div>}
        </div>

        {/* Rarity + Silicon/Carbon */}
        <div className="flex justify-center gap-3">
          <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${rarity.color}20`, color: rarity.color, border: `1px solid ${rarity.color}40` }}>
            {rarity.label}
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-[#1a1a2e] text-[#a0a0b0] border border-[#2a2a3e]">
            🧬 {siliconPercent}% 硅基 · {carbonPercent}% 碳基
          </div>
        </div>

        {/* Title */}
        <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-6 text-center">
          <p className="text-lg text-white font-medium italic">"{result.title}"</p>
          <p className="text-sm text-[#6b6b8a] mt-2">{result.element} · 灵魂元素</p>
        </div>

        {/* 维度条 */}
        <div className="space-y-4">
          <div className="text-xs text-[#6b6b8a] uppercase tracking-wider mb-1">人格维度</div>
          {dimensions.map((dim) => (
            <div key={dim.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a0a0b0]">{dim.label} ({dim.value}%)</span>
                <span className="text-[#a0a0b0]">{dim.oppositeValue}% {dim.opposite}</span>
              </div>
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${dim.value}%`, background: `linear-gradient(90deg, ${rarity.color}cc, ${rarity.color})` }} />
              </div>
            </div>
          ))}
        </div>

        {/* 基础毒舌解读 */}
        <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-bold" style={{ color: rarity.color }}>基础毒舌解读</span>
          </div>
          <p className="text-[#b0b0c0] leading-relaxed">{result.roast}</p>
        </div>

        {/* AI 深度解读 */}
        <div className="bg-[#0f0f1a] border rounded-2xl p-5" style={{ borderColor: aiPhase === 'streaming' ? `${rarity.color}60` : '#2a2a3e' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🤖</span>
            <span className="text-sm font-bold" style={{ color: rarity.color }}>
              {aiPhase === 'idle' || aiPhase === 'loading' ? '🤖 AI 深度解读生成中...' :
               aiPhase === 'streaming' ? '🤖 AI 深度解读中' :
               aiPhase === 'done' ? '✅ AI 深度解读' : '❌ AI 出错了'}
            </span>
            {modelName && <span className="text-xs text-[#6b6b8a]">{modelName}</span>}
          </div>

          {aiPhase === 'loading' && (
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm text-[#6b6b8a]">AI 正在思考你的灵魂...</span>
            </div>
          )}

          {aiPhase === 'error' && (
            <div>
              <p className="text-sm text-red-400">出错了：{errorMsg}</p>
              <button onClick={startAIEnhance} className="mt-2 text-xs text-[#6b6b8a] hover:text-white underline">
                重试
              </button>
            </div>
          )}

          {(aiPhase === 'streaming' || aiPhase === 'done') && (
            <div ref={aiBoxRef} className="text-sm text-[#b0b0c0] leading-relaxed max-h-80 overflow-y-auto scrollbar-thin">
              {aiText}
              {aiPhase === 'streaming' && <span className="streaming-cursor" />}
            </div>
          )}

          {aiPhase === 'done' && (
            <button onClick={startAIEnhance} className="mt-3 text-xs text-[#6b6b8a] hover:text-white transition-colors">
              重新生成 ↻
            </button>
          )}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-5">
            <div className="text-xs text-[#6b6b8a] uppercase tracking-wider mb-2">💪 优势</div>
            <div className="space-y-1">
              {result.strengths.map((s, i) => (
                <div key={i} className="text-sm text-[#a0a0b0]">• {s}</div>
              ))}
            </div>
          </div>
          <div className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-5">
            <div className="text-xs text-[#6b6b8a] uppercase tracking-wider mb-2">😅 劣势</div>
            <div className="space-y-1">
              {result.weaknesses.map((w, i) => (
                <div key={i} className="text-sm text-[#a0a0b0]">• {w}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Motto */}
        <div className="text-center py-2">
          <p className="text-lg text-white font-medium italic">"{result.motto}"</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleShare} className="flex-1 py-3 rounded-xl font-bold text-white transition-all active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${rarity.color}, ${rarity.color}cc)` }}>
            分享我的 NBTI 📤
          </button>
          <button onClick={onRestart} className="flex-1 py-3 rounded-xl font-bold bg-[#1a1a2e] border border-[#2a2a3e] text-[#a0a0c0] hover:bg-[#1f1f33] hover:text-white transition-all active:scale-[0.98]">
            再测一次 🔄
          </button>
        </div>

        <p className="text-center text-xs text-[#3a3a4a]">
          NBTI · 纯属娱乐 · 认真你就输了
        </p>
      </div>
    </div>
  );
}
