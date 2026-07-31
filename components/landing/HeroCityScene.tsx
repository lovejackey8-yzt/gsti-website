import Image from 'next/image';

/**
 * 首页背景：AI 生成的 ROOKLYN CITY 雨夜街景 · 完全对齐参考图。
 * 使用 next/image 的 fill 布局；上方渐变遮罩保证文字可读。
 */
export function HeroCityScene() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* 主画面 */}
      <Image
        src="/hero/rooklyn-city.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* 顶部到中部的深色渐变 · 让 GSTI 大字压得住背景 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,15,26,0.55) 0%, rgba(10,15,26,0.15) 35%, rgba(10,15,26,0.35) 65%, rgba(10,15,26,0.75) 100%)',
        }}
      />

      {/* 底部霓虹光晕 · 强化"街景在燃烧"的观感 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255, 45, 135, 0.32) 0%, rgba(123, 97, 255, 0.18) 40%, transparent 75%)',
        }}
      />

      {/* 影片颗粒感（低强度） */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
