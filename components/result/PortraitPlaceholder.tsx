'use client';

import type { Personality } from '@/types/personality-record';
import { cn } from '@/utils/cn';

/**
 * 人物"肖像"占位 —— 霓虹剪影 + 大字号 callsign。
 * 未来替换为真实 AI 生图时，把外层 div 换成 <Image /> 即可。
 */
export function PortraitPlaceholder({ personality }: { personality: Personality }) {
  const colorClass = {
    pink: 'from-neon-pink/60 via-neon-purple/40 to-transparent',
    purple: 'from-neon-purple/60 via-neon-pink/40 to-transparent',
    cyan: 'from-neon-cyan/50 via-neon-purple/40 to-transparent',
    yellow: 'from-neon-yellow/50 via-neon-pink/40 to-transparent',
  }[personality.accentColor];

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden border border-neon-pink/40 bg-night-panel">
      {/* 光晕背景 */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', colorClass)} />

      {/* 网格纹 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* 大字 callsign */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="mb-2 font-terminal text-[10px] uppercase tracking-[0.4em] text-neon-cyan/80">
          CALLSIGN
        </span>
        <span
          className="font-display text-4xl md:text-6xl leading-none tracking-widest text-white"
          style={{ textShadow: '0 0 24px rgba(255, 45, 135, 0.85)' }}
        >
          {personality.callsign}
        </span>
        <span className="mt-4 font-terminal text-[10px] uppercase tracking-widest text-white/50">
          CODE · {personality.code}
        </span>
      </div>

      {/* 人形抽象剪影 */}
      <svg
        className="absolute bottom-0 left-1/2 h-3/5 -translate-x-1/2 opacity-25"
        viewBox="0 0 200 300"
        aria-hidden
      >
        <g fill="#050810">
          <circle cx="100" cy="60" r="38" />
          <path d="M 40 300 L 40 190 Q 40 130 100 130 Q 160 130 160 190 L 160 300 Z" />
        </g>
      </svg>

      {/* 扫描线覆盖 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.35) 4px, transparent 5px)',
        }}
      />

      {/* 四角标记 */}
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
  );
}
