'use client';

import { Lang } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  lang: Lang;
}

const DURATION = 2600; // matches the 2.6s timeout in page.tsx

export default function LoadingPage({ lang }: Props) {
  const t = lang === 'zh'
    ? {
        title: '正在生成你的专属 AI',
        sub: '深度分析中，请稍候',
        s1: '解析 16 维度人格特征',
        s2: '构建专属人格模型',
        s3: '生成高质量配置文件',
        step1: '读取答题数据…',
        step2: '计算能力矩阵…',
        step3: '生成配置文本…',
      }
    : {
        title: 'Generating Your AI',
        sub: 'Deep analysis in progress…',
        s1: 'Analyzing 16 personality dimensions',
        s2: 'Building your personality model',
        s3: 'Generating high-quality config',
        step1: 'Reading answers…',
        step2: 'Computing ability matrix…',
        step3: 'Generating config…',
      };

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      setElapsed(now - start);
      if (now - start < DURATION + 200) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const progress = Math.min(100, (elapsed / DURATION) * 100);
  const step = elapsed < 400 ? 0 : elapsed < 1100 ? 1 : elapsed < 1800 ? 2 : 3;
  const currentLabel = step === 0 ? '' : [t.step1, t.step2, t.step3][Math.min(step - 1, 2)];

  const dotCount = Math.floor((elapsed / 400) % 4);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.4); }
          50% { box-shadow: 0 0 40px rgba(139,92,246,0.8); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8" style={{ animation: 'float 3s ease-in-out infinite' }}>
        {/* Progress ring */}
        <svg
          width="80" height="80"
          style={{ transform: 'rotate(-90deg)' }}
          className="absolute inset-0"
        >
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="3"
          />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="url(#loadingGrad)" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 213.6} 213.6`}
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
          <defs>
            <linearGradient id="loadingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center icon */}
        <div
          className="absolute inset-0 flex items-center justify-center text-xl"
          style={{ animation: 'glow 2s ease-in-out infinite' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold">
            ✦
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-xl font-semibold text-white mb-1">{t.title}</div>
      <div className="text-[#6b6b8a] text-sm mb-1">{t.sub}</div>

      {/* Live step label */}
      <div className="text-[#8b5cf6] text-xs mb-8 h-5 font-mono">
        {currentLabel}
        {'.'.repeat(Math.max(0, dotCount))}
      </div>

      {/* Steps */}
      <div className="bg-[#0e0e1a] border border-white/[0.07] rounded-2xl px-8 py-6 flex flex-col gap-4 w-full max-w-[340px] text-left">
        {[t.s1, t.s2, t.s3].map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3.5 text-sm transition-all duration-300
              ${step > i ? 'text-[#10b981]' : 'text-[#6b6b8a]'}`}
          >
            <span className="w-5 flex-shrink-0 text-center">
              {step > i ? '✓' : '○'}
            </span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
