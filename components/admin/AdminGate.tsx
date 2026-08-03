'use client';

import { useEffect, useState } from 'react';
import { AdminDashboard } from './AdminDashboard';

/**
 * 后台守卫：先探测 stats 接口，401 显示登录框，200 直接进 dashboard。
 * 密码错误显示"Not Found"迷惑扫描者。
 */
export default function AdminGate() {
  const [status, setStatus] = useState<'checking' | 'need-login' | 'in'>('checking');

  const probe = async () => {
    try {
      const r = await fetch('/api/admin/stats', { cache: 'no-store', credentials: 'same-origin' });
      setStatus(r.ok ? 'in' : 'need-login');
    } catch {
      setStatus('need-login');
    }
  };

  useEffect(() => {
    probe();
  }, []);

  if (status === 'checking') {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
        <span className="font-terminal text-xs uppercase tracking-widest text-white/40 animate-pulse">
          checking ...
        </span>
      </div>
    );
  }

  if (status === 'need-login') {
    return <LoginForm onSuccess={() => setStatus('in')} />;
  }

  return <AdminDashboard onLogout={() => setStatus('need-login')} />;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password: pwd }),
      });
      if (r.ok) {
        // 登录成功直接进 dashboard，不再二次 probe
        // 避免 cookie 在某些环境下需要一次跳转才生效的问题
        onSuccess();
      } else {
        setErr('Not Found');
      }
    } catch {
      setErr('Not Found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
      <div className="w-full border border-neon-pink/30 bg-night-panel/60 p-8">
        <div className="mb-6 font-terminal text-[10px] uppercase tracking-[0.4em] text-neon-cyan/70">
          // RESTRICTED · CITY DATABASE
        </div>
        <h1 className="mb-6 font-display text-3xl tracking-widest text-neon-pink">
          AUTHENTICATE
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block font-terminal text-[10px] uppercase tracking-widest text-white/60">
              ACCESS KEY
            </span>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoFocus
              autoComplete="current-password"
              className="w-full border border-white/15 bg-night px-3 py-2 font-terminal text-sm tracking-widest text-white outline-none focus:border-neon-pink"
            />
          </label>

          {err && (
            <div className="font-terminal text-xs uppercase tracking-widest text-neon-pink/80">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-neon-pink bg-neon-pink/10 py-2.5 font-terminal text-xs uppercase tracking-widest text-white transition-colors hover:bg-neon-pink disabled:opacity-40"
          >
            {loading ? 'AUTHENTICATING ...' : 'ENTER'}
          </button>
        </form>
      </div>
    </div>
  );
}
