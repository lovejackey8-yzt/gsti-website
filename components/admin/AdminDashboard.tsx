'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LogOut, RefreshCw, Users, TrendingUp, Award, Calendar } from 'lucide-react';

interface Stats {
  ok: true;
  total: number;
  last24h: number;
  last7d: number;
  daily: Array<{ date: string; count: number }>;
  perType: Array<{
    id: number;
    code: string;
    callsign: string;
    i18nKey: string;
    count: number;
    percent: number;
  }>;
}

// 注意：这个组件里我们不使用 next-intl provider（admin 不在 [locale] 下），
// 所以 personality 中文名需要单独从 zh.json 直接读。
import zhLocale from '@/locales/zh.json';

const personalityNames: Record<string, string> = Object.fromEntries(
  Object.entries((zhLocale as any).personalities).map(([k, v]: [string, any]) => [k, v.name]),
);

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const r = await fetch('/api/admin/stats', { cache: 'no-store', credentials: 'same-origin' });
      if (!r.ok) {
        setErr('Session expired.');
        onLogout();
        return;
      }
      const j = (await r.json()) as Stats;
      setStats(j);
    } catch {
      setErr('Failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    onLogout();
  };

  if (!stats) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
        <span className="font-terminal text-xs uppercase tracking-widest text-white/50 animate-pulse">
          {err || 'loading ...'}
        </span>
      </div>
    );
  }

  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count));
  const maxType = Math.max(1, ...stats.perType.map((t) => t.count));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-neon-pink/20 pb-4">
        <div>
          <p className="mb-1 font-terminal text-[10px] uppercase tracking-[0.5em] text-neon-cyan/70">
            // CITY DATABASE · OPERATOR CONSOLE
          </p>
          <h1 className="font-display text-4xl tracking-widest text-neon-pink md:text-5xl">
            GSTI · ADMIN
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-white/20 bg-night-panel/60 px-3 py-2 font-terminal text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 border border-white/20 bg-night-panel/60 px-3 py-2 font-terminal text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-neon-pink hover:text-neon-pink"
          >
            <LogOut className="h-3.5 w-3.5" />
            LOGOUT
          </button>
        </div>
      </header>

      {/* Top KPI 卡片 */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <KPICard
          icon={<Users className="h-4 w-4" />}
          label="TOTAL PARTICIPANTS"
          value={stats.total}
          color="pink"
        />
        <KPICard
          icon={<TrendingUp className="h-4 w-4" />}
          label="LAST 24H"
          value={stats.last24h}
          color="cyan"
        />
        <KPICard
          icon={<Calendar className="h-4 w-4" />}
          label="LAST 7 DAYS"
          value={stats.last7d}
          color="yellow"
        />
      </div>

      {/* 7 天趋势条 */}
      <section className="mb-10 border border-neon-pink/20 bg-night-panel/50 p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl tracking-widest text-white md:text-2xl">
            7-DAY TREND
          </h2>
          <span className="font-terminal text-[10px] uppercase tracking-widest text-white/40">
            events / day
          </span>
        </div>
        <div className="flex items-end gap-2 md:gap-3">
          {stats.daily.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative flex w-full flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-neon-pink to-neon-purple"
                  style={{
                    height: `${(d.count / maxDaily) * 140 + 4}px`,
                    boxShadow: '0 0 8px rgba(255, 45, 135, 0.5)',
                  }}
                />
                <span className="mt-1 font-terminal text-[10px] tracking-widest text-neon-pink">
                  {d.count}
                </span>
              </div>
              <span className="font-terminal text-[9px] uppercase tracking-widest text-white/40">
                {d.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 16 型排行 */}
      <section className="border border-neon-pink/20 bg-night-panel/50 p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl tracking-widest text-white md:text-2xl">
            <Award className="h-5 w-5 text-neon-cyan" />
            16 · PERSONALITY DISTRIBUTION
          </h2>
          <span className="font-terminal text-[10px] uppercase tracking-widest text-white/40">
            sorted by count
          </span>
        </div>

        <div className="space-y-2">
          {stats.perType.map((row, i) => (
            <div key={row.id} className="grid grid-cols-[24px_1fr_1.6fr_60px_60px] items-center gap-3 py-1.5 text-sm">
              <span className="font-terminal text-[10px] uppercase tracking-widest text-white/40">
                #{i + 1}
              </span>
              <span className="font-terminal text-xs tracking-widest text-neon-cyan/90">
                {row.callsign}
              </span>
              <span className="truncate text-white/80">
                {personalityNames[row.i18nKey] ?? row.i18nKey}
              </span>
              <span className="relative h-2 bg-night">
                <span
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-pink to-neon-purple"
                  style={{
                    width: `${(row.count / maxType) * 100}%`,
                    boxShadow: '0 0 6px rgba(255, 45, 135, 0.55)',
                  }}
                />
              </span>
              <span className="text-right font-terminal text-xs tracking-widest text-neon-pink">
                {row.count}
                <span className="ml-1 text-white/40">·{row.percent}%</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 · 数据来源与提示 */}
      <footer className="mt-10 border-t border-white/10 pt-4 font-terminal text-[10px] uppercase tracking-widest text-white/40">
        DATA SOURCE · file storage (.data/events.jsonl) · switch to Vercel KV / Redis for production
      </footer>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'pink' | 'cyan' | 'yellow';
}) {
  const cls = {
    pink: 'text-neon-pink',
    cyan: 'text-neon-cyan',
    yellow: 'text-neon-yellow',
  }[color];
  return (
    <div className="relative border border-neon-pink/20 bg-night-panel/50 p-5">
      <div className="mb-2 flex items-center gap-2 font-terminal text-[10px] uppercase tracking-widest text-white/50">
        <span className={cls}>{icon}</span>
        {label}
      </div>
      <div className={`font-display text-5xl leading-none tracking-widest ${cls}`}>
        {value}
      </div>
    </div>
  );
}
