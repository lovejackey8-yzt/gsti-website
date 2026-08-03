'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Send, MessageCircle, Instagram, Music, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ShareBarProps {
  shareCopy: string;
  url: string;
  /** DOM 元素 id · 用于下载档案图截图整块结果卡片 */
  captureTargetId?: string;
}

/**
 * 分享按钮组：
 * - LEAK MY FILE 主按钮（复制文案+URL到剪贴板）
 * - SAVE AS FILE 下载档案图按钮（html-to-image 把结果卡生成 PNG 下载）
 * - X / Telegram / Instagram / TikTok 平台按钮
 */
export function ShareBar({ shareCopy, url, captureTargetId }: ShareBarProps) {
  const t = useTranslations('result');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

  const handleDownload = async () => {
    if (!captureTargetId) return;
    const target = document.getElementById(captureTargetId);
    if (!target) return;

    setDownloading(true);
    setHint(t('shareDownloadProcessing'));

    // 收集需要临时隐藏/调整的节点，截图完恢复
    const hiddenNodes: Array<{ el: HTMLElement; prevDisplay: string; prevVisibility: string }> = [];
    // 隐藏 ShareBar（分享按钮不出现在截图里）+ 所有 data-capture-hide 节点（比如 toast）
    const nodesToHide = [
      ...Array.from(target.querySelectorAll<HTMLElement>('[data-capture-hide]')),
      ...Array.from(target.querySelectorAll<HTMLElement>('[data-share-bar]')),
    ];
    nodesToHide.forEach((el) => {
      hiddenNodes.push({ el, prevDisplay: el.style.display, prevVisibility: el.style.visibility });
      el.style.display = 'none';
    });

    // 移动端强制固定桌面宽度，避免 md:响应式在窄容器下折行/换行
    const prevWidth = target.style.width;
    const prevMaxWidth = target.style.maxWidth;
    const wasMobile = window.innerWidth < 900;
    if (wasMobile) {
      target.style.width = '960px';
      target.style.maxWidth = '960px';
    }

    // 等两帧让样式生效
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0A0F1A',
      });
      const link = document.createElement('a');
      link.download = `GSTI-file-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setHint(t('shareDownloadDone'));
      setTimeout(() => setHint(null), 2500);
    } catch (e) {
      console.error('[ShareBar] download failed:', e);
      setHint(t('shareDownloadFailed'));
      setTimeout(() => setHint(null), 2500);
    } finally {
      // 恢复所有临时改动
      hiddenNodes.forEach(({ el, prevDisplay, prevVisibility }) => {
        el.style.display = prevDisplay;
        el.style.visibility = prevVisibility;
      });
      target.style.width = prevWidth;
      target.style.maxWidth = prevMaxWidth;
      setDownloading(false);
    }
  };

  return (
    <div className="relative" data-share-bar>
      <div className="flex flex-wrap items-center gap-3">
        {/* 主按钮：LEAK MY FILE · 复制文案+URL */}
        <button
          onClick={() => handleCopy(`${shareCopy} ${url}`)}
          className={cn(
            'group inline-flex items-center gap-2 border-2 border-neon-pink bg-neon-pink/10 px-5 py-2.5 font-terminal text-xs uppercase tracking-widest text-white transition-all hover:bg-neon-pink hover:text-white shadow-neon-pink',
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {copied ? 'COPIED' : t('shareCta')}
        </button>

        {/* 下载档案图按钮 */}
        {captureTargetId && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={cn(
              'group inline-flex items-center gap-2 border-2 border-neon-yellow bg-neon-yellow/10 px-4 py-2.5 font-terminal text-xs uppercase tracking-widest text-neon-yellow transition-all hover:bg-neon-yellow hover:text-night hover:shadow-neon-yellow disabled:opacity-40',
            )}
            aria-label={t('shareDownload')}
          >
            <Download className={cn('h-4 w-4', downloading && 'animate-pulse')} />
            {downloading ? 'RENDERING...' : t('shareDownload')}
          </button>
        )}

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
      </div>

      {/* toast · IG/TT/下载 引导提示 */}
      {hint && (
        <div
          role="status"
          aria-live="polite"
          data-capture-hide
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
      <path d="M18.244 2.25h3.308l-7.227 8.268.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
