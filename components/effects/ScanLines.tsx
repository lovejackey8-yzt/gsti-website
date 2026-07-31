'use client';

/**
 * CRT 扫描线覆盖层（一条明亮的横线缓慢从上扫到下 · 增强"终端感"）
 * 全站扫描线的密集条纹由 globals.css 的 .scanlines 提供，这里做的是"流动光条"。
 */
export function ScanLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
    >
      <div
        className="absolute inset-x-0 h-24 animate-scan-lines"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0, 245, 255, 0.06) 45%, rgba(0, 245, 255, 0.14) 50%, rgba(0, 245, 255, 0.06) 55%, transparent 100%)',
        }}
      />
    </div>
  );
}
