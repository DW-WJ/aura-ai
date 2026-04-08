'use client';

import { useEffect, useRef, useState } from 'react';
import { BuildResult, Lang, ResultTab } from '@/types';
import RadarChart from './RadarChart';
import StatsBars from './StatsBars';
import Confetti from './Confetti';
import { analytics } from '@/lib/analytics';

// ─── Config toggle ───────────────────────────────────────────────────────────
// Set AI_ENHANCE = false to disable AI enhancement by default
const AI_ENHANCE_DEFAULT = true;

// ─── Types ───────────────────────────────────────────────────────────────────

type StreamPhase = 'idle' | 'streaming' | 'done' | 'error';

interface EnhancedMeta {
  name: string | null;
  typeName: string | null;
  desc: string | null;
  traits: string[];
  commLines: string[];
  workLines: string[];
  growLines: string[];
}

interface DisplayData {
  name: string;
  typeName: string;
  desc: string;
  traits: string[];
  configText: string;
  commLines: string[];
  workLines: string[];
  growLines: string[];
}

// ─── Translations ────────────────────────────────────────────────────────────

const T = {
  zh: {
    yourAI: '你的专属 AI',
    overview: '概览',
    detail: '详细分析',
    config: '配置文件',
    aiEnhanced: 'AI 增强版',
    dim: '人格维度',
    radar: '能力雷达',
    core: '核心性格',
    comm: '沟通风格',
    work: '工作模式',
    grow: '成长建议',
    cfg: '系统提示词',
    copy: '复制配置',
    dl: '下载 .md',
    copied: '已复制',
    restart: '重新配置',
    baseConfig: '基础配置',
    enhancedBadge: 'AI 增强版',
    aiThinking: '✨ AI 深度优化中…',
    aiDone: '✨ AI 增强完成',
    aiFailed: 'AI 增强失败，使用基础配置',
    toggle: 'AI 增强',
    on: '开',
    off: '关',
  },
  en: {
    yourAI: 'Your Personal AI',
    overview: 'Overview',
    detail: 'Deep Analysis',
    config: 'Config',
    aiEnhanced: 'AI Enhanced',
    dim: 'Dimensions',
    radar: 'Radar',
    core: 'Core Personality',
    comm: 'Communication',
    work: 'Work Mode',
    grow: 'Growth',
    cfg: 'System Prompt',
    copy: 'Copy Config',
    dl: 'Download .md',
    copied: 'Copied',
    restart: 'Start Over',
    baseConfig: 'Base Config',
    enhancedBadge: 'AI Enhanced',
    aiThinking: '✨ AI Deep Enhancement in progress…',
    aiDone: '✨ AI Enhancement Complete',
    aiFailed: 'AI Enhancement Failed — using base config',
    toggle: 'AI Enhancement',
    on: 'ON',
    off: 'OFF',
  },
} as const;

// ─── Main component ─────────────────────────────────────────────────────────

interface Props {
  result: BuildResult;
  lang: Lang;
  answers: Record<string, string>;
  onRestart: () => void;
}

