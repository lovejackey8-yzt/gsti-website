'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import questionsData from '@/data/questions.json';
import type { Question } from '@/types/question';
import { useTestStore } from '@/hooks/useTestStore';
import { CaseFileCard } from '@/components/test/CaseFileCard';
import { ProgressBar } from '@/components/test/ProgressBar';
import { cn } from '@/utils/cn';

const questions = questionsData as Question[];
const TOTAL = questions.length;

export default function TestClient() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('test');

  const answers = useTestStore((s) => s.answers);
  const currentIndex = useTestStore((s) => s.currentIndex);
  const hasHydrated = useTestStore((s) => s.hasHydrated);
  const setAnswer = useTestStore((s) => s.setAnswer);
  const next = useTestStore((s) => s.next);
  const prev = useTestStore((s) => s.prev);
  const complete = useTestStore((s) => s.complete);

  const current = questions[currentIndex];
  const selected = current ? answers[current.id] : undefined;
  const isLast = currentIndex === TOTAL - 1;
  const canGoNext = Boolean(selected);

  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  const handleNext = () => {
    if (!canGoNext) return;
    if (isLast) {
      complete();
      // 直接跳 analysis · 不依赖 useEffect
      router.push(`/${locale}/analysis`);
    } else {
      next();
    }
  };

  if (!hasHydrated) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
        <span className="font-terminal text-sm uppercase tracking-widest text-neon-cyan/70 animate-pulse">
          INITIALIZING SESSION ...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col px-4 py-6 md:py-10">
      <div className="mb-6 md:mb-10">
        <ProgressBar current={currentIndex + 1} total={TOTAL} />
      </div>

      <div className="flex-1">
        <CaseFileCard
          question={current}
          selected={selected}
          onSelect={(k) => setAnswer(current.id, k)}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-center justify-between gap-3"
      >
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className={cn(
            'flex items-center gap-2 border border-white/20 bg-night-panel/60 px-4 py-2 font-terminal text-xs uppercase tracking-widest transition-colors md:px-6 md:py-3',
            currentIndex === 0
              ? 'cursor-not-allowed text-white/20'
              : 'text-white/70 hover:border-neon-pink hover:text-neon-pink',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          {t('prev')}
        </button>

        <div className="hidden font-terminal text-[10px] uppercase tracking-widest text-white/40 md:block">
          {answered} / {TOTAL} DECISIONS RECORDED
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={cn(
            'flex items-center gap-2 border-2 px-4 py-2 font-terminal text-xs uppercase tracking-widest transition-all md:px-6 md:py-3',
            canGoNext
              ? 'border-neon-pink bg-neon-pink/10 text-white shadow-neon-pink hover:bg-neon-pink hover:text-white'
              : 'cursor-not-allowed border-white/10 bg-night-panel/40 text-white/30',
          )}
        >
          {!canGoNext && <Lock className="h-3.5 w-3.5" />}
          {isLast ? t('finish') : t('next')}
          {canGoNext && <ChevronRight className="h-4 w-4" />}
        </button>
      </motion.div>
    </div>
  );
}
