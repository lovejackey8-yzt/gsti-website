import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

/**
 *支持的 locale 列表。
 * 首发 zh + en，俄语翻译到位后加进来即可。
 */
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl 3.22+ 推荐用法：从 requestLocale 拿 locale，并显式返回
  let locale = await requestLocale;

  // 兜底：未识别或缺失时回落到默认
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
