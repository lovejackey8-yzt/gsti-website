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
};

export default withNextIntl(nextConfig);
