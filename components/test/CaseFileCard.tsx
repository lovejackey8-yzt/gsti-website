'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Question } from '@/types/question';
import { ChoiceButton } from './ChoiceButton';

interface CaseFileCardProps {
  question: Question;
  selected: 'A' | 'B' | 'C' | 'D' | undefined;
  onSelect: (key: 'A' | 'B' | 'C' | 'D') => void;
}

export function CaseFileCard({ question, selected, onSelect }: CaseFileCardProps) {
  const t = useTranslations();
  const qKey = `questions.${question.i18nKey}`;

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={question.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="panel-file relative mx-auto w-full max-w-3xl p-5 md:p-8"
      >
        {/* Header · CASE FILE 元信息条 */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-neon-pink/20 pb-3">
          <div className="flex items-center gap-3 font-terminal text-[10px] uppercase tracking-widest text-white/60 md:text-xs">
            <span className="text-neon-cyan/70">CITY DATABASE</span>
            <span className="text-white/30">//</span>
            <span className="text-neon-cyan/70">CASE FILE</span>
          </div>
          <div className="font-terminal text-[10px] uppercase tracking-widest text-neon-pink md:text-xs">
            NO. {question.caseNumber}
          </div>
        </header>

        {/* 情境标题 · 大字英文风（用中文的话直接用 sans） */}
        <div className="mb-4 flex items-baseline gap-4">
          <span className="font-terminal text-xs uppercase tracking-widest text-neon-cyan/70">
            CASE
          </span>
          <span className="font-display text-4xl leading-none text-neon-pink md:text-6xl">
            {question.caseNumber}
          </span>
        </div>

        {/* 时间 · 地点 */}
        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-1 font-terminal text-xs uppercase tracking-widest text-white/50">
          <span>
            <span className="text-neon-cyan/60 mr-2">TIME</span>
            <span className="text-white/80">{question.time}</span>
          </span>
          <span>
            <span className="text-neon-cyan/60 mr-2">LOC</span>
            <span className="text-white/80">{t(`${qKey}.location`)}</span>
          </span>
        </div>

        {/* 场景描述 */}
        <p className="mb-8 text-base leading-relaxed text-white/90 md:text-lg">
          {t(`${qKey}.scenario`)}
        </p>

        {/* 4 个选项 */}
        <div className="grid gap-3">
          {question.choices.map((c, i) => (
            <ChoiceButton
              key={c.key}
              choiceKey={c.key}
              label={t(`${qKey}.${c.key.toLowerCase()}`)}
              sub={t(`${qKey}.${c.key.toLowerCase()}Sub`)}
              selected={selected === c.key}
              onClick={() => onSelect(c.key)}
              index={i}
            />
          ))}
        </div>

        {/* 底部标记条 */}
        <footer className="mt-6 flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest text-white/40">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-pink animate-pulse" />
            <span>{t('test.progress')}</span>
          </span>
          <span>{question.id} / 12</span>
        </footer>
      </motion.article>
    </AnimatePresence>
  );
}
