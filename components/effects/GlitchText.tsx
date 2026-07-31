'use client';

import { cn } from '@/utils/cn';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3';
}

/**
 * 故障文字：文字 + 两层错位彩色副本 + 快速抖动。
 * 用在瞬时反馈（点击 CTA 后、转场瞬间）。
 */
export function GlitchText({ text, className, as: Tag = 'span' }: GlitchTextProps) {
  return (
    <Tag className={cn('relative inline-block font-display', className)}>
      <span aria-hidden className="absolute inset-0 animate-glitch text-neon-pink opacity-70 mix-blend-screen">
        {text}
      </span>
      <span aria-hidden className="absolute inset-0 animate-glitch text-neon-cyan opacity-60 mix-blend-screen [animation-delay:150ms]">
        {text}
      </span>
      <span className="relative text-white">{text}</span>
    </Tag>
  );
}
