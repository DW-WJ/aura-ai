'use client';

import { useEffect, useRef } from 'react';
import { PersonalityStats, Lang } from '@/types';

interface Props {
  stats: PersonalityStats;
  lang: Lang;
}

export default function RadarChart({ stats, lang }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const labels = lang === 'zh'
    ? ['主动性', '清晰度', '诚实度', '执行力', '共情力']
    : ['Initiative', 'Clarity', 'Honesty', 'Execution', 'Empathy'];

  const vals = [stats.initiative, stats.clarity, stats.honesty, stats.execution, stats.empathy].map(v => v / 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 200, H = 200, cx = 100, cy = 100, r = 72;
    const n = 5;
    const step = (Math.PI * 2) / n;

    ctx.clearRect(0, 0, W, H);

    // grid rings
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = i * step - Math.PI / 2;
        const x = cx + Math.cos(a) * r * (ring / 4);
        const y = cy + Math.sin(a) * r * (ring / 4);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // axes
    for (let i = 0; i < n; i++) {
      const a = i * step - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // fill polygon
    ctx.beginPath();
    vals.forEach((v, i) => {
      const a = i * step - Math.PI / 2;
      const x = cx + Math.cos(a) * r * v;
      const y = cy + Math.sin(a) * r * v;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(139,92,246,0.55)');
    grad.addColorStop(1, 'rgba(6,182,212,0.2)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.85)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // dots & labels
    vals.forEach((v, i) => {
      const a = i * step - Math.PI / 2;
      const x = cx + Math.cos(a) * r * v;
      const y = cy + Math.sin(a) * r * v;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#8b5cf6';
      ctx.fill();

      const lx = cx + Math.cos(a) * (r + 20);
      const ly = cy + Math.sin(a) * (r + 20);
      ctx.fillStyle = 'rgba(144,144,176,0.85)';
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], lx, ly);
    });
  }, [stats, lang, labels, vals]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="block mx-auto"
    />
  );
}
