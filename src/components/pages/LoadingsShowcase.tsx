'use client';

import { useState } from 'react';

interface Animation {
  id: string;
  name: string;
  nameEn: string;
  css: string;
}

const animations: Animation[] = [
  {
    id: 'neon-pulse',
    name: '霓虹脉冲',
    nameEn: 'Neon Pulse',
    css: `@keyframes neon-pulse {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 8px #00ffff) drop-shadow(0 0 20px #00ffff); }
  50% { opacity: 0.4; filter: drop-shadow(0 0 4px #00ffff); }
}
.loader-neon-pulse {
  width: 60px;
  height: 60px;
  border: 3px solid transparent;
  border-top: 3px solid #00ffff;
  border-right: 3px solid #ff00ff;
  border-radius: 50%;
  animation: neon-pulse 1.2s ease-in-out infinite;
  box-shadow: inset 0 0 20px rgba(0,255,255,0.1);
}`,
  },
  {
    id: 'cyber-ring',
    name: '赛博光环',
    nameEn: 'Cyber Ring',
    css: `@keyframes cyber-spin {
  0% { transform: rotate(0deg); stroke-dashoffset: 220; }
  50% { stroke-dashoffset: 55; }
  100% { transform: rotate(360deg); stroke-dashoffset: 220; }
}
.loader-cyber-ring {
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 0 6px #00ffff);
}
.loader-cyber-ring circle {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 20 10;
  stroke: #00ffff;
  animation: cyber-spin 1.4s linear infinite;
  transform-origin: center;
}
.loader-cyber-ring .inner {
  stroke: #ff00ff;
  animation-duration: 0.8s;
  animation-direction: reverse;
}`,
  },
  {
    id: 'hologram',
    name: '全息投影',
    nameEn: 'Hologram Scan',
    css: `@keyframes holo-scan {
  0% { transform: perspective(200px) rotateX(-20deg) translateY(0); opacity: 0.8; }
  100% { transform: perspective(200px) rotateX(-20deg) translateY(-40px); opacity: 0; }
}
@keyframes holo-bars {
  0%, 100% { height: 20%; opacity: 0.3; }
  50% { height: 80%; opacity: 1; }
}
.loader-hologram {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 48px;
}
.loader-hologram .bar {
  width: 6px;
  background: linear-gradient(to top, #00ffff, #00ff88);
  border-radius: 2px;
  animation: holo-bars 0.8s ease-in-out infinite;
  box-shadow: 0 0 8px #00ffff;
}
.loader-hologram .bar:nth-child(1) { animation-delay: 0s; }
.loader-hologram .bar:nth-child(2) { animation-delay: 0.1s; }
.loader-hologram .bar:nth-child(3) { animation-delay: 0.2s; }
.loader-hologram .bar:nth-child(4) { animation-delay: 0.3s; }
.loader-hologram .bar:nth-child(5) { animation-delay: 0.4s; }
.loader-hologram::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 20px;
  background: linear-gradient(transparent, rgba(0,255,255,0.15));
  animation: holo-scan 1.6s linear infinite;
  bottom: 0;
}`,
  },
  {
    id: 'glitch-text',
    name: '故障文字',
    nameEn: 'Glitch Text',
    css: `@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); filter: drop-shadow(0 0 8px #ff00ff); }
  92% { transform: translate(-3px, 1px); filter: drop-shadow(2px 0 #00ffff) drop-shadow(-2px 0 #ff0000); }
  94% { transform: translate(3px, -1px); filter: drop-shadow(-2px 0 #00ffff) drop-shadow(2px 0 #ff0000); }
  96% { transform: translate(-1px, 2px); }
  98% { transform: translate(1px, -2px); }
}
@keyframes glitch-clip {
  0%, 95% { clip-path: inset(0 0 100% 0); }
  97% { clip-path: inset(30% 0 50% 0); }
  99% { clip-path: inset(60% 0 20% 0); }
  100% { clip-path: inset(0 0 100% 0); }
}
.loader-glitch {
  font-family: 'Courier New', monospace;
  font-size: 28px;
  font-weight: bold;
  color: #00ffff;
  animation: glitch 2s infinite;
  position: relative;
  letter-spacing: 4px;
}`,
  },
  {
    id: 'orbit-dots',
    name: '轨道星点',
    nameEn: 'Orbital Dots',
    css: `@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes orbit-dot {
  0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 6px currentColor; }
  50% { transform: scale(0.5); opacity: 0.5; }
}
.loader-orbit {
  width: 64px;
  height: 64px;
  position: relative;
  animation: orbit-spin 2s linear infinite;
}
.loader-orbit .orbit-ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0,255,255,0.2);
  border-radius: 50%;
}
.loader-orbit .dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: orbit-dot 1s ease-in-out infinite;
}
.loader-orbit .dot-1 { top: 0; left: 50%; transform: translateX(-50%); background: #00ffff; animation-delay: 0s; }
.loader-orbit .dot-2 { bottom: 0; left: 50%; transform: translateX(-50%); background: #ff00ff; animation-delay: 0.33s; }
.loader-orbit .dot-3 { top: 50%; right: 0; transform: translateY(-50%); background: #00ff88; animation-delay: 0.66s; }`,
  },
  {
    id: 'matrix-rain',
    name: '代码雨',
    nameEn: 'Matrix Rain',
    css: `@keyframes matrix-fall {
  0% { transform: translateY(-100%); opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}
@keyframes matrix-glow {
  0%, 100% { color: #00ff00; text-shadow: 0 0 8px #00ff00; }
  50% { color: #88ff88; text-shadow: 0 0 16px #00ff00; }
}
.loader-matrix {
  display: flex;
  gap: 5px;
  align-items: flex-start;
  height: 56px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(0,20,0,0.3), transparent);
  border: 1px solid rgba(0,255,0,0.2);
  padding: 8px;
}
.loader-matrix .col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  animation: matrix-fall 1.4s linear infinite;
  color: #00ff00;
  text-shadow: 0 0 6px #00ff00;
}
.loader-matrix .col:nth-child(1) { animation-delay: 0s; animation-duration: 1.2s; }
.loader-matrix .col:nth-child(2) { animation-delay: 0.3s; animation-duration: 1.6s; }
.loader-matrix .col:nth-child(3) { animation-delay: 0.7s; animation-duration: 1.3s; }
.loader-matrix .col:nth-child(4) { animation-delay: 0.2s; animation-duration: 1.5s; }
.loader-matrix .col:nth-child(5) { animation-delay: 0.5s; animation-duration: 1.1s; }`,
  },
  {
    id: 'cyber-squares',
    name: '方块矩阵',
    nameEn: 'Square Grid',
    css: `@keyframes square-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; border-color: rgba(0,255,255,0.3); }
  50% { transform: scale(1.15); opacity: 1; border-color: #00ffff; box-shadow: 0 0 12px #00ffff; }
}
.loader-squares {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 60px;
  height: 60px;
}
.loader-squares .sq {
  border: 2px solid rgba(0,255,255,0.4);
  border-radius: 4px;
  background: rgba(0,255,255,0.05);
  animation: square-pulse 1.2s ease-in-out infinite;
}
.loader-squares .sq:nth-child(1) { animation-delay: 0s; }
.loader-squares .sq:nth-child(2) { animation-delay: 0.1s; border-color: rgba(255,0,255,0.4); }
.loader-squares .sq:nth-child(3) { animation-delay: 0.2s; }
.loader-squares .sq:nth-child(4) { animation-delay: 0.3s; border-color: rgba(255,0,255,0.4); }
.loader-squares .sq:nth-child(5) { animation-delay: 0.4s; border-color: #ff00ff; box-shadow: 0 0 12px #ff00ff; }
.loader-squares .sq:nth-child(6) { animation-delay: 0.5s; border-color: rgba(255,0,255,0.4); }
.loader-squares .sq:nth-child(7) { animation-delay: 0.6s; }
.loader-squares .sq:nth-child(8) { animation-delay: 0.7s; border-color: rgba(255,0,255,0.4); }
.loader-squares .sq:nth-child(9) { animation-delay: 0.8s; }`,
  },
  {
    id: 'radar-sweep',
    name: '雷达扫描',
    nameEn: 'Radar Sweep',
    css: `@keyframes radar-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes radar-ping {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
.loader-radar {
  width: 64px;
  height: 64px;
  border: 2px solid rgba(0,255,136,0.3);
  border-radius: 50%;
  position: relative;
}
.loader-radar::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2px;
  background: linear-gradient(to right, #00ff88, transparent);
  transform-origin: left center;
  animation: radar-spin 2s linear infinite;
  box-shadow: 0 0 8px #00ff88;
}
.loader-radar .ping {
  position: absolute;
  inset: 0;
  border: 1px solid #00ff88;
  border-radius: 50%;
  animation: radar-ping 2s ease-out infinite;
}
.loader-radar .ring {
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(0,255,136,0.2);
  border-radius: 50%;
}
.loader-radar .ring:nth-child(3) {
  inset: 24px;
}`,
  },
  {
    id: 'breach-ring',
    name: '裂隙光环',
    nameEn: 'Breach Ring',
    css: `@keyframes breach-expand {
  0% { transform: scale(0.5); opacity: 1; box-shadow: 0 0 0 0 rgba(255,0,255,0.6); }
  100% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 20px rgba(255,0,255,0); }
}
.loader-breach {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-breach .ring {
  position: absolute;
  border: 3px solid #ff00ff;
  border-radius: 50%;
  box-shadow: 0 0 12px #ff00ff;
}
.loader-breach .ring:nth-child(1) { width: 20px; height: 20px; animation: breach-expand 1.5s ease-out infinite; }
.loader-breach .ring:nth-child(2) { width: 20px; height: 20px; animation: breach-expand 1.5s ease-out 0.5s infinite; }
.loader-breach .ring:nth-child(3) { width: 20px; height: 20px; animation: breach-expand 1.5s ease-out 1s infinite; }
.loader-breach .core {
  width: 8px;
  height: 8px;
  background: #ff00ff;
  border-radius: 50%;
  box-shadow: 0 0 16px #ff00ff;
  animation: neon-pulse 1s ease-in-out infinite;
}`,
  },
  {
    id: 'hex-spin',
    name: '六边形旋转',
    nameEn: 'Hexagon Spin',
    css: `@keyframes hex-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes hex-stroke {
  0% { stroke-dashoffset: 200; opacity: 0.3; }
  50% { stroke-dashoffset: 100; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0.3; }
}
.loader-hex {
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 0 8px #00ffff);
}
.loader-hex polygon {
  fill: none;
  stroke: #00ffff;
  stroke-width: 2;
  stroke-dasharray: 30 10;
  animation: hex-rotate 3s linear infinite, hex-stroke 1.5s ease-in-out infinite;
  transform-origin: center;
}`,
  },
  {
    id: 'cyber-text',
    name: '打字脉冲',
    nameEn: 'Cyber Type',
    css: `@keyframes typing-bar {
  0%, 100% { width: 4px; opacity: 1; box-shadow: 0 0 8px #00ffff; }
  50% { width: 16px; opacity: 0.4; box-shadow: 0 0 4px #00ffff; }
}
@keyframes typing-glow {
  0%, 100% { color: #00ffff; text-shadow: 0 0 10px #00ffff; }
  50% { color: #ffffff; text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff; }
}
.loader-typing {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #00ffff;
  animation: typing-glow 2s ease-in-out infinite;
}
.loader-typing .char {
  animation: typing-glow 2s ease-in-out infinite;
}
.loader-typing .bar {
  width: 4px;
  height: 24px;
  background: #00ffff;
  animation: typing-bar 0.8s ease-in-out infinite;
  border-radius: 2px;
  margin-left: 2px;
}`,
  },
  {
    id: 'dual-spinner',
    name: '双环旋转',
    nameEn: 'Dual Spinner',
    css: `@keyframes dual-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.loader-dual {
  width: 64px;
  height: 64px;
  position: relative;
  filter: drop-shadow(0 0 6px #00ffff);
}
.loader-dual .outer {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: #00ffff;
  border-radius: 50%;
  animation: dual-spin 1.2s linear infinite;
}
.loader-dual .inner {
  position: absolute;
  inset: 12px;
  border: 3px solid transparent;
  border-bottom-color: #ff00ff;
  border-radius: 50%;
  animation: dual-spin 0.8s linear infinite reverse;
}
.loader-dual .dot {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff88;
}`,
  },
];

