'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface SharedConfig {
  id: string;
  name: string;
  configText: string;
  statsJson: Record<string, unknown>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: { name: string | null; email: string };
}

export default function SharePage() {
  const params = useParams();
  const configId = params.id as string;

  const [config, setConfig] = useState<SharedConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    if (!configId) return;
    fetch(`/api/share/${configId}`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(data => setConfig(data.config))
      .catch(() => setError('配置不存在或未公开'))
      .finally(() => setLoading(false));
  }, [configId]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyFeedback('已复制');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const isJsonConfig = (() => {
    try { JSON.parse(config?.configText || ''); return true; } catch { return false; }
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-[#6b6b8a] text-sm animate-pulse">加载中…</div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-5xl mb-2">🔒</div>
        <div className="text-white font-semibold">{error || '配置不存在'}</div>
        <div className="text-sm text-[#6b6b8a]">这个配置可能是私密的，或者链接已失效</div>
        <Link href="/" className="mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
          去做自己的测评
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="max-w-[800px] mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-white">AURA</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.25)] rounded-full px-3.5 py-1.5 text-xs text-[#a78bfa] mb-4">
            ✦ 分享的 AI 配置
          </div>
          <h1 className="text-3xl font-bold mb-2">{config.name}</h1>
          <div className="flex items-center gap-3 text-xs text-[#6b6b8a]">
            <span>来自 {config.user?.name || config.user?.email?.split('@')[0]}</span>
            <span>·</span>
            <span>{new Date(config.updatedAt).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => copyToClipboard(config.configText)}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] border-none rounded-xl px-5 py-2.5 text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]">
            {copyFeedback || '复制配置'}
          </button>
          <Link href="/"
            className="bg-transparent border border-white/[0.08] rounded-xl px-5 py-2.5 text-[#9090b0] text-sm cursor-pointer hover:text-white hover:border-white/[0.2] transition-all text-center">
            我也要测评
          </Link>
        </div>

        {/* Config content */}
        <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl overflow-hidden">
          <pre className="p-6 text-sm text-[#b0b0c8] font-mono leading-[1.8] whitespace-pre-wrap max-h-[700px] overflow-y-auto scrollbar-thin">
            {isJsonConfig ? JSON.stringify(JSON.parse(config.configText), null, 2) : config.configText}
          </pre>
        </div>

        {/* Stats */}
        {Object.keys(config.statsJson).length > 0 && (
          <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 mt-4">
            <div className="text-xs text-[#6b6b8a] uppercase tracking-widest mb-4">测评数据</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(config.statsJson).map(([key, value]) => (
                <div key={key} className="bg-[#080810] rounded-xl p-3">
                  <div className="text-xs text-[#6b6b8a] mb-1">{key}</div>
                  <div className="text-sm text-white font-medium">
                    {typeof value === 'number' ? value : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-[#3a3a4a]">
          由 AURA AI 人格测评生成 · <Link href="/" className="text-[#8b5cf6] hover:underline">创建你自己的配置</Link>
        </div>
      </div>
    </div>
  );
}
