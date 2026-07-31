'use client';

import { useEffect, useState } from 'react';

/**
 * 首屏底栏用的实时时钟 · 展示 TIME 和 LOCATION。
 * 客户端组件，避免 hydration mismatch。
 */
export function HeroClock() {
  const [now, setNow] = useState('02:47 AM');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hh = String(((h + 11) % 12) + 1).padStart(2, '0');
      setNow(`${hh}:${m} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <span>
        <span className="text-white/40 mr-2">TIME</span>
        <span className="text-neon-cyan">{now}</span>
      </span>
      <span className="text-white/25">|</span>
      <span>
        <span className="text-white/40 mr-2">LOCATION</span>
        <span className="text-neon-cyan">ROOKLYN CITY</span>
      </span>
    </div>
  );
}
