'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ChoiceButtonProps {
  choiceKey: 'A' | 'B' | 'C' | 'D';
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
  index: number;
}

export function ChoiceButton({
  choiceKey,
  label,
  sub,
  selected,
  onClick,
  index,
}: ChoiceButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative flex w-full items-start gap-4 border p-4 md:p-5 text-left transition-all',
        'font-sans',
        selected
          ? 'border-neon-pink bg-neon-pink/10 shadow-neon-pink'
          : 'border-neon-pink/20 bg-night-panel/40 hover:border-neon-pink/70 hover:bg-neon-pink/5',
      )}
    >
      {/* 左侧字母块 */}
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center font-display text-2xl tracking-wider transition-all md:h-12 md:w-12 md:text-3xl',
          selected
            ? 'bg-neon-pink text-white shadow-neon-pink'
            : 'bg-night-panel text-neon-pink group-hover:bg-neon-pink/20',
        )}
      >
        {choiceKey}
      </span>

      {/* 主副文案 */}
      <span className="flex-1 min-w-0">
        <span
          className={cn(
            'block text-base leading-snug md:text-lg',
            selected ? 'text-white' : 'text-white/90',
          )}
        >
          {label}
        </span>
        <span className="mt-1 block text-xs text-white/50 md:text-sm">
          {sub}
        </span>
      </span>

      {/* 选中指示 */}
      {selected && (
        <motion.span
          layoutId="choice-indicator"
          className="absolute inset-y-0 right-0 w-1 bg-neon-pink shadow-neon-pink"
        />
      )}
    </motion.button>
  );
}
