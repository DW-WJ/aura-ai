'use client';

import { Lang } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
  lang: Lang;
}

export default function LoadingPage({ lang }: Props) {
  const t = lang === 'zh'
    ? { title: '正在生成你的专属 AI', sub: '这只需要几秒钟…', s1: '分析 16 维度性格特征', s2: '构建专属人格模型', s3: '生成高质量配置文件' }
    : { title: 'Generating Your AI', sub: 'This only takes a few seconds…', s1: 'Analyzing 16 personality dimensions', s2: 'Building your personality model', s3: 'Generating high-quality config' };

  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* rings */}
      <div className="relative w-20 h-20 mb-7">
        <div className="absolute inset-0 rounded-full border-2 border-white/[0.07] border-t-[#8b5cf6] animate-spin" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-b-[#06b6d4] animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center text-xl">✦</div>
      </div>

      <div className="text-lg font-semibold mb-2">{t.title}</div>
      <div className="text-[#6b6b8a] text-sm mb-10">{t.sub}</div>

      {/* steps */}
      <div className="bg-[#0e0e1a] border border-white/[0.07] rounded-2xl px-8 py-6 flex flex-col gap-3.5 w-full max-w-[320px] text-left">
        {[t.s1, t.s2, t.s3].map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 text-sm transition-all duration-500
              ${step > i ? 'text-[#10b981] opacity-100' : 'text-[#6b6b8a] opacity-50'}`}
          >
            <span className="w-5 text-center text-base">
              {step > i ? '✦' : '○'}
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
