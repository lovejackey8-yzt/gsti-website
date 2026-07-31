import { cn } from '@/utils/cn';

const colorMap = {
  S: 'text-neon-pink shadow-neon-pink',
  A: 'text-neon-yellow shadow-neon-yellow',
  B: 'text-neon-cyan shadow-neon-cyan',
  C: 'text-white/70',
} as const;

export function InfluenceRank({ rank }: { rank: 'S' | 'A' | 'B' | 'C' }) {
  return (
    <span
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center border-2 border-current font-display text-2xl md:h-12 md:w-12 md:text-3xl',
        colorMap[rank],
      )}
      style={{ textShadow: '0 0 12px currentColor' }}
    >
      {rank}
    </span>
  );
}
