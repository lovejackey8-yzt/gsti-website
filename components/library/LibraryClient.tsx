'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import personalitiesData from '@/data/personalities.json';
import type { Personality } from '@/types/personality-record';
import { PersonalityCard } from '@/components/library/PersonalityCard';
import { useTestStore } from '@/hooks/useTestStore';
import { resolvePersonality } from '@/utils/scoring';

const personalities = personalitiesData as Personality[];

export default function LibraryClient() {
  const locale = useLocale();
  const t = useTranslations('library');
  const { answers } = useTestStore();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const unlockedId = useMemo(() => {
    if (!ready || Object.keys(answers).length < 12) return null;
    const { personality } = resolvePersonality(answers);
    return personality.id;
  }, [answers, ready]);

  const unlockedCount = unlockedId ? 1 : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <p className="mb-2 font-terminal text-[10px] uppercase tracking-[0.5em] text-neon-cyan/80 md:text-xs">
          // {t('kicker')}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-2 font-display text-4xl leading-none tracking-widest text-neon-pink md:text-6xl">
              {t('title')}
            </h1>
            <p className="max-w-2xl text-sm text-white/60 md:text-base">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-neon-pink/30 bg-night-panel/60 px-3 py-2 font-terminal text-xs uppercase tracking-widest md:text-sm">
              <span className="text-white/50">IDENTIFIED</span>
              <span className="mx-2 text-neon-pink">{unlockedCount}</span>
              <span className="text-white/30">/</span>
              <span className="ml-2 text-white/70">16</span>
            </div>
            {!unlockedId ? (
              <Link
                href={`/${locale}/test`}
                className="border-2 border-neon-pink bg-neon-pink/10 px-4 py-2 font-terminal text-xs uppercase tracking-widest text-white shadow-neon-pink transition-colors hover:bg-neon-pink md:text-sm"
              >
                {t('startTest')}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* 卡片墙 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03 } },
        }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {personalities.map((p, i) => (
          <PersonalityCard
            key={p.id}
            personality={p}
            unlocked={unlockedId === p.id}
            index={i}
          />
        ))}
      </motion.div>

      {/* 返回 */}
      <div className="mt-12 flex justify-center">
        <Link
          href={`/${locale}`}
          className="border border-white/20 bg-night-panel/60 px-6 py-2.5 font-terminal text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-neon-pink hover:text-neon-pink"
        >
          {t('back')}
        </Link>
      </div>
    </div>
  );
}