export default function LoadingsShowcase() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCSS = async (anim: Animation) => {
    try {
      await navigator.clipboard.writeText(anim.css);
      setCopied(anim.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = anim.css;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(anim.id);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-cyan-500/20 bg-gradient-to-r from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-block mb-4 px-3 py-1 text-xs tracking-widest text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-500/5">
            CSS ANIMATION COLLECTION
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            赛博朋克加载动画
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            点击卡片复制 CSS 代码，免费开源，即插即用
          </p>
          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              12 种动画
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              纯 CSS 实现
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
              零依赖
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {animations.map((anim) => (
            <div
              key={anim.id}
              className="group relative bg-[#0d1117] border border-[#1f2937] rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] cursor-pointer"
              onClick={() => copyCSS(anim)}
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top, rgba(0,255,255,0.08) 0%, transparent 70%)`,
                }}
              />

              {/* Preview area */}
              <div className="relative h-40 flex items-center justify-center bg-[#080810] border-b border-[#1f2937] overflow-hidden">
                {/* Scan line effect */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
                  }}
                />

                <div className="relative">
                  <style>{anim.css}</style>
                  <LoaderPreview id={anim.id} />
                </div>

                {/* Copy overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied === anim.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${copied === anim.id ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'}`}>
                    {copied === anim.id ? '✓ 已复制' : '点击复制 CSS'}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{anim.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{anim.nameEn}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#1f2937] flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-cyan-500/50 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 text-sm">
          <p>纯 CSS 动画 · 免授权 · 可商用 · Made with ⚡ for AURA</p>
        </div>
      </div>
    </div>
  );
}

function LoaderPreview({ id }: { id: string }) {
  switch (id) {
    case 'neon-pulse':
      return <div className="loader-neon-pulse" />;
    case 'cyber-ring':
      return (
        <svg className="loader-cyber-ring" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" />
          <circle className="inner" cx="32" cy="32" r="16" />
        </svg>
      );
    case 'hologram':
      return (
        <div className="loader-hologram relative">
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      );
    case 'glitch-text':
      return <div className="loader-glitch">LOAD</div>;
    case 'orbit-dots':
      return (
        <div className="loader-orbit">
          <div className="orbit-ring" />
          <div className="dot dot-1" />
          <div className="dot dot-2" />
          <div className="dot dot-3" />
        </div>
      );
    case 'matrix-rain':
      return (
        <div className="loader-matrix">
          {[...'01!@'].map((c, i) => (
            <div key={i} className="col">{[...Array(6)].map((_, j) => <div key={j}>{c}</div>)}</div>
          ))}
        </div>
      );
    case 'cyber-squares':
      return (
        <div className="loader-squares">
          {[...Array(9)].map((_, i) => <div key={i} className="sq" />)}
        </div>
      );
    case 'radar-sweep':
      return (
        <div className="loader-radar">
          <div className="ping" />
          <div className="ring" />
          <div className="ring" />
        </div>
      );
    case 'breach-ring':
      return (
        <div className="loader-breach">
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
          <div className="core" />
        </div>
      );
    case 'hex-spin':
      return (
        <svg className="loader-hex" viewBox="0 0 100 100">
          <polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" />
        </svg>
      );
    case 'cyber-text':
      return (
        <div className="loader-typing">
          {[...'LOAD'].map((c, i) => (
            <span key={i} className="char">{c}</span>
          ))}
          <span className="bar" />
        </div>
      );
    case 'dual-spinner':
      return (
        <div className="loader-dual">
          <div className="outer" />
          <div className="inner" />
          <div className="dot" />
        </div>
      );
    default:
      return null;
  }
}
