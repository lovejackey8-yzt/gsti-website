import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

/**
 * 排除：
 * - /api/*
 * - /admin/*（隐藏后台走独立布局，不参与 i18n）
 * - Next 静态资源
 * - 带文件扩展名的静态文件
 */
export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
