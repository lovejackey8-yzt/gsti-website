'use client';

import { useEffect, useState } from 'react';

interface Drop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  height: number;
}

/**
 * 双层雨滴视觉：
 * - 前景：细长、快、明亮
 * - 背景：更稀、慢、偏紫，制造景深
 * 用纯 CSS 动画，性能友好。
 */
export function RainLayer({ density = 60 }: { density?: number }) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [bgDrops, setBgDrops] = useState<Drop[]>([]);

  useEffect(() => {
    const gen = (count: number, minDur: number, maxDur: number, hMin: number, hMax: number): Drop[] =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * -5,
        duration: minDur + Math.random() * (maxDur - minDur),
        opacity: 0.2 + Math.random() * 0.6,
        height: hMin + Math.random() * (hMax - hMin),
      }));

    setDrops(gen(density, 0.6, 1.4, 40, 90));
    setBgDrops(gen(Math.floor(density / 2), 1.5, 3, 60, 140));
  }, [density]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    >
      {/* 背景雨（远景 · 紫调 · 慢） */}
      {bgDrops.map((d) => (
        <span
          key={`bg-${d.id}`}
          className="absolute top-0 block w-px animate-rain-fall"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            opacity: d.opacity * 0.5,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            background:
              'linear-gradient(180deg, transparent 0%, rgba(123, 97, 255, 0.55) 60%, transparent 100%)',
          }}
        />
      ))}
      {/* 前景雨（近景 · 粉调 · 快） */}
      {drops.map((d) => (
        <span
          key={`fg-${d.id}`}
          className="absolute top-0 block w-[1.5px] animate-rain-fall"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255, 45, 135, 0.75) 60%, rgba(255, 45, 135, 0.9) 100%)',
            boxShadow: '0 0 2px rgba(255, 45, 135, 0.6)',
          }}
        />
      ))}
    </div>
  );
}
