'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface TerminalBootProps {
  lines: string[];
  /** 每字符打字间隔（毫秒） */
  charDelay?: number;
  /** 每行之间的停顿（毫秒） */
  lineDelay?: number;
  /** 打完是否显示闪烁光标 */
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

/**
 * 终端逐字打字。用于加载页 4 阶段扫描序列、CASE FILE 场景描述等。
 */
export function TerminalBoot({
  lines,
  charDelay = 28,
  lineDelay = 220,
  showCursor = true,
  className,
  onComplete,
}: TerminalBootProps) {
  const [rendered, setRendered] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let lineIndex = 0;
    let charIndex = 0;

    const step = () => {
      if (cancelled) return;
      if (lineIndex >= lines.length) {
        setDone(true);
        onComplete?.();
        return;
      }
      const target = lines[lineIndex];
      if (charIndex < target.length) {
        charIndex++;
        setCurrentLine(target.slice(0, charIndex));
        setTimeout(step, charDelay);
      } else {
        setRendered((prev) => [...prev, target]);
        setCurrentLine('');
        lineIndex++;
        charIndex = 0;
        setTimeout(step, lineDelay);
      }
    };

    step();
    return () => {
      cancelled = true;
    };
  }, [lines, charDelay, lineDelay, onComplete]);

  return (
    <div className={cn('font-terminal text-sm md:text-base leading-relaxed', className)}>
      {rendered.map((line, i) => (
        <div key={i} className="text-neon-cyan/90">
          <span className="text-neon-pink mr-2">&gt;</span>
          {line}
        </div>
      ))}
      {!done && currentLine && (
        <div className="text-neon-cyan/90">
          <span className="text-neon-pink mr-2">&gt;</span>
          {currentLine}
          {showCursor && <span className="ml-1 inline-block h-4 w-2 bg-neon-cyan/80 animate-pulse align-middle" />}
        </div>
      )}
      {done && showCursor && (
        <div className="text-neon-cyan/60">
          <span className="text-neon-pink mr-2">&gt;</span>
          <span className="inline-block h-4 w-2 bg-neon-cyan/80 animate-pulse align-middle" />
        </div>
      )}
    </div>
  );
}
