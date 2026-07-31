'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useTestStore } from '@/hooks/useTestStore';

interface IdentifyButtonProps {
  href: string;
  label: string;
  sublabel?: string;
  className?: string;
}

/**
 * 主 CTA · 霓虹粉描边 + 呼吸光晕 + 悬停填充。
 * 点击时先 reset store，保证从第 1 题开始。
 */
export function IdentifyButton({
  href,
  label,
  sublabel,
  className,
}: IdentifyButtonProps) {
  const router = useRouter();
  const reset = useTestStore((s) => s.reset);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    reset();
    // 清掉 sessionStorage 里的上报标记，让新一轮能重新上报
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('gsti-tracked-once');
    }
    router.push(href);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn('inline-block', className)}
    >
      <a
        href={href}
        onClick={handleClick}
        className="group relative inline-flex flex-col items-center gap-1"
      >
        <span
          className={cn(
            'relative flex items-center gap-3 border-2 border-neon-pink bg-neon-pink/5',
            'px-8 py-4 md:px-14 md:py-5',
            'font-display text-2xl md:text-3xl tracking-[0.25em] text-white',
            'shadow-neon-pink transition-all duration-300',
            'hover:bg-neon-pink hover:text-white',
            'animate-pulse-glow',
          )}
        >
          <span className="text-neon-pink group-hover:text-white transition-colors">
            [
          </span>
          <span>{label}</span>
          <span className="text-neon-pink group-hover:text-white transition-colors">
            ]
          </span>

          <Corner className="left-[-6px] top-[-6px]" />
          <Corner className="right-[-6px] top-[-6px] rotate-90" />
          <Corner className="right-[-6px] bottom-[-6px] rotate-180" />
          <Corner className="left-[-6px] bottom-[-6px] -rotate-90" />
        </span>

        {sublabel && (
          <span className="font-terminal text-[10px] md:text-xs uppercase tracking-[0.4em] text-neon-cyan/80">
            {sublabel}
          </span>
        )}
      </a>
    </motion.div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute h-3 w-3 border-l-2 border-t-2 border-neon-cyan',
        className,
      )}
    />
  );
}
