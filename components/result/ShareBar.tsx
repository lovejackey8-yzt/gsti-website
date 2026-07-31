'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check, Send, MessageCircle, Instagram, Music } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ShareBarProps {
  shareCopy: string;
  url: string;
}

/**
 * 分享按钮组：
 * - LEAK MY FILE 主按钮（复制文案+URL到剪贴板）
 * - X（Twitter）
 * - Telegram
 * - Instagram（引导 · 复制文案 + 打开 IG.com；IG 没有 web share URL）
 * - TikTok（引导 · 复制文案 + 打开 TT.com；TT 没有 web share URL）
 * - 复制链接
 */
export function ShareBar({ shareCopy, url }: ShareBarProps) {
  const t = useTranslations('result');
  const [copied, setCopied] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const text = encodeURIComponent(shareCopy);
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = async (payload: string, hintMsg?: string) => {
    try {
      await navigator.clipboard.writeText(payload);
      if (hintMsg) {
        setHint(hintMsg);
        setTimeout(() => setHint(null), 2200);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* noop */
    }
  };

  const openWithCopy = async (openUrl: string, hintMsg: string) => {
    await handleCopy(`${shareCopy} ${url}`, hintMsg);
    window.open(openUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleCopy(`${shareCopy} ${url}`)}
          className={cn(
            'group inline-flex items-center gap-2 border-2 border-neon-pink bg-neon-pink/10 px-5 py-2.5 font-terminal text-xs uppercase tracking-widest text-white transition-all hover:bg-neon-pink hover:text-white shadow-neon-pink',
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {copied ? 'COPIED' : t('shareCta')}
        </button>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-10 items-center gap-2 border border-neon-pink/30 bg-night-panel/60 px-3 font-terminal text-xs uppercase tracking-widest text-white/80 transition-all hover:border-neon-pink hover:text-neon-pink hover:shadow-neon-pink"
          aria-label="Share to X"
        >
          <XIcon />
          <span className="hidden sm:inline">X</span>
        </a>

        {/* Telegram */}
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-10 items-center gap-2 border border-neon-pink/30 bg-night-panel/60 px-3 font-terminal text-xs uppercase tracking-widest text-white/80 transition-all hover:border-neon-pink hover:text-neon-pink hover:shadow-neon-pink"
          aria-label="Share to Telegram"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">TG</span>
        </a>

        {/* Instagram */}
        <button
          onClick={() =>
            openWithCopy(
              'https://www.instagram.com/',
              t('shareIgHint'),
            )
          }
          className="group flex h-10 items-center gap-2 border border-neon-pink/30 bg-night-panel/60 px-3 font-terminal text-xs uppercase tracking-widest text-white/80 transition-all hover:border-neon-pink hover:text-neon-pink hover:shadow-neon-pink"
          aria-label="Share to Instagram"
        >
          <Instagram className="h-4 w-4" />
          <span className="hidden sm:inline">IG</span>
        </button>

        {/* TikTok */}
        <button
          onClick={() =>
            openWithCopy(
              'https://www.tiktok.com/',
              t('shareTtHint'),
            )
          }
          className="group flex h-10 items-center gap-2 border border-neon-pink/30 bg-night-panel/60 px-3 font-terminal text-xs uppercase tracking-widest text-white/80 transition-all hover:border-neon-pink hover:text-neon-pink hover:shadow-neon-pink"
          aria-label="Share to TikTok"
        >
          <Music className="h-4 w-4" />
          <span className="hidden sm:inline">TT</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={() => handleCopy(url)}
          className="flex h-10 w-10 items-center justify-center border border-neon-pink/30 bg-night-panel/60 text-white/80 transition-all hover:border-neon-pink hover:text-neon-pink hover:shadow-neon-pink"
          aria-label={t('shareCopy')}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {/* toast · IG/TT 引导提示 */}
      {hint && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute -top-12 left-0 border border-neon-cyan/40 bg-night-panel/95 px-3 py-2 font-terminal text-[10px] uppercase tracking-widest text-neon-cyan shadow-neon-cyan backdrop-blur-md"
        >
          <span className="mr-2 text-neon-pink">▶</span>
          {hint}
        </div>
      )}
    </div>
  );
}

/** X (Twitter) logo icon */
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
