'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ConfigDetail {
  id: string;
  name: string;
  configText: string;
  statsJson: Record<string, unknown>;
  answersJson: Record<string, unknown>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

type Tab = 'config' | 'stats' | 'edit';

export default function ConfigDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const configId = params.id as string;

  const [config, setConfig] = useState<ConfigDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('config');
  const [editingName, setEditingName] = useState('');
  const [editingText, setEditingText] = useState('');
  const [saving, setSaving] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !configId) return;
    fetchConfig();
  }, [status, configId]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/configs/${configId}`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setEditingName(data.config.name);
        setEditingText(data.config.configText);
      } else {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/configs/${configId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-workspace-id': '' },
        body: JSON.stringify({ name: editingName, configText: editingText }),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setTab('config');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublic = async () => {
    if (!config) return;
    const res = await fetch(`/api/configs/${configId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-workspace-id': '' },
      body: JSON.stringify({ isPublic: !config.isPublic }),
    });
    if (res.ok) {
      const data = await res.json();
      setConfig(data.config);
    }
  };

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyFeedback('已复制');
    setTimeout(() => setCopyFeedback(''), 2000);
  }, []);

  const downloadMd = useCallback(() => {
    if (!config) return;
    const content = `# ${config.name}\n\n${config.configText}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [config]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-[#6b6b8a] text-sm animate-pulse">加载中…</div>
      </div>
    );
  }

  if (!config) return null;

  const isJsonConfig = (() => {
    try { JSON.parse(config.configText); return true; } catch { return false; }
  })();

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f8]">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="max-w-[960px] mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-white">AURA</span>
          </Link>
          <span className="text-[#6b6b8a]">/</span>
          <Link href="/dashboard" className="text-sm text-[#6b6b8a] hover:text-white transition-colors">
            Dashboard
          </Link>
          <span className="text-[#6b6b8a]">/</span>
          <span className="text-sm text-white truncate">{config.name}</span>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-8">
        {/* Title & Actions */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{config.name}</h1>
            <div className="flex items-center gap-3 text-xs text-[#6b6b8a]">
              <span>创建于 {new Date(config.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <span>更新于 {new Date(config.updatedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <button onClick={handleTogglePublic}
                className={`px-2 py-0.5 rounded-full cursor-pointer transition-all ${config.isPublic ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-white/[0.05] text-[#6b6b8a] hover:text-white'}`}>
                {config.isPublic ? '🌐 公开' : '🔒 私密'}
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => copyToClipboard(config.configText)}
              className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] border-none rounded-xl px-4 py-2 text-white text-sm font-semibold cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]">
              {copyFeedback || '复制配置'}
            </button>
            <button onClick={downloadMd}
              className="bg-transparent border border-white/[0.08] rounded-xl px-4 py-2 text-[#9090b0] text-sm cursor-pointer transition-all hover:border-[rgba(139,92,246,0.4)] hover:text-white">
              ↓ .md
            </button>
            <button onClick={() => setTab('edit')}
              className={`border rounded-xl px-4 py-2 text-sm cursor-pointer transition-all ${tab === 'edit' ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] text-[#8b5cf6]' : 'bg-transparent border-white/[0.08] text-[#9090b0] hover:text-white hover:border-white/[0.2]'}`}>
              ✏️ 编辑
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'config' as Tab, label: '配置内容' },
            { id: 'stats' as Tab, label: '测评数据' },
            { id: 'edit' as Tab, label: '编辑' },
          ].map(({ id, label }) => (
            <button key={id}
              onClick={() => {
                setTab(id);
                if (id === 'edit') { setEditingName(config.name); setEditingText(config.configText); }
              }}
              className={`px-4 py-2 rounded-xl text-sm cursor-pointer transition-all duration-200 border
                ${tab === id
                  ? 'bg-[#0e0e1a] border-[#8b5cf6] text-white'
                  : 'bg-transparent border-white/[0.06] text-[#6b6b8a] hover:text-white hover:border-white/[0.15]'
                }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Config Content */}
        {tab === 'config' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.04] flex items-center justify-between">
                <span className="text-xs text-[#6b6b8a] uppercase tracking-widest">配置内容</span>
                <button onClick={() => copyToClipboard(config.configText)}
                  className="text-xs text-[#8b5cf6] cursor-pointer hover:underline">
                  {copyFeedback || '复制'}
                </button>
              </div>
              <pre className="p-5 text-sm text-[#b0b0c8] font-mono leading-[1.8] whitespace-pre-wrap max-h-[600px] overflow-y-auto scrollbar-thin">
                {isJsonConfig ? JSON.stringify(JSON.parse(config.configText), null, 2) : config.configText}
              </pre>
            </div>
          </div>
        )}

        {/* Stats */}
        {tab === 'stats' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6">
              <div className="text-xs text-[#6b6b8a] uppercase tracking-widest mb-4">测评数据</div>
              {Object.keys(config.statsJson).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(config.statsJson).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-sm text-[#9090b0]">{key}</span>
                      <span className="text-sm text-white font-medium">
                        {typeof value === 'number' ? value : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[#6b6b8a]">暂无测评数据</div>
              )}
            </div>

            {/* Answers */}
            {Object.keys(config.answersJson).length > 0 && (
              <div className="bg-[#0e0e1a] border border-white/[0.06] rounded-2xl p-6 mt-4">
                <div className="text-xs text-[#6b6b8a] uppercase tracking-widest mb-4">原始答案</div>
                <div className="space-y-2">
                  {Object.entries(config.answersJson).map(([key, value]) => (
                    <div key={key} className="flex gap-3 text-sm">
                      <span className="text-[#8b5cf6] flex-shrink-0 min-w-[80px]">{key}:</span>
                      <span className="text-[#b0b0c8]">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit */}
        {tab === 'edit' && (
          <div className="animate-in fade-in duration-300 space-y-4">
            <div>
              <label className="block text-sm text-[#9090b0] mb-1.5">配置名称</label>
              <input type="text" value={editingName} onChange={e => setEditingName(e.target.value)}
                className="w-full bg-[#0e0e1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6]" />
            </div>
            <div>
              <label className="block text-sm text-[#9090b0] mb-1.5">配置内容</label>
              <textarea value={editingText} onChange={e => setEditingText(e.target.value)} rows={20}
                className="w-full bg-[#0e0e1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-mono leading-[1.8] whitespace-pre-wrap focus:outline-none focus:border-[#8b5cf6] resize-y scrollbar-thin" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 hover:shadow-lg transition-all">
                {saving ? '保存中…' : '保存修改'}
              </button>
              <button onClick={() => setTab('config')}
                className="bg-transparent border border-white/[0.08] text-[#9090b0] px-6 py-3 rounded-xl text-sm cursor-pointer hover:text-white transition-colors">
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
