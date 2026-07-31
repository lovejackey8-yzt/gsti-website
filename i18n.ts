import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

/**
 * 支持的 locale 列表。
 * 首发只上线 zh，ru / en 翻译到位后加进来即可。
 */
export const locales = ['zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
