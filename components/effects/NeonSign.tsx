'use client';

import { cn } from '@/utils/cn';

interface NeonSignProps {
  children: React.ReactNode;
  color?: 'pink' | 'purple' | 'cyan' | 'yellow';
  flicker?: boolean;
  className?: string;
}

const colorMap = {
  pink: 'text-neon-pink',
  purple: 'text-neon-purple',
  cyan: 'text-neon-cyan',
  yellow: 'text-neon-yellow',
} as const;

/**
 * 霓虹灯管文字。用于 logo、大标题。
 * flicker=true 时叠加 4s 闪烁动画（少量抖动，避免烦人）。
 */
export function NeonSign({
  children,
  color = 'pink',
  flicker = false,
  className,
}: NeonSignProps) {
  return (
    <span
      className={cn(
        'font-display inline-block',
        colorMap[color],
        flicker && 'animate-neon-flicker',
        className,
      )}
    >
      {children}
    </span>
  );
}
