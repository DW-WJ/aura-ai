import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AURA · AI Personality Configurator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #080810 0%, #0d0d1a 50%, #0a0a14 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)' }} />

        {/* Logo badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 700 }}>
            A
          </div>
          <span style={{ fontSize: 42, fontWeight: 700, color: 'white', letterSpacing: '-0.03em' }}>AURA</span>
        </div>

        {/* Main headline */}
        <div style={{ fontSize: 52, fontWeight: 800, color: 'white', textAlign: 'center', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          打造你的专属 AI 助手
        </div>

        {/* Sub headline */}
        <div style={{ fontSize: 24, color: '#8b5cf6', textAlign: 'center', marginBottom: 40 }}>
          通过 16 道题，生成独一无二的人格配置
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 48 }}>
          {[
            { num: '16', label: '精准题目' },
            { num: '5', label: '能力维度' },
            { num: '∞', label: 'AI 风格' },
          ].map(({ num, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
              <div style={{ fontSize: 16, color: '#6b6b8a' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div style={{ position: 'absolute', bottom: 24, fontSize: 14, color: '#4a4a6a' }}>
          aura-app · AI 人格配置器 · 免费使用
        </div>
      </div>
    ),
    { ...size }
  );
}
