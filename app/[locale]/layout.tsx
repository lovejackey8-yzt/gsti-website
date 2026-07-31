import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { locales, type Locale } from '@/i18n';
import { RainLayer } from '@/components/effects/RainLayer';
import { ScanLines } from '@/components/effects/ScanLines';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="relative min-h-screen scanlines">
        {/* 全站雨滴层 · 固定在最底 */}
        <RainLayer />
        {/* CRT 扫描线覆盖（额外一层 · 增强质感） */}
        <ScanLines />

        <TopBar />

        <main className="relative z-10">{children}</main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
