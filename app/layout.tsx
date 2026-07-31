import type { Metadata } from 'next';
import { Bebas_Neue, Orbitron, Rajdhani, Noto_Sans_SC } from 'next/font/google';
import './globals.css';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const orbitron = Orbitron({
  weight: ['400', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
});

const notoSC = Noto_Sans_SC({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gsti.example.com'),
  title: {
    default: 'GSTI · The City Knows Who You Are',
    template: '%s · GSTI',
  },
  description:
    'GSTI · Criminal Personality Identification. 进入这座犯罪之城，让数据库告诉你——你是谁。',
  openGraph: {
    title: 'GSTI · The City Knows Who You Are',
    description: '12 个抉择，锁定你在犯罪之城中的真实身份。',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GSTI · The City Knows Who You Are',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh"
      className={`${bebas.variable} ${orbitron.variable} ${rajdhani.variable} ${notoSC.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
