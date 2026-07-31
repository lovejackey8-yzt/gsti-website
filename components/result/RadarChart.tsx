'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Personality } from '@/types/personality-record';

/**
 * 4 边形雷达（菱形）。直接读该人格底稿的固定数值。
 * 4 个顶点：上=行动风格(冲动% or 100-冲动，取胜方)
 *          右=风险偏好(赌徒% or 稳线%)
 *          下=道德罗盘(叛逆% or 原则%)
 *          左=社交风格(独行% or 兄弟%)
 */
export function RadarChart({ personality }: { personality: Personality }) {
  const t = useTranslations('result');
  const { stats } = personality;

  // 每维取胜方分数（更大的那一侧）
  const values = {
    top: Math.max(stats.impulse, 100 - stats.impulse),
    right: Math.max(stats.highrisk, 100 - stats.highrisk),
    bottom: Math.max(stats.rogue, 100 - stats.rogue),
    left: Math.max(stats.lone, 100 - stats.lone),
  };

  const size = 220;
  const c = size / 2;
  const max = 100;
  const r = c - 24;

  const pt = (angle: number, v: number) => {
    const rad = (angle * Math.PI) / 180;
    const rv = (v / max) * r;
    return { x: c + rv * Math.cos(rad), y: c + rv * Math.sin(rad) };
  };

  const p1 = pt(-90, values.top);
  const p2 = pt(0, values.right);
  const p3 = pt(90, values.bottom);
  const p4 = pt(180, values.left);

  const polygon = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map((lvl) => {
    const q1 = pt(-90, lvl * 100);
    const q2 = pt(0, lvl * 100);
    const q3 = pt(90, lvl * 100);
    const q4 = pt(180, lvl * 100);
    return `${q1.x},${q1.y} ${q2.x},${q2.y} ${q3.x},${q3.y} ${q4.x},${q4.y}`;
  });

  return (
    <div className="relative flex flex-col items-center">
      <p className="mb-3 font-terminal text-[10px] uppercase tracking-widest text-neon-cyan/70">
        // {t('radar')}
      </p>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radar-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF2D87" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {gridPolygons.map((poly, i) => (
          <polygon
            key={i}
            points={poly}
            fill="none"
            stroke="rgba(255,45,135,0.18)"
            strokeWidth="1"
          />
        ))}
        <line x1={c} y1={c - r} x2={c} y2={c + r} stroke="rgba(255,255,255,0.1)" />
        <line x1={c - r} y1={c} x2={c + r} y2={c} stroke="rgba(255,255,255,0.1)" />

        <motion.polygon
          points={polygon}
          fill="url(#radar-fill)"
          stroke="#FF2D87"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255,45,135,0.6))',
            transformOrigin: `${c}px ${c}px`,
          }}
        />
        {[p1, p2, p3, p4].map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={3.5}
            fill="#00F5FF"
            style={{ filter: 'drop-shadow(0 0 4px #00F5FF)' }}
          />
        ))}
      </svg>

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="relative h-full w-full">
          <Label className="left-1/2 top-[-4px] -translate-x-1/2 -translate-y-full">
            {t('dimensions.action')}
          </Label>
          <Label className="right-[-8px] top-1/2 -translate-y-1/2 translate-x-full">
            {t('dimensions.risk')}
          </Label>
          <Label className="left-1/2 bottom-[-4px] -translate-x-1/2 translate-y-full">
            {t('dimensions.moral')}
          </Label>
          <Label className="left-[-8px] top-1/2 -translate-y-1/2 -translate-x-full">
            {t('dimensions.social')}
          </Label>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={
        'absolute font-terminal text-[10px] uppercase tracking-widest text-neon-cyan/80 whitespace-nowrap ' +
        (className ?? '')
      }
    >
      {children}
    </span>
  );
}
