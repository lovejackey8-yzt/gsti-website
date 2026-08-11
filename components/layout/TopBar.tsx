'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/utils/cn';

/**
 * 顶部 HUD 条：GSTI logo + 实时时钟 + 地点 + 状态指示 + 语言切换
 */
export function TopBar() {
  const locale = useLocale();
  const t = useTranslations('topbar');
  const [now, setNow] = useState('--:--');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        `${String(d.getHours()).padStart(2, '0')}:${String(
          d.getMinutes(),
        ).padStart(2, '0')}`,
      );
    };
    tick();
    const id = setInterval(tick, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative z-40 border-b border-neon-pink/20 bg-night/60 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 md:h-14 md:px-6">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2 font-display text-xl tracking-widest md:text-2xl"
        >
          <span className="text-neon-pink transition-all group-hover:drop-shadow-[0_0_8px_rgba(255,45,135,0.9)]">
            GSTI
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-neon-cyan/70 md:inline">
            {t('subtitle')}
          </span>
        </Link>

        {/* HUD 状态区 */}
        <div className="hidden items-center gap-6 font-terminal text-xs uppercase tracking-widest text-white/60 md:flex">
          <StatusDot />
          <span>
            <span className="text-neon-cyan/50 mr-1">TIME</span>
            <span className="text-neon-cyan">{now}</span>
          </span>
          <span>
            <span className="text-neon-cyan/50 mr-1">LOC</span>
            <span className="text-neon-cyan">ROOKLYN CITY</span>
          </span>
        </div>

        {/* 右侧：图鉴入口 + 语言 */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/library`}
            className="hidden text-xs font-terminal uppercase tracking-widest text-white/70 transition-colors hover:text-neon-pink md:inline"
          >
            {t('library')}
          </Link>
          <LangSwitcher />
        </div>
      </div>
    </header>
  );
}

function StatusDot() {
  return (
    <span className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
      </span>
      <span className="text-neon-cyan/80">ONLINE</span>
    </span>
  );
}

/**
 * 语言切换：CN / RU / EN 三语全上线 · 都真跳转
 * 跳转时保持当前页面路径（例如 /zh/library → /ru/library）
 */
function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLang = (target: 'zh' | 'en' | 'ru') => {
    if (target === locale) return;
    // 把当前 pathname 里的 locale 前缀替换掉
    // pathname 形如 /zh/library → /ru/library
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'zh' || segments[0] === 'en' || segments[0] === 'ru') {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    router.push('/' + segments.join('/'));
  };

  const cnActive = locale === 'zh';
  const ruActive = locale === 'ru';
  const enActive = locale === 'en';

  return (
    <div className="flex items-center gap-1 rounded border border-neon-pink/30 bg-night-panel/60 px-2 py-1 font-terminal text-[10px] tracking-widest text-white/70">
      <button
        type="button"
        onClick={() => switchLang('zh')}
        className={cn(
          'px-1 transition-colors',
          cnActive
            ? 'text-neon-pink drop-shadow-[0_0_4px_rgba(255,45,135,0.9)]'
            : 'text-white/70 hover:text-neon-pink',
        )}
        aria-current={cnActive ? 'true' : undefined}
      >
        CN
      </button>
      <span className="text-white/20">/</span>
      <button
        type="button"
        onClick={() => switchLang('ru')}
        className={cn(
          'px-1 transition-colors',
          ruActive
            ? 'text-neon-pink drop-shadow-[0_0_4px_rgba(255,45,135,0.9)]'
            : 'text-white/60 hover:text-neon-cyan',
        )}
        aria-current={ruActive ? 'true' : undefined}
      >
        RU
      </button>
      <span className="text-white/20">/</span>
      <button
        type="button"
        onClick={() => switchLang('en')}
        className={cn(
          'px-1 transition-colors',
          enActive
            ? 'text-neon-pink drop-shadow-[0_0_4px_rgba(255,45,135,0.9)]'
            : 'text-white/60 hover:text-neon-cyan',
        )}
        aria-current={enActive ? 'true' : undefined}
      >
        EN
      </button>
    </div>
  );
}
