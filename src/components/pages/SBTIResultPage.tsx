'use client';

import { useState, useEffect, useRef } from 'react';
import { RARITY_COLORS } from '@/data/sbti-questions';

interface SBTIPersonality {
  id: string;
  name: string;
  emoji: string;
  description: string;
  detail: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

interface Props {
  result: SBTIPersonality;
  onRestart: () => void;
  personalityName?: string;
}

const RARITY_LABELS: Record<string, { zh: string; desc: string }> = {
  common: { zh: '普通', desc: '街上随便抓一个' },
  rare: { zh: '稀有', desc: '一百个人里有一个' },
  epic: { zh: '史诗', desc: '稀有到可以发朋友圈' },
  legendary: { zh: '传说', desc: '发出来评论区都在问' },
  mythic: { zh: '神话', desc: '全世界可能只有你一个' },
};

const RARITY_SCORE: Record<string, number> = {
  common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4,
};

const EMBEDDED_INTERPRETATIONS: Record<string, string[]> = {
  MALOU: [
    '你每天早上对着镜子里的自己说"今天要加油"，然后出门坐地铁继续刷手机。',
    '你的精神状态：间歇性踌躇满志，持续性躺平摸鱼。老板以为你在认真工作，实际上你在内心出演了一部《职场逃生指南》。',
    '工资到手的那一刻，你会先看一眼花呗账单，然后长叹一口气——算了，下个月再说。',
    '你对人生的规划是：没有规划。但你会在凌晨三点刷到一条"月薪三千到三万"的视频后，默默收藏，然后继续刷。',
  ],
  MONK: [
    '你的人生哲学是"无所谓"三个字。同事吵架？你：哦。老板画饼？你：嗯。朋友八卦？你：好的。',
    '你已经进化到"心静如水"的境界——不是内心平静，是真的什么都没在想了。',
    '你的口头禅："都可以"，"无所谓"，"随便"——但其实你的无所谓是因为你知道什么值得在乎。',
  ],
  OJBK: [
    '你经历了足够多的失望，已经进化成了"量子叠加态"——你选什么都对，因为你的内心已经放假了。',
    '你现在的情绪不是麻木，是一种高级的淡定。世界再疯狂，你都是那杯静置的凉白开。',
  ],
  MAMA: [
    '你永远是那个照顾别人的人。朋友哭了，你第一时间出现；同事累了，你主动分担工作；家人累了，你默默扛起责任。但你累的时候呢？……算了，你已经忘了自己上一次说"我好累"是什么时候了。',
  ],
};

// 默认通用解读（用于AI生成）
const DEFAULT_INTERPRETATION_PROMPT = `你是 SBTI 人格分析师。用户的人格类型是「{name}」，稀有度：{rarity}，「{desc}」。请用幽默毒舌的风格，生成一段 200-300 字的深度解读，包括：1. 这种人格在日常生活中的典型表现；2. 他们在社交中容易被误解的地方；3. 一句扎心但真实的人生建议。要求语言风格像朋友吐槽，不要一本正经。`;

export default function SBTIResultPage({ result, onRestart }: Props) {
  const [visible, setVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showAIDetail, setShowAIDetail] = useState(false);
  const [aiPhase, setAiPhase] = useState<'idle' | 'loading' | 'streaming' | 'done' | 'error'>('idle');
  const [aiText, setAiText] = useState('');
  const [modelName, setModelName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const cancelledRef = useRef(false);
  const aiBoxRef = useRef<HTMLDivElement>(null);

  const rarityLabel = RARITY_LABELS[result.rarity];
  const rarityScore = RARITY_SCORE[result.rarity];
  const rarityColor = RARITY_COLORS[result.rarity];

  useEffect(() => {
    setVisible(true);
  }, []);

  // 自动滚动
  useEffect(() => {
    if (aiPhase === 'streaming' && aiBoxRef.current) {
      aiBoxRef.current.scrollTop = aiBoxRef.current.scrollHeight;
    }
  }, [aiText, aiPhase]);

  const startAIEnhance = async () => {
    if (aiPhase === 'streaming') return;
    setShowAIDetail(true);
    setAiPhase('loading');
    setAiText('');
    setErrorMsg('');
    cancelledRef.current = false;

    const prompt = `你是 SBTI 人格分析师。用户的人格类型是「${result.name}」，稀有度：${rarityLabel.zh}，${result.description.slice(0, 100)}。请用幽默毒舌的风格，生成一段 200-300 字的深度解读，包括：1. 这种人格在日常生活中的典型表现（要具体搞笑）；2. 他们在社交中最容易被误解的地方；3. 一句扎心但真实的人生建议。要求语言像朋友吐槽，带点网络梗，不要一本正经。`;

    try {
      const res = await fetch('/api/sbti-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, lang: 'zh', personality: result }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';
      setAiPhase('streaming');

      while (true) {
        const { done, value } = await reader.read();
        if (done || cancelledRef.current) break;

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
                setAiText(p => p + (parsed.content ?? raw));
              } catch {
                setAiText(p => p + raw);
              }
            } else if (currentEvent === 'error') {
              throw new Error(raw);
            } else if (currentEvent === 'done') {
              break;
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
    const text = `我的 SBTI 人格是「${result.emoji} ${result.name}」\n${rarityLabel.zh}级人格 · ${rarityLabel.desc}\n\n来测测你是哪种发疯人格 👉 https://aura.dw.wjdc.ink`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('结果已复制到剪贴板！');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes typing { from { width: 0; } to { width: 100%; } }
        @keyframes blink { 50% { border-color: transparent; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .bounce-in { animation: bounceIn 0.8s ease both; }
        .shimmer-text { background: linear-gradient(90deg, ${rarityColor}, #fff, ${rarityColor}); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .shimmer-text { animation: shimmer 3s linear infinite; }
        .ai-streaming { border-color: ${rarityColor}60; background: ${rarityColor}08; }
        .streaming-cursor { display: inline-block; width: 2px; height: 1em; background: ${rarityColor}; margin-left: 2px; vertical-align: middle; animation: blink 0.7s infinite; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] animate-pulse"
          style={{ background: `radial-gradient(circle, ${rarityColor}40, transparent)`, top: '10%', left: '-15%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-[80px] animate-pulse"
          style={{ background: `radial-gradient(circle, ${rarityColor}60, transparent)`, bottom: '20%', right: '-5%', animationDelay: '1s' }} />
        <div className="absolute text-4xl opacity-10 animate-float" style={{ top: '15%', left: '8%' }}>{result.emoji}</div>
        <div className="absolute text-3xl opacity-10 animate-float" style={{ top: '60%', right: '10%', animationDelay: '1s' }}>🎭</div>
        <div className="absolute text-2xl opacity-10 animate-float" style={{ bottom: '25%', left: '15%', animationDelay: '2s' }}>💀</div>
      </div>

      <div className="relative z-10 max-w-md w-full">

        {/* Rarity badge */}
        <div className={`fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border`}
          style={{ borderColor: `${rarityColor}50`, backgroundColor: `${rarityColor}15`, color: rarityColor }}>
          <span>{rarityLabel.zh}</span>
          <span className="opacity-50">·</span>
          <span className="text-xs opacity-75">{rarityLabel.desc}</span>
        </div>

        {/* Emoji */}
        <div className="bounce-in text-8xl mb-6">{result.emoji}</div>

        {/* Name */}
        <h1 className={`fade-up text-5xl font-black mb-4 shimmer-text`} style={{ animationDelay: '300ms' }}>
          {result.name}
        </h1>

        {/* ID */}
        <div className="fade-up text-sm text-[#4a4a6a] mb-8 font-mono tracking-widest" style={{ animationDelay: '400ms' }}>
          SBTI-{result.id}
        </div>

        {/* Divider */}
        <div className="fade-up w-16 h-0.5 mx-auto mb-8 rounded-full" style={{ background: rarityColor, animationDelay: '500ms' }} />

        {/* Description */}
        <div className="fade-up bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-6 mb-4 text-left" style={{ animationDelay: '600ms' }}>
          <p className="text-[#c0c0d0] leading-relaxed text-sm">{result.description}</p>
        </div>

        {/* Detail toggle */}
        <button onClick={() => setShowDetail(!showDetail)} className="fade-up text-sm text-[#6b6b8a] hover:text-white transition-colors mb-6" style={{ animationDelay: '700ms' }}>
          {showDetail ? '收起基础解读 ↑' : '展开基础解读 ↓'}
        </button>

        {showDetail && (
          <div className="fade-up bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-6 mb-4 text-left">
            <h3 className="text-sm font-bold mb-3" style={{ color: rarityColor }}>🔮 基础解读</h3>
            <p className="text-[#a0a0b0] text-sm leading-relaxed">{result.detail}</p>
          </div>
        )}

        {/* AI 深度解读 section */}
        <div className="fade-up mb-6" style={{ animationDelay: '650ms' }}>
          {!showAIDetail ? (
            <button
              onClick={startAIEnhance}
              className="w-full py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200 active:scale-[0.98] hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${rarityColor}, ${rarityColor}cc)` }}
            >
              🤖 AI 深度解读
            </button>
          ) : (
            <div className="text-left ai-streaming border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: rarityColor }}>
                    {aiPhase === 'idle' ? '准备中...' :
                     aiPhase === 'loading' ? '🔥 正在召唤 AI...' :
                     aiPhase === 'streaming' ? '🤖 AI 解读中' :
                     aiPhase === 'done' ? '✅ AI 解读完成' : '❌ 出错了'}
                  </span>
                  {modelName && <span className="text-xs text-[#6b6b8a]">{modelName}</span>}
                </div>
                {aiPhase === 'streaming' && (
                  <span className="text-xs text-[#6b6b8a]">
                    <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: rarityColor }} />
                  </span>
                )}
              </div>

              {aiPhase === 'loading' && (
                <div className="flex items-center gap-2 py-2">
                  <span className="text-2xl spin">⚡</span>
                  <span className="text-sm text-[#6b6b8a]">AI 正在加载模型中...</span>
                </div>
              )}

              {aiPhase === 'error' && (
                <div className="py-2">
                  <p className="text-sm text-red-400">出错了：{errorMsg}</p>
                  <button onClick={() => { setAiPhase('idle'); startAIEnhance(); }} className="mt-2 text-xs text-[#6b6b8a] hover:text-white underline">
                    重试
                  </button>
                </div>
              )}

              {(aiPhase === 'streaming' || aiPhase === 'done') && (
                <div ref={aiBoxRef} className="text-sm text-[#b0b0c0] leading-relaxed max-h-64 overflow-y-auto scrollbar-thin">
                  {aiText}
                  {aiPhase === 'streaming' && <span className="streaming-cursor" />}
                </div>
              )}

              {aiPhase === 'done' && (
                <button
                  onClick={startAIEnhance}
                  className="mt-3 text-xs text-[#6b6b8a] hover:text-white transition-colors"
                >
                  重新生成 ↻
                </button>
              )}
            </div>
          )}
        </div>

        {/* Rarity stars */}
        <div className="fade-up flex justify-center gap-1 mb-8" style={{ animationDelay: '500ms' }}>
          {[0,1,2,3,4].map(i => (
            <span key={i} className="text-lg">
              {i < rarityScore ? <span style={{ color: rarityColor }}>★</span> : <span className="text-[#2a2a3e]">★</span>}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="fade-up space-y-3" style={{ animationDelay: '800ms' }}>
          <button onClick={handleShare}
            className="w-full py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${rarityColor}, ${rarityColor}cc)` }}>
            分享我的发疯人格 📤
          </button>
          <button onClick={onRestart}
            className="w-full py-3.5 rounded-xl font-bold text-base bg-[#1a1a2e] border border-[#2a2a3e] text-[#a0a0c0] hover:bg-[#1f1f33] hover:text-white transition-all duration-200 active:scale-[0.98]">
            再发疯一次 🔄
          </button>
        </div>

        <p className="fade-up text-xs text-[#3a3a4a] mt-8" style={{ animationDelay: '900ms' }}>
          SBTI · 没有科学依据 · 纯属娱乐 · 认真你就输了
        </p>
      </div>
    </div>
  );
}
