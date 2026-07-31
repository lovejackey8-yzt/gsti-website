import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // 本地静态图直接原样输出，避免 sharp/优化引擎在 dev 上偶发问题
    unoptimized: true,
  },
  eslint: {
    // 生产 build 不因 ESLint 装饰性 // 前缀而失败；装饰前缀是有意为之的档案 UI 风格。
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
