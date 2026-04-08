'use client';

import { Lang } from '@/types';
import { useEffect, useState, useRef } from 'react';

interface Props {
  lang: Lang;
}

// Animated dots component
function Dots() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);
  return <span>{'.'.repeat(dots)}</span>;
}

// Orbiting particle animation
function OrbitingOrbs() {
  return (
    <div className="relative w-24 h-24 mb-8">
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white text-lg shadow-[0_0_30px_rgba(139,92,246,0.5)]">
          ✦
        </div>
      </div>
      {/* Orbit 1 */}
      <div
        className="absolute inset-0 rounded-full border border-white/[0.08]"
        style={{ animation: 'spin 3s linear infinite' }}
      />
      {/* Orbit 2 */}
      <div
        className="absolute inset-0 rounded-full border border-dashed border-[#06b6d4]/[0.15]"
        style={{ animation: 'spin 5s linear infinite reverse' }}
      />
      {/* Particle 1 */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'orbit1 3s linear infinite',
          boxShadow: '0 0 8px #8b5cf6',
        }}
      />
      {/* Particle 2 */}
      <div
        className="absolute w-2 h-2 rounded-full bg-[#06b6d4]"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'orbit2 5s linear infinite',
          boxShadow: '0 0 6px #06b6d4',
        }}
      />
    </div>
  );
}

// Progress arc
function ProgressArc({ progress }: { progress: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  return (
    <svg width={116} height={116} className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={58} cy={58} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
      <circle
        cx={58} cy={58} r={r} fill="none"
        stroke="url(#progressGrad)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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

  const [step, setStep] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Step transitions
    const timers1 = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 1800),
    ];

    // Progress bar
    const timers2 = [
      setTimeout(() => setPercent(33), 300),
      setTimeout(() => setPercent(66), 1200),
      setTimeout(() => setPercent(100), 2100),
    ];

    return () => [...timers1, ...timers2].forEach(clearTimeout);
  }, []);

  const currentLabel = step === 0 ? '' : [t.step1, t.step2, t.step3][Math.min(step - 1, 2)];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes orbit1 {
          from { transform: translate(-50%,-50%) rotate(0deg) translateX(48px) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg) translateX(48px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: translate(-50%,-50%) rotate(0deg) translateX(48px) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg) translateX(48px) rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.4); }
          50% { box-shadow: 0 0 40px rgba(139,92,246,0.8); }
        }
      `}</style>

      {/* Orbiting animation */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        <ProgressArc progress={percent} />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            ✦
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-xl font-semibold text-white mb-1">{t.title}</div>
      <div className="text-[#6b6b8a] text-sm mb-2">{t.sub}</div>

      {/* Live step label */}
      {currentLabel && (
        <div className="text-[#8b5cf6] text-xs mb-8 h-5 animate-pulse font-mono">
          {currentLabel}
        </div>
      )}

      {/* Steps */}
      <div className="bg-[#0e0e1a] border border-white/[0.07] rounded-2xl px-8 py-6 flex flex-col gap-4 w-full max-w-[340px] text-left">
        {[t.s1, t.s2, t.s3].map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3.5 text-sm transition-all duration-500
              ${step > i ? 'text-[#10b981] opacity-100' : 'text-[#6b6b8a] opacity-40'}`}
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
