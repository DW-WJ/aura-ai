'use client';

import { useEffect, useRef } from 'react';
import { PersonalityStats, Lang } from '@/types';

interface Props {
  stats: PersonalityStats;
  lang: Lang;
}

const DIMENSIONS = ['initiative', 'clarity', 'honesty', 'execution', 'empathy'] as const;

const LABELS_ZH: Record<string, string> = {
  initiative: '主动性',
  clarity: '清晰度',
  honesty: '诚实度',
  execution: '执行力',
  empathy: '共情力',
};

const LABELS_EN: Record<string, string> = {
  initiative: 'Initiative',
  clarity: 'Clarity',
  honesty: 'Honesty',
  execution: 'Execution',
  empathy: 'Empathy',
};

const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#ec4899'];

export default function RadarChart({ stats, lang }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labels = lang === 'zh' ? LABELS_ZH : LABELS_EN;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height || 200);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = (size / 2) * 0.72;
    const n = DIMENSIONS.length;
    const angleStep = (2 * Math.PI) / n;

    // Background rings
    for (let ring = 1; ring <= 4; ring++) {
      const r = (maxR / 4) * ring;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,0.04)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
      ctx.strokeStyle = `rgba(255,255,255,0.06)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Animated data fill
    const values = DIMENSIONS.map(d => (stats[d] as number) / 100);

    // Draw fill area with gradient
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = maxR * values[i];
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grad.addColorStop(0, 'rgba(139,92,246,0.35)');
    grad.addColorStop(1, 'rgba(99,102,241,0.08)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw colored stroke
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = maxR * values[i];
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(139,92,246,0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = maxR * values[i];
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = COLORS[i];
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 5.5, 0, 2 * Math.PI);
      ctx.strokeStyle = `${COLORS[i]}50`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Labels
    const labelR = maxR + 22;
    ctx.font = `11px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + labelR * Math.cos(angle);
      const y = cy + labelR * Math.sin(angle);

      // Score badge
      const score = Math.round(values[i] * 100);
      const badgeX = cx + (maxR * values[i] + 14) * Math.cos(angle);
      const badgeY = cy + (maxR * values[i] + 14) * Math.sin(angle);

      ctx.font = `bold 10px system-ui, sans-serif`;
      ctx.fillStyle = COLORS[i];
      ctx.fillText(`${score}`, badgeX, badgeY);

      // Label
      ctx.font = `11px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#6b6b8a';
      ctx.fillText(labels[DIMENSIONS[i]], x, y);
    }
  }, [stats, labels]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: 180 }}
    />
  );
}
