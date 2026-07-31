'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Personality } from '@/types/personality-record';

/**
 * 4 维行为分析条：直接读该人格底稿的固定数值。
 * 底稿定义：每型有固定的 冲动/独行/叛逆/赌徒 分数（0-100）。
 * 对立面自动补 = 100 - value。
 *
 * 例：幕后操盘手 冲动12 独行70 叛逆17 赌徒18
 *   -> 显示：冲动 12%  计划 88%
 *          独行 70%  兄弟 30%
 *          叛逆 17%  原则 83%
 *          赌徒 18%  稳线 82%
 */
interface BehaviorAnalysisProps {
  personality: Personality;
}

export function BehaviorAnalysis({ personality }: BehaviorAnalysisProps) {
  const t = useTranslations('result');
  const { stats } = personality;

  const rows: Array<{
    key: string;
    dimensionLabel: string;
    leftLabel: string;
    rightLabel: string;
    leftPct: number;
    rightPct: number;
  }> = [
    {
      key: 'action',
      dimensionLabel: t('dimensions.action'),
      leftLabel: t('traits.impulse'),
      rightLabel: t('traits.calculated'),
      leftPct: stats.impulse,
      rightPct: 100 - stats.impulse,
    },
    {
      key: 'social',
      dimensionLabel: t('dimensions.social'),
      leftLabel: t('traits.lone'),
      rightLabel: t('traits.pack'),
      leftPct: stats.lone,
      rightPct: 100 - stats.lone,
    },
    {
      key: 'moral',
      dimensionLabel: t('dimensions.moral'),
      leftLabel: t('traits.rogue'),
      rightLabel: t('traits.principled'),
      leftPct: stats.rogue,
      rightPct: 100 - stats.rogue,
    },
    {
      key: 'risk',
      dimensionLabel: t('dimensions.risk'),
      leftLabel: t('traits.highrisk'),
      rightLabel: t('traits.safe'),
      leftPct: stats.highrisk,
      rightPct: 100 - stats.highrisk,
    },
  ];

  return (
    <div className="space-y-5">
      {rows.map((r, idx) => {
        const leftWins = r.leftPct >= r.rightPct;
        return (
          <motion.div
            key={r.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 + 0.2 }}
          >
            <div className="mb-1.5 flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest md:text-xs">
              <span className="text-neon-cyan/70">{r.dimensionLabel}</span>
              <span className={leftWins ? 'text-neon-pink' : 'text-neon-purple'}>
                {leftWins ? r.leftLabel : r.rightLabel} ·{' '}
                {leftWins ? r.leftPct : r.rightPct}%
              </span>
            </div>

            {/* 对比条 · 左半 = 倾向 A，右半 = 倾向 B */}
            <div className="relative flex h-2 items-center bg-night-panel/60">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
              <div className="flex h-full w-1/2 items-center justify-end overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-l from-neon-pink to-neon-pink/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${r.leftPct}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 + 0.3, ease: 'easeOut' }}
                  style={{ boxShadow: '0 0 8px rgba(255, 45, 135, 0.5)' }}
                />
              </div>
              <div className="flex h-full w-1/2 items-center overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-purple/40 to-neon-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${r.rightPct}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 + 0.3, ease: 'easeOut' }}
                  style={{ boxShadow: '0 0 8px rgba(123, 97, 255, 0.5)' }}
                />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between font-terminal text-[10px] tracking-widest text-white/50">
              <span>
                {r.leftLabel} · {r.leftPct}
              </span>
              <span>
                {r.rightPct} · {r.rightLabel}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
