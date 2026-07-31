'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { RotateCcw, Library, Download } from 'lucide-react';
import { useTestStore } from '@/hooks/useTestStore';
import { resolvePersonality } from '@/utils/scoring';
import { ThreatLevel } from '@/components/result/ThreatLevel';
import { InfluenceRank } from '@/components/result/InfluenceRank';
import { BehaviorAnalysis } from '@/components/result/BehaviorAnalysis';
import { RadarChart } from '@/components/result/RadarChart';
import { ShareBar } from '@/components/result/ShareBar';
import { GlitchText } from '@/components/effects/GlitchText';
import { cn } from '@/utils/cn';

export default function ResultClient() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('result');
  const tp = useTranslations('personalities');
  const hasHydrated = useTestStore((s) => s.hasHydrated);
  const reset = useTestStore((s) => s.reset);

  const [url, setUrl] = useState('');
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');
  const [resolved, setResolved] = useState<ReturnType<typeof resolvePersonality> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') setUrl(window.location.href);
  }, []);

  // 只在 rehydrate 完成时判断一次
  useEffect(() => {
    if (!hasHydrated) return;
    const answers = useTestStore.getState().answers;
    if (Object.keys(answers).length < 12) {
      setState('missing');
      router.replace(`/${locale}/test`);
      return;
    }
    setResolved(resolvePersonality(answers));
    setState('ok');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  if (state !== 'ok' || !resolved) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
        <span className="font-terminal text-sm uppercase tracking-widest text-neon-cyan/70 animate-pulse">
          {state === 'missing' ? 'NO DECISION RECORD · REDIRECTING ...' : 'LOADING FILE ...'}
        </span>
      </div>
    );
  }

  const { personality } = resolved;
  const name = tp(`${personality.i18nKey}.name`);
  const shortDesc = tp(`${personality.i18nKey}.shortDesc`);
  const profile = tp(`${personality.i18nKey}.profile`);
  const shareCopy = tp(`${personality.i18nKey}.shareCopy`);

  const handleRetake = () => {
    reset();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('gsti-tracked-once');
    }
    router.push(`/${locale}/test`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-3 text-center font-terminal text-[10px] uppercase tracking-[0.5em] text-neon-cyan/80 md:text-xs"
      >
        // {t('kicker')}
      </motion.p>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="panel-file relative overflow-hidden p-4 md:p-8"
      >
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-neon-pink/25 pb-4">
          <div className="flex items-center gap-3 font-terminal text-[10px] uppercase tracking-widest text-white/60 md:text-xs">
            <span className="text-neon-cyan/70">CITY DATABASE</span>
            <span className="text-white/25">//</span>
            <span className="text-neon-cyan/70">IDENTIFICATION COMPLETE</span>
          </div>
          <div className="flex items-center gap-3 font-terminal text-[10px] uppercase tracking-widest md:text-xs">
            <span className="text-white/50">{t('fileNo')}</span>
            <span className="text-neon-pink">{personality.fileNo}</span>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
          {/* 左列 · 肖像 + 元信息 */}
          <div>
            <div className="relative aspect-[2/3] w-full overflow-hidden border border-neon-pink/40 bg-night-panel">
              <Image
                src={`/portraits/p${personality.id}.png`}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
              {/* 底部渐变遮罩 · 让 callsign 压得住 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-night via-night/70 to-transparent" />
              {/* callsign 覆在肖像底部 */}
              <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                <p className="font-terminal text-[9px] uppercase tracking-[0.4em] text-neon-cyan/80">CALLSIGN</p>
                <p
                  className="font-display text-2xl leading-none tracking-widest text-white md:text-3xl"
                  style={{ textShadow: '0 0 12px rgba(255,45,135,0.85)' }}
                >
                  {personality.callsign}
                </p>
              </div>
              {/* 扫描线覆盖 */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.28) 4px, transparent 5px)',
                }}
              />
              {/* 四角 */}
              {['top-2 left-2', 'top-2 right-2 rotate-90', 'bottom-2 right-2 rotate-180', 'bottom-2 left-2 -rotate-90'].map(
                (pos, i) => (
                  <span
                    key={i}
                    className={cn(
                      'absolute h-4 w-4 border-l-2 border-t-2 border-neon-cyan',
                      pos,
                    )}
                  />
                ),
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-terminal text-[10px] uppercase tracking-widest text-white/50">
                  {t('threatLevel')}
                </span>
                <ThreatLevel level={personality.threatLevel} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-terminal text-[10px] uppercase tracking-widest text-white/50">
                  {t('influence')}
                </span>
                <InfluenceRank rank={personality.influence} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-terminal text-[10px] uppercase tracking-widest text-white/50">
                  {t('status')}
                </span>
                <span
                  className="flex items-center gap-2 font-terminal text-xs tracking-widest text-neon-cyan"
                  style={{ textShadow: '0 0 8px rgba(0,245,255,0.85)' }}
                >
                  <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
                  {t('statusActive')}
                </span>
              </div>
            </div>
          </div>

          {/* 右列 · 身份 + 描述 + 数据 */}
          <div>
            <p className="mb-1 font-terminal text-[10px] uppercase tracking-widest text-neon-cyan/70 md:text-xs">
              {t('yourIdentity')}
            </p>
            <h1 className="mb-2 flex items-baseline flex-wrap gap-3 md:gap-4">
              <GlitchText
                text={personality.callsign}
                as="span"
                className="text-4xl md:text-6xl leading-none"
              />
            </h1>
            <p className="mb-2 font-display text-3xl md:text-5xl leading-tight text-neon-pink">
              {name}
            </p>
            <p className="mb-6 text-base italic text-neon-purple md:text-lg">
              &ldquo;{shortDesc}&rdquo;
            </p>

            <div className="mb-6">
              <p className="mb-2 font-terminal text-[10px] uppercase tracking-widest text-neon-cyan/70 md:text-xs">
                // {t('profile')}
              </p>
              <p className="text-sm leading-relaxed text-white/85 md:text-base">
                {profile}
              </p>
            </div>

            <div className="mb-4 grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="mb-3 font-terminal text-[10px] uppercase tracking-widest text-neon-cyan/70 md:text-xs">
                  // {t('behavior')}
                </p>
                <BehaviorAnalysis personality={personality} />
              </div>
              <div className="flex items-start justify-center">
                <RadarChart personality={personality} />
              </div>
            </div>
          </div>
        </div>

        {/* 分享区 */}
        <div className="mt-8 border-t border-neon-pink/25 pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-1 font-display text-2xl tracking-widest text-white md:text-3xl">
                {t('shareTitle')}
              </p>
              <p className="text-xs text-white/60 md:text-sm">{t('shareDesc')}</p>
            </div>
            <ConfidentialStamp />
          </div>

          <ShareBar shareCopy={shareCopy} url={url} />
        </div>

        {/* 底部行 */}
        <div className="mt-8 border-t border-neon-pink/20 pt-6">
          <div className="flex flex-col items-center gap-4">
            <a
              href="#"
              className={cn(
                'group inline-flex items-center gap-3 border border-neon-yellow/60 bg-night-panel/40 px-5 py-2.5 font-terminal text-[11px] uppercase tracking-widest text-neon-yellow transition-all hover:border-neon-yellow hover:bg-neon-yellow/10 hover:shadow-neon-yellow md:text-xs',
              )}
            >
              <Download className="h-3.5 w-3.5" />
              {t('downloadGame')}
              <span className="hidden text-white/40 md:inline">
                · {t('downloadGameSub')}
              </span>
            </a>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 border border-white/20 bg-night-panel/60 px-4 py-2 font-terminal text-[10px] uppercase tracking-widest text-white/70 transition-all hover:border-neon-pink hover:text-neon-pink md:text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t('retake')}
              </button>
              <Link
                href={`/${locale}/library`}
                className="inline-flex items-center gap-2 border border-white/20 bg-night-panel/60 px-4 py-2 font-terminal text-[10px] uppercase tracking-widest text-white/70 transition-all hover:border-neon-cyan hover:text-neon-cyan md:text-xs"
              >
                <Library className="h-3.5 w-3.5" />
                {t('toLibrary')}
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function ConfidentialStamp() {
  const t = useTranslations('result');
  return (
    <div className="relative">
      <div
        className="rotate-[-8deg] border-2 border-neon-pink px-4 py-2 text-center font-terminal text-[10px] leading-tight tracking-widest text-neon-pink md:text-xs"
        style={{
          textShadow: '0 0 6px rgba(255,45,135,0.7)',
          boxShadow: '0 0 12px rgba(255,45,135,0.35)',
        }}
      >
        {t('confidential')
          .split('\n')
          .map((line, i) => (
            <div key={i}>{line}</div>
          ))}
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rotate-[-8deg] font-display text-lg italic text-neon-cyan/80">
        ~ ROOKLYN CITY ~
      </div>
    </div>
  );
}
