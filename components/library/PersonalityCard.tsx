'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Personality } from '@/types/personality-record';
import { ThreatLevel } from '@/components/result/ThreatLevel';
import { cn } from '@/utils/cn';

interface PersonalityCardProps {
  personality: Personality;
  unlocked: boolean;
  index: number;
}

export function PersonalityCard({
  personality,
  unlocked,
  index,
}: PersonalityCardProps) {
  const tp = useTranslations('personalities');
  const t = useTranslations('library');
  const name = tp(`${personality.i18nKey}.name`);
  const desc = tp(`${personality.i18nKey}.shortDesc`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
      whileHover={{ y: -4 }}
      className={cn(
        'panel-file group relative overflow-hidden p-4 md:p-5',
        !unlocked && 'opacity-80',
      )}
    >
      {/* 顶部：编号 + 威胁 */}
      <div className="mb-3 flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest text-white/50">
        <span>#{String(personality.id).padStart(2, '0')}</span>
        <ThreatLevel level={personality.threatLevel} />
      </div>

      {/* 肖像 · 使用真实图片 */}
      <div className="relative mb-3 aspect-[2/3] overflow-hidden border border-neon-pink/30 bg-night">
        <Image
          src={`/portraits/p${personality.id}.png`}
          alt={name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* 底部渐变遮罩 · 让 callsign 压得住图 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-night via-night/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-2 text-center">
          <span
            className="font-display text-lg leading-none tracking-widest text-white md:text-xl"
            style={{ textShadow: '0 0 12px rgba(255,45,135,0.85)' }}
          >
            {personality.callsign}
          </span>
        </div>

        {/* 扫描线 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.28) 4px, transparent 5px)',
          }}
        />

        {/* 未解锁 · 毛玻璃 + 锁标 */}
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-night/70 backdrop-blur-[3px]">
            <span className="font-terminal text-2xl text-neon-pink drop-shadow-[0_0_8px_rgba(255,45,135,0.9)]">
              🔒
            </span>
            <span className="font-terminal text-[10px] uppercase tracking-widest text-white/60">
              {t('locked')}
            </span>
          </div>
        )}
      </div>

      {/* 名 + 描述 */}
      <h3
        className={cn(
          'mb-1 font-display text-xl tracking-wider md:text-2xl',
          unlocked ? 'text-neon-pink' : 'text-white/70',
        )}
      >
        {name}
      </h3>
      <p className="mb-3 h-10 line-clamp-2 text-xs text-white/60 md:text-sm">
        {desc}
      </p>

      {/* 底部：code + 已识别标记 */}
      <div className="flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest text-white/50">
        <span>
          <span className="text-white/30 mr-1">CODE</span>
          <span className="text-neon-cyan">{personality.code}</span>
        </span>
        {unlocked && (
          <span className="text-neon-cyan/80">· {t('unlocked')}</span>
        )}
      </div>
    </motion.article>
  );
}
