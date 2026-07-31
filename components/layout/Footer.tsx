import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="relative z-10 mt-24 border-t border-neon-pink/20 bg-night/80 py-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs md:flex-row md:px-6">
        <div className="font-terminal uppercase tracking-widest text-white/50">
          <span className="text-neon-pink">GSTI</span>
          <span className="mx-2 text-white/25">//</span>
          <span>CRIMINAL PERSONALITY IDENTIFICATION</span>
        </div>
        <div className="font-terminal uppercase tracking-widest text-white/40">
          {t('disclaimer')}
        </div>
      </div>
    </footer>
  );
}
