'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TerminalBoot } from '@/components/effects/TerminalBoot';
import { GlitchText } from '@/components/effects/GlitchText';
import { useTestStore } from '@/hooks/useTestStore';
import { resolvePersonality } from '@/utils/scoring';

const STEP_DURATION = 900; // 每一阶段停留（毫秒）

export default function AnalysisClient() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('analysis');
  const hasHydrated = useTestStore((s) => s.hasHydrated);

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'confirmed'>('scanning');
  const [hasAnswers, setHasAnswers] = useState<boolean | null>(null);
  const trackedRef = useRef(false);

  const steps = useMemo(
    () => [t('steps.step1'), t('steps.step2'), t('steps.step3'), t('steps.step4')],
    [t],
  );

  // 只在 hasHydrated 变 true 时做一次判断，避免 answers 引用变化触发重复
  useEffect(() => {
    if (!hasHydrated) return;
    const state = useTestStore.getState();
    const answers = state.answers;
    const answered = Object.keys(answers).length;

    if (answered < 12) {
      // 数据不完整 → 回测试页
      router.replace(`/${locale}/test`);
      setHasAnswers(false);
      return;
    }

    setHasAnswers(true);

    // 静默上报（sessionStorage 防重复）
    if (!trackedRef.current) {
      trackedRef.current = true;
      try {
        const { personality, code } = resolvePersonality(answers);
        if (typeof window !== 'undefined' && !sessionStorage.getItem('gsti-tracked-once')) {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              personalityId: personality.id,
              callsign: personality.callsign,
            }),
            keepalive: true,
          }).catch(() => undefined);
          sessionStorage.setItem('gsti-tracked-once', '1');
        }
      } catch {
        /* noop */
      }
    }

    // 启动扫描进度
    const total = steps.length * STEP_DURATION + 400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / total) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
      else {
        setPhase('confirmed');
        setTimeout(() => router.push(`/${locale}/result`), 1200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // 严格只依赖 hasHydrated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  if (!hasHydrated || hasAnswers === null) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
        <span className="font-terminal text-sm uppercase tracking-widest text-neon-cyan/70 animate-pulse">
          INITIALIZING SESSION ...
        </span>
      </div>
    );
  }

  if (!hasAnswers) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
        <span className="font-terminal text-sm uppercase tracking-widest text-neon-pink/80 animate-pulse">
          NO DECISION RECORD · REDIRECTING ...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-center justify-center px-4 py-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 font-terminal text-xs uppercase tracking-[0.5em] text-neon-cyan/70"
      >
        // CITY DATABASE
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4 text-center font-display text-3xl leading-none md:text-5xl lg:text-6xl tracking-widest"
      >
        {phase === 'confirmed' ? (
          <GlitchText text="IDENTITY CONFIRMED" as="span" className="text-white" />
        ) : (
          <span className="text-neon-pink" style={{ textShadow: '0 0 20px rgba(255,45,135,0.7)' }}>
            {t('title')}
          </span>
        )}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-10 text-center text-sm md:text-base text-white/60"
      >
        {t('subtitle')}
      </motion.p>

      <div className="panel-file mb-8 w-full max-w-2xl p-5 md:p-7 min-h-[180px]">
        <TerminalBoot lines={steps} charDelay={22} lineDelay={STEP_DURATION - 400} />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="mb-2 flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest text-white/50">
          <span>DECRYPTING PROFILE</span>
          <span className="text-neon-pink">{Math.floor(progress)}%</span>
        </div>
        <div className="relative h-1.5 overflow-hidden bg-night-panel">
          <motion.div
            className="absolute inset-y-0 left-0 data-bar bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 12px rgba(255, 45, 135, 0.7)',
            }}
          />
        </div>
      </div>

      {phase === 'confirmed' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 font-terminal text-xs uppercase tracking-[0.4em] text-neon-cyan/80"
        >
          {t('steps.step5')}
        </motion.p>
      )}
    </div>
  );
}
