'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  summary: {
    totalPV: number;
    totalUV: number;
    totalSessions: number;
    totalQuizCompleted: number;
    totalAiEnhanced: number;
    conversionRate: string;
  };
  dailyStats: Array<{
    date: Date;
    pv: number;
    uv: number;
    quizCompleted: number;
    aiEnhanced: number;
  }>;
  topPages: Array<{ path: string; count: number }>;
  recentVisits: Array<{
    path: string;
    fingerprint: string;
    createdAt: string;
    duration: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');

  // 隐藏导航栏
  useEffect(() => {
    const nav = document.querySelector('nav');
    const paddingDiv = nav?.nextElementSibling as HTMLElement;
    if (nav) (nav as HTMLElement).style.display = 'none';
    if (paddingDiv) paddingDiv.style.paddingTop = '0';
    return () => {
      if (nav) (nav as HTMLElement).style.display = '';
      if (paddingDiv) paddingDiv.style.paddingTop = '';
    };
  }, []);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${range}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const colors = {
    blue: { bg: 'rgba(59,130,246,0.2)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
    green: { bg: 'rgba(16,185,129,0.2)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
    purple: { bg: 'rgba(139,92,246,0.2)', border: 'rgba(139,92,246,0.3)', text: '#a78bfa' },
    yellow: { bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
    pink: { bg: 'rgba(236,72,153,0.2)', border: 'rgba(236,72,153,0.3)', text: '#f472b6' },
    cyan: { bg: 'rgba(6,182,212,0.2)', border: 'rgba(6,182,212,0.3)', text: '#22d3ee' },
  };

  const StatCard = ({ label, value, color }: { label: string; value: number | string; color: keyof typeof colors }) => (
    <div style={{
      background: `linear-gradient(135deg, ${colors[color].bg}, ${colors[color].bg})`,
      border: `1px solid ${colors[color].border}`,
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{ color: '#6b6b8a', fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 'bold', color: colors[color].text }}>{value}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080810', padding: 0 }}>
      {/* Header */}
      <header style={{ background: '#0e0e1a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: 14,
              }}>A</div>
              <span style={{ fontWeight: 'bold', color: 'white' }}>AURA Admin</span>
            </Link>
            <span style={{
              color: '#4a4a6a', fontSize: 12, padding: '4px 8px',
              background: 'rgba(139,92,246,0.1)', borderRadius: 4,
              border: '1px solid rgba(139,92,246,0.2)',
            }}>统计面板</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select
              value={range}
              onChange={e => setRange(e.target.value)}
              style={{
                background: '#080810', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '6px 12px', fontSize: 14, color: '#9090b0',
                cursor: 'pointer',
              }}
            >
              <option value="7d">近 7 天</option>
              <option value="30d">近 30 天</option>
              <option value="all">全部</option>
            </select>

            <button
              onClick={fetchStats}
              style={{
                padding: '6px 12px', background: '#8b5cf6', color: 'white',
                borderRadius: 8, fontSize: 14, fontWeight: 500, border: 'none',
                cursor: 'pointer',
              }}
            >
              刷新
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
            <div style={{ color: '#4a4a6a' }}>加载中...</div>
          </div>
        ) : !stats ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
            <div style={{ color: '#f87171' }}>加载失败</div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard label="页面浏览" value={stats.summary.totalPV} color="blue" />
              <StatCard label="独立访客" value={stats.summary.totalUV} color="green" />
              <StatCard label="访问会话" value={stats.summary.totalSessions} color="purple" />
              <StatCard label="测评完成" value={stats.summary.totalQuizCompleted} color="yellow" />
              <StatCard label="AI 增强" value={stats.summary.totalAiEnhanced} color="pink" />
              <StatCard label="转化率" value={`${stats.summary.conversionRate}%`} color="cyan" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              {/* Daily Trend */}
              <div style={{ background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 16 }}>每日趋势</h2>
                <div>
                  {stats.dailyStats.slice(-7).map((day, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#6b6b8a', fontSize: 14, width: 64 }}>{formatDate(day.date)}</span>
                      <span style={{ color: '#60a5fa', fontSize: 14 }}>PV: {day.pv}</span>
                      <span style={{ color: '#34d399', fontSize: 14 }}>UV: {day.uv}</span>
                      <span style={{ color: '#fbbf24', fontSize: 14 }}>完成: {day.quizCompleted}</span>
                    </div>
                  ))}
                  {stats.dailyStats.length === 0 && (
                    <div style={{ color: '#4a4a6a', fontSize: 14, textAlign: 'center', padding: 32 }}>暂无数据</div>
                  )}
                </div>
              </div>

              {/* Top Pages */}
              <div style={{ background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 16 }}>热门页面</h2>
                <div>
                  {stats.topPages.map((page, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#9090b0', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150, whiteSpace: 'nowrap' }}>{page.path || '/'}</span>
                      <span style={{ color: '#8b5cf6', fontSize: 14, fontWeight: 500 }}>{page.count}</span>
                    </div>
                  ))}
                  {stats.topPages.length === 0 && (
                    <div style={{ color: '#4a4a6a', fontSize: 14, textAlign: 'center', padding: 32 }}>暂无数据</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Visits */}
            <div style={{ marginTop: 24, background: '#0e0e1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 16 }}>最近访问</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: 14 }}>
                  <thead>
                    <tr style={{ color: '#4a4a6a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>时间</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>页面</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>指纹</th>
                      <th style={{ textAlign: 'right', padding: '8px 12px' }}>停留</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentVisits.map((visit, i) => (
                      <tr key={i} style={{ color: '#9090b0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '8px 12px' }}>{formatTime(visit.createdAt)}</td>
                        <td style={{ padding: '8px 12px' }}>{visit.path}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12 }}>{visit.fingerprint?.slice(0, 16)}...</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>{visit.duration}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {stats.recentVisits.length === 0 && (
                  <div style={{ color: '#4a4a6a', fontSize: 14, textAlign: 'center', padding: 32 }}>暂无数据</div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
