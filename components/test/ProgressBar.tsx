'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number; // 1-based
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3 font-terminal text-xs uppercase tracking-widest text-white/60">
      <span className="text-neon-cyan/70">CASE</span>
      <span className="text-neon-pink">
        {String(current).padStart(2, '0')}
      </span>
      <span className="text-white/30">/</span>
      <span>{String(total).padStart(2, '0')}</span>
      <div className="relative h-1 flex-1 overflow-hidden bg-night-panel">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 12px rgba(255, 45, 135, 0.7)',
          }}
        />
      </div>
      <span className="text-neon-pink font-tech">{pct}%</span>
    </div>
  );
}
