'use client';

import { useEffect, useRef, useState } from 'react';
import { BuildResult, Lang, ResultTab } from '@/types';
import RadarChart from './RadarChart';
import StatsBars from './StatsBars';

interface Props {
  result: BuildResult;
  lang: Lang;
  onRestart: () => void;
}

export default function ResultPage({ result, lang, onRestart }: Props) {
  const [tab, setTab] = useState<ResultTab>('overview');
  const confettiDone = useRef(false);

  const t = {
    zh: {
      yourAI: '你的专属 AI', overview: '概览', detail: '详细分析', config: '配置文件',
      dim: '人格维度', radar: '能力雷达', core: '核心性格',
      comm: '沟通风格', work: '工作模式', grow: '成长建议', cfg: '系统提示词',
      copy: '复制配置', dl: '下载 .md', copied: '已复制', restart: '重新配置',
    },
    en: {
      yourAI: 'Your Personal AI', overview: 'Overview', detail: 'Deep Analysis', config: 'Config',
      dim: 'Dimensions', radar: 'Radar', core: 'Core Personality',
      comm: 'Communication', work: 'Work Mode', grow: 'Growth', cfg: 'System Prompt',
      copy: 'Copy Config', dl: 'Download .md', copied: 'Copied', restart: 'Start Over',
    },
  }[lang];

  // Confetti
  useEffect(() => {
    if (confettiDone.current) return;
    confettiDone.current = true;
    const colors = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#ec4899', '#f59e0b'];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed;left:${Math.random() * 100}vw;top:-20px;
        width:${6 + Math.random() * 6}px;height:${6 + Math.random() * 6}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events:none;z-index:999;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation:confettiFall ${1.2 + Math.random()}s ease-in ${Math.random() * 0.5}s forwards;
        transform:rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }
  }, []);

  const copyConfig = () => {
    navigator.clipboard.writeText(result.configText);
  };

  const downloadMd = () => {
    const blob = new Blob([result.configText], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${result.name}-config.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="min-h-screen px-4 md:px-6 py-20 pb-16 flex flex-col items-center gap-5">
      {/* Hero Card */}
      <div className="w-full max-w-[720px] bg-gradient-to-b from-[#0e0e1a] to-[#0a0a12] 
        border border-white/[0.08] rounded-3xl p-6 md:p-9 relative overflow-hidden
        animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none
          bg-gradient-radial from-[rgba(139,92,246,0.2)] via-transparent to-transparent" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.25)]
            rounded-full px-3.5 py-[5px] text-[10px] tracking-widest uppercase mb-5 text-[#a78bfa]">
            ✦ {t.yourAI}
          </div>

          {/* Name */}
          <div className="text-[2.2rem] md:text-[3rem] font-bold tracking-[-0.04em] mb-2
            bg-gradient-to-r from-white via-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent">
            {result.name}
          </div>

          {/* Type */}
          <div className="text-[#8b5cf6] font-medium text-[0.95rem] mb-4">{result.typeName}</div>

          {/* Description */}
          <p className="text-[#8892a6] leading-[1.75] text-[0.92rem] mb-6">
            {result.desc}
          </p>

          {/* Traits */}
          <div className="flex flex-wrap gap-2">
            {result.traits.map((trait, i) => (
              <span
                key={trait}
                className="bg-[#13131f] border border-white/[0.06] rounded-lg px-3 py-1.5
                  text-[0.75rem] text-[#9898b0] animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${i * 60 + 200}ms` }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-[720px] flex gap-2 flex-wrap px-2">
        {(['overview', 'detail', 'config'] as ResultTab[]).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 border
              ${tab === id
                ? 'bg-[#0e0e1a] border-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                : 'bg-transparent border-white/[0.06] text-[#6b6b8a] hover:border-[rgba(139,92,246,0.4)] hover:text-[#9898b0]'
              }`}
          >
            {id === 'overview' ? t.overview : id === 'detail' ? t.detail : t.config}
          </button>
        ))}
      </div>

      {/* Panels */}
      {tab === 'overview' && (
        <div className="w-full max-w-[720px] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          {/* Stats */}
          <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-[10px] tracking-[0.2em] text-[#6b6b8a] uppercase mb-5
              flex items-center gap-3 after:flex-1 after:h-px after:bg-white/[0.06]">
              {t.dim}
            </div>
            <StatsBars stats={result.stats} lang={lang} />
          </div>

          {/* Radar */}
          <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
            <div className="text-[10px] tracking-[0.2em] text-[#6b6b8a] uppercase mb-2 w-full
              flex items-center gap-3 after:flex-1 after:h-px after:bg-white/[0.06]">
              {t.radar}
            </div>
            <RadarChart stats={result.stats} lang={lang} />
          </div>
        </div>
      )}

      {tab === 'detail' && (
        <div className="w-full max-w-[720px] flex flex-col gap-4 animate-in fade-in duration-300">
          {[
            { id: 'ds1', title: t.core, content: result.desc, delay: 0 },
            { id: 'ds2', title: t.comm, items: result.commLines, delay: 100 },
            { id: 'ds3', title: t.work, items: result.workLines, delay: 200 },
            { id: 'ds4', title: t.grow, items: result.growLines, delay: 300 },
          ].map((section) => (
            <div key={section.id}
              className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6
                animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${section.delay + 100}ms` }}>
              <div className="text-[10px] tracking-[0.2em] text-[#8b5cf6] uppercase mb-4 flex items-center gap-3
                after:flex-1 after:h-px after:bg-[rgba(139,92,246,0.15)]">
                {section.title}
              </div>
              {section.items ? (
                <ul className="flex flex-col gap-2.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#9090b0] text-[0.88rem] leading-relaxed">
                      <span className="text-[#8b5cf6] mt-0.5 flex-shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#9090b0] text-[0.9rem] leading-[1.8]">{section.content}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'config' && (
        <div className="w-full max-w-[720px] bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-5 md:p-7
          animate-in fade-in duration-300">
          <div className="text-[10px] tracking-[0.2em] text-[#6b6b8a] uppercase mb-4 flex items-center gap-3
            after:flex-1 after:h-px after:bg-white/[0.06]">
            {t.cfg}
          </div>
          
          <div className="font-mono text-[0.72rem] md:text-[0.8rem] text-[#8888a0] leading-[1.85] 
            whitespace-pre-wrap bg-[#08080e] border border-white/[0.04] rounded-xl p-4 md:p-5 
            max-h-[320px] overflow-y-auto">
            {result.configText}
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            <button onClick={copyConfig}
              className="flex-1 min-w-[120px] bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] border-none
                rounded-xl py-3 text-white text-[0.85rem] font-semibold cursor-pointer
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(139,92,246,0.4)]
                active:scale-[0.98]">
              {t.copy}
            </button>
            <button onClick={downloadMd}
              className="flex-1 min-w-[120px] bg-transparent border border-white/[0.08] rounded-xl py-3
                text-[#9898b0] text-[0.85rem] cursor-pointer transition-all duration-200
                flex items-center justify-center gap-2 hover:border-[rgba(139,92,246,0.5)] hover:text-white
                hover:bg-[rgba(139,92,246,0.05)]">
                ↓ {t.dl}
            </button>
            <button onClick={onRestart}
              className="bg-transparent border border-white/[0.06] rounded-xl px-5 py-3
                text-[#6b6b8a] text-[0.85rem] cursor-pointer transition-all duration-200
                hover:border-[rgba(139,92,246,0.4)] hover:text-[#9898b0]">
              {t.restart}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