export default function ResultPage({ result, lang, answers, onRestart }: Props) {
  const t = T[lang];
  const [tab, setTab] = useState<ResultTab>('overview');
  const [aiEnhanceEnabled, setAiEnhanceEnabled] = useState(AI_ENHANCE_DEFAULT);
  const [streamText, setStreamText] = useState('');
  const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
  const [modelName, setModelName] = useState('');
  const [enhancedMeta, setEnhancedMeta] = useState<EnhancedMeta | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTriggered = useRef(false);
  const streamRef = useRef<HTMLDivElement>(null);

  // Auto-switch to detail tab when AI enhance finishes
  useEffect(() => {
    if (streamPhase === 'done' && tab === 'overview') {
      setTab('detail');
    }
  }, [streamPhase, tab]);

  // Trigger confetti once when result page mounts
  useEffect(() => {
    if (confettiTriggered.current) return;
    confettiTriggered.current = true;
    // Small delay so it plays after page is visible
    const t = setTimeout(() => setShowConfetti(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Build display data: prefer AI-enhanced, fallback to base
  const display: DisplayData = {
    name: enhancedMeta?.name ?? result.name,
    typeName: enhancedMeta?.typeName ?? result.typeName,
    desc: enhancedMeta?.desc ?? result.desc,
    traits: enhancedMeta?.traits?.length ? enhancedMeta.traits : result.traits,
    configText: streamText || result.configText,
    commLines: enhancedMeta?.commLines?.length ? enhancedMeta.commLines : result.commLines,
    workLines: enhancedMeta?.workLines?.length ? enhancedMeta.workLines : result.workLines,
    growLines: enhancedMeta?.growLines?.length ? enhancedMeta.growLines : result.growLines,
  };

  const hasEnhanced = streamPhase === 'done' || streamPhase === 'error';

  // AI Stream effect
  useEffect(() => {
    if (!aiEnhanceEnabled || streamPhase !== 'idle') return;
    let cancelled = false;

    const start = async () => {
      setStreamPhase('streaming');
      setModelName('');
      setStreamText('');
      setEnhancedMeta(null);
      analytics.aiEnhanceStarted();

      try {
        const res = await fetch('/api/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, base_config: result.configText, lang }),
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;

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
              } else if (currentEvent === 'meta') {
                try {
                  setEnhancedMeta(JSON.parse(raw) as EnhancedMeta);
                } catch { /* ignore */ }
              } else if (currentEvent === 'delta') {
                try {
                  const parsed = JSON.parse(raw);
                  if (parsed.content) setStreamText(p => p + parsed.content);
                } catch {
                  setStreamText(p => p + raw);
                }
              } else if (currentEvent === 'error') {
                throw new Error(raw);
              } else if (currentEvent === 'done') {
                break;
              }
            }
          }
        }

        if (!cancelled) {
          setStreamPhase('done');
          analytics.aiEnhanceCompleted(modelName || 'unknown', true);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setErrorMsg(e instanceof Error ? e.message : String(e));
          setStreamPhase('error');
          analytics.aiEnhanceFailed(e instanceof Error ? e.message : 'unknown');
        }
      }
    };

    start();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiEnhanceEnabled]);

  // Auto-scroll
  useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [streamText]);

  // ── Utils ─────────────────────────────────────────────────────────────────

  const copyConfig = (text: string) => {
    navigator.clipboard.writeText(text);
    analytics.configCopied();
  };

  const downloadMd = (text: string, name: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name}-config.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    analytics.configDownloaded();
  };

  // Tabs
  const tabs: { id: ResultTab; label: string; badge?: boolean }[] = [
    { id: 'overview', label: t.overview },
    { id: 'detail', label: t.detail },
    { id: 'config', label: hasEnhanced ? t.baseConfig : t.cfg },
    ...(hasEnhanced ? [{ id: 'aiEnhance' as ResultTab, label: t.aiEnhanced, badge: true }] : []),
  ];

  const isStreaming = streamPhase === 'streaming';

  return (
    <div className="min-h-screen px-4 md:px-6 py-20 pb-16 flex flex-col items-center gap-5">

      {/* Confetti */}
      <Confetti active={showConfetti} />

      {/* AI Enhancement Toggle */}
      {streamPhase === 'idle' && (
        <div className="w-full max-w-[720px] flex items-center justify-end">
          <button
            onClick={() => setAiEnhanceEnabled(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer
              border transition-all duration-200
              ${aiEnhanceEnabled
                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                : 'bg-transparent border-white/[0.08] text-[#6b6b8a]'
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200
              ${aiEnhanceEnabled ? 'bg-[#10b981]' : 'bg-[#6b6b8a]'}`} />
            {t.toggle}
            <span className={`font-semibold ${aiEnhanceEnabled ? 'text-[#10b981]' : 'text-[#6b6b8a]'}`}>
              {aiEnhanceEnabled ? t.on : t.off}
            </span>
          </button>
        </div>
      )}

      {/* Hero Card */}
      <HeroCard display={display} isStreaming={isStreaming} streamPhase={streamPhase}
        modelName={modelName} errorMsg={errorMsg} enhancedMeta={enhancedMeta} t={t} />

      {/* Streaming Preview */}
      {isStreaming && (
        <StreamingCard streamRef={streamRef} streamText={streamText}
          modelName={modelName} t={t} />
      )}

      {/* Tabs */}
      <div className="w-full max-w-[720px] flex gap-2 flex-wrap px-2">
        {tabs.map(({ id, label, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-5 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 border
              ${tab === id
                ? 'bg-[#0e0e1a] border-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                : 'bg-transparent border-white/[0.06] text-[#6b6b8a] hover:border-[rgba(139,92,246,0.4)] hover:text-[#9898b0]'
              }`}>
            {label}
            {id === 'aiEnhance' && badge && (
              <span className="ml-1.5 text-[10px] bg-[#10b981]/20 text-[#10b981] px-1.5 py-0.5 rounded-full">NEW</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="w-full max-w-[720px] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6">
            <div className="text-[10px] tracking-[0.2em] text-[#6b6b8a] uppercase mb-5
              flex items-center gap-3 after:flex-1 after:h-px after:bg-white/[0.06]">
              {t.dim}
            </div>
            <StatsBars stats={result.stats} lang={lang} />
          </div>
          <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center min-h-[260px] justify-center">
            <div className="text-[10px] tracking-[0.2em] text-[#6b6b8a] uppercase mb-2 w-full
              flex items-center gap-3 after:flex-1 after:h-px after:bg-white/[0.06]">
              {t.radar}
            </div>
            <RadarChart stats={result.stats} lang={lang} />
          </div>
        </div>
      )}

      {/* ── Detail ── */}
      {tab === 'detail' && (
        <div className="w-full max-w-[720px] flex flex-col gap-4 animate-in fade-in duration-300">
          {([
            { id: 'ds1', title: t.core, content: display.desc },
            { id: 'ds2', title: t.comm, items: display.commLines },
            { id: 'ds3', title: t.work, items: display.workLines },
            { id: 'ds4', title: t.grow, items: display.growLines },
          ] as const).map(({ id, title, content, items }, delay) => (
            <div key={id}
              className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${delay * 100 + 100}ms` }}>
              <div className="text-[10px] tracking-[0.2em] text-[#8b5cf6] uppercase mb-4 flex items-center gap-3
                after:flex-1 after:h-px after:bg-[rgba(139,92,246,0.15)]">
                {title}
              </div>
              {items ? (
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#9090b0] text-[0.88rem] leading-relaxed">
                      <span className="text-[#8b5cf6] mt-0.5 flex-shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#9090b0] text-[0.9rem] leading-[1.8]">{content}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Config ── */}
      {tab === 'config' && (
        <ConfigPanel
          title={hasEnhanced ? t.baseConfig : t.cfg}
          config={result.configText}
          name={result.name}
          t={t}
          copyConfig={copyConfig}
          downloadMd={downloadMd}
          onRestart={onRestart}
          isEnhanced={false}
        />
      )}

      {/* ── AI Enhanced Config ── */}
      {tab === 'aiEnhance' && (
        <ConfigPanel
          title={t.enhancedBadge}
          config={streamText}
          name={`${display.name}-enhanced`}
          t={t}
          copyConfig={copyConfig}
          downloadMd={downloadMd}
          onRestart={onRestart}
          isEnhanced={true}
          modelBadge={modelName || undefined}
          streamRef={isStreaming ? streamRef : undefined}
          isStreaming={isStreaming}
        />
      )}
    </div>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────

interface HeroCardProps {
  display: DisplayData;
  isStreaming: boolean;
  streamPhase: StreamPhase;
  modelName: string;
  errorMsg: string;
  enhancedMeta: EnhancedMeta | null;
  t: typeof T.zh;
}

function HeroCard({ display, isStreaming, streamPhase, modelName, errorMsg, enhancedMeta, t }: HeroCardProps) {
  return (
    <div className="w-full max-w-[720px] bg-gradient-to-b from-[#0e0e1a] to-[#0a0a12]
      border border-white/[0.08] rounded-3xl p-6 md:p-9 relative overflow-hidden
      animate-in fade-in slide-in-from-bottom-6 duration-500">

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
          bg-gradient-to-r from-white via-[#e2e8f0] to-[#94a3b8] bg-clip-text text-transparent
          transition-all duration-500">
          {display.name}
          {isStreaming && (
            <span className="inline-block w-0.5 h-8 bg-[#8b5cf6] ml-1 animate-pulse align-middle" />
          )}
        </div>

        {/* Type */}
        {display.typeName && (
          <div className="text-[#8b5cf6] font-medium text-[0.95rem] mb-4 transition-all duration-300">
            {display.typeName}
          </div>
        )}

        {/* Description */}
        <p className="text-[#8892a6] leading-[1.75] text-[0.92rem] mb-6 transition-all duration-300">
          {display.desc || (isStreaming ? '✨ 正在生成专属描述…' : '')}
        </p>

        {/* Traits */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          {display.traits.length > 0 ? display.traits.map((trait, i) => (
            <span key={trait + i}
              className="bg-[#13131f] border border-white/[0.06] rounded-lg px-3 py-1.5
                text-[0.75rem] text-[#9898b0] animate-in fade-in"
              style={{ animationDelay: `${i * 40}ms` }}>
              {trait}
            </span>
          )) : isStreaming ? (
            <span className="text-[#6b6b8a] text-[0.75rem] animate-pulse">分析性格特征中…</span>
          ) : null}
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 flex-wrap">
          {isStreaming && (
            <div className="flex items-center gap-2 text-[#a78bfa] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
              {t.aiThinking}
              {modelName && (
                <span className="bg-[rgba(139,92,246,0.15)] text-[#a78bfa] px-2 py-0.5 rounded-full text-[10px]">
                  {modelName}
                </span>
              )}
            </div>
          )}
          {streamPhase === 'done' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full">
                ✓ {t.aiDone}
              </span>
              {modelName && (
                <span className="text-[10px] text-[#6b6b8a] bg-[rgba(255,255,255,0.05)] px-2.5 py-1 rounded-full">
                  {modelName}
                </span>
              )}
            </div>
          )}
          {streamPhase === 'error' && (
            <span className="text-[10px] text-[#f87171] bg-[#f87171]/10 px-2.5 py-1 rounded-full">
              ✗ {t.aiFailed}: {errorMsg}
            </span>
          )}
          {enhancedMeta && streamPhase === 'done' && (
            <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full">
              ✨ 元数据已同步
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Streaming Card ──────────────────────────────────────────────────────────

interface StreamingCardProps {
  streamRef: React.RefObject<HTMLDivElement | null>;
  streamText: string;
  modelName: string;
  t: typeof T.zh;
}

function StreamingCard({ streamRef, streamText, modelName, t }: StreamingCardProps) {
  return (
    <div className="w-full max-w-[720px] bg-[#0e0e1a] border border-[rgba(139,92,246,0.25)] rounded-2xl p-5 md:p-7 animate-in fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] tracking-[0.2em] text-[#8b5cf6] uppercase flex items-center gap-3
          after:flex-1 after:h-px after:bg-[rgba(139,92,246,0.15)]">
          ✦ {t.aiEnhanced}
        </div>
        {modelName && (
          <span className="text-[10px] text-[#a78bfa] bg-[rgba(139,92,246,0.15)] px-2.5 py-1 rounded-full animate-pulse">
            {modelName}
          </span>
        )}
      </div>
      <div
        ref={streamRef}
        className="font-mono text-[0.72rem] md:text-[0.8rem] text-[#8888a0] leading-[1.85]
          whitespace-pre-wrap bg-[#08080e] border border-white/[0.04] rounded-xl p-4 md:p-5
          min-h-[120px] max-h-[320px] overflow-y-auto scroll-smooth"
      >
        {streamText}
        <span className="inline-block w-2 h-3.5 bg-[#8b5cf6] ml-0.5 animate-pulse align-middle rounded-sm" />
      </div>
    </div>
  );
}

// ─── Config Panel ─────────────────────────────────────────────────────────────

interface ConfigPanelProps {
  title: string;
  config: string;
  name: string;
  t: typeof T.zh;
  copyConfig: (text: string) => void;
  downloadMd: (text: string, name: string) => void;
  onRestart: () => void;
  isEnhanced: boolean;
  modelBadge?: string;
  streamRef?: React.RefObject<HTMLDivElement | null>;
  isStreaming?: boolean;
}

function ConfigPanel({
  title, config, name, t, copyConfig, downloadMd, onRestart,
  isEnhanced, modelBadge, streamRef, isStreaming,
}: ConfigPanelProps) {
  return (
    <div className={`w-full max-w-[720px] bg-[#0e0e1a] border rounded-2xl p-5 md:p-7
      animate-in fade-in duration-300 ${
        isEnhanced ? 'border-[rgba(139,92,246,0.25)]' : 'border-white/[0.06]'
      }`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] tracking-[0.2em] text-[#6b6b8a] uppercase flex items-center gap-3
          after:flex-1 after:h-px after:bg-white/[0.06]">
          ✦ {title}
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-[10px] text-[#a78bfa]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
              生成中…
            </span>
          )}
          {modelBadge && !isStreaming && (
            <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full">
              {modelBadge}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        ref={streamRef}
        className="font-mono text-[0.72rem] md:text-[0.8rem] text-[#8888a0] leading-[1.85]
          whitespace-pre-wrap bg-[#08080e] border border-white/[0.04] rounded-xl p-4 md:p-5
          max-h-[450px] overflow-y-auto scroll-smooth"
      >
        {config || (isStreaming ? '' : '(无内容)')}
        {isStreaming && (
          <span className="inline-block w-2 h-3.5 bg-[#8b5cf6] ml-0.5 animate-pulse align-middle rounded-sm" />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5 flex-wrap">
        <button onClick={() => copyConfig(config)}
          className="flex-1 min-w-[120px] bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] border-none
            rounded-xl py-3 text-white text-[0.85rem] font-semibold cursor-pointer
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(139,92,246,0.4)]
            active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!config || isStreaming}>
          {t.copy}
        </button>
        <button onClick={() => downloadMd(config, name)}
          className="flex-1 min-w-[120px] bg-transparent border border-white/[0.08] rounded-xl py-3
            text-[#9898b0] text-[0.85rem] cursor-pointer transition-all duration-200
            flex items-center justify-center gap-2 hover:border-[rgba(139,92,246,0.5)] hover:text-white
            hover:bg-[rgba(139,92,246,0.05)] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!config || isStreaming}>
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
  );
}
