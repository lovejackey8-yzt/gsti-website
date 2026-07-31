import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroCityScene } from '@/components/landing/HeroCityScene';
import { IdentifyButton } from '@/components/landing/IdentifyButton';
import { NeonSign } from '@/components/effects/NeonSign';
import { HeroClock } from '@/components/landing/HeroClock';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('landing');

  return (
    <>
      {/* ==================== HERO · 首屏 ==================== */}
      <section className="relative flex min-h-[calc(100vh-3.5rem)] w-full flex-col overflow-hidden">
        <HeroCityScene />

        {/* 主内容居中容器 */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          {/* Kicker */}
          <p className="mb-3 font-terminal text-[10px] uppercase tracking-[0.5em] text-neon-cyan/80 md:mb-4 md:text-sm">
            {t('kicker')}
          </p>

          {/* GSTI 巨型霓虹标题 */}
          <h1 className="mb-3 select-none leading-none">
            <NeonSign
              color="pink"
              flicker
              className="text-[6.5rem] leading-none sm:text-[8rem] md:text-[12rem] lg:text-[15rem]"
              // 手动叠加更强的粉→紫双色发光
            >
              GSTI
            </NeonSign>
          </h1>

          {/* 副标 · CRIMINAL PERSONALITY IDENTIFICATION */}
          <p className="mb-10 font-tech text-[10px] uppercase tracking-[0.4em] text-white/80 md:mb-12 md:text-sm">
            {t('subtitle')}
          </p>

          {/* 手写斜体英文标语 */}
          <p
            className="mb-1 text-3xl italic text-neon-purple md:text-5xl"
            style={{
              fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
              letterSpacing: '0.01em',
              textShadow:
                '0 0 12px rgba(157, 134, 255, 0.85), 0 0 30px rgba(255, 45, 135, 0.35)',
            }}
          >
            {t('tagline')}
          </p>

          {/* 中文对照 */}
          <p className="mb-10 text-sm text-white/70 tracking-widest md:mb-14 md:text-lg">
            {t('taglineCn')}
          </p>

          {/* 主 CTA */}
          <IdentifyButton
            href={`/${locale}/test`}
            label={t('cta')}
            sublabel={t('ctaSub')}
          />
        </div>

        {/* 底部 HUD 条 · 左：状态；右：时间 / 位置 */}
        <div className="relative z-10 mx-auto mb-4 flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pb-4 font-terminal text-[10px] uppercase tracking-[0.35em] text-white/70 md:mb-6 md:text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
            </span>
            <span className="text-neon-cyan">{t('statusOnline')}</span>
          </div>
          <HeroClock />
        </div>

        {/* 底部滚动提示 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-1">
          <span className="font-terminal text-[9px] uppercase tracking-[0.5em] text-white/25 animate-pulse md:text-[10px]">
            scroll · learn more
          </span>
        </div>
      </section>

      {/* ==================== 模块块 · SYSTEM OVERVIEW ==================== */}
      <section className="relative mx-auto max-w-6xl px-4 py-24 md:px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 font-terminal text-xs uppercase tracking-[0.4em] text-neon-cyan/70">
            // SYSTEM OVERVIEW
          </p>
          <h2 className="mb-4 text-3xl md:text-5xl font-display tracking-wider text-white">
            {t('featureTitle')}
          </h2>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-white/60 leading-relaxed">
            {t('featureDesc')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(['immersive', 'unique', 'share'] as const).map((k, i) => (
            <div
              key={k}
              className="panel-file relative p-6 md:p-8 transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 font-terminal text-[10px] uppercase tracking-widest text-neon-cyan/60">
                MODULE 0{i + 1}
              </div>
              <h3 className="mb-3 font-display text-2xl tracking-wider text-neon-pink">
                {t(`features.${k}.title`)}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {t(`features.${k}.desc`)}
              </p>
              <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-neon-cyan shadow-neon-cyan" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
