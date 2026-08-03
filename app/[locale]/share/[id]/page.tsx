import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import personalitiesData from '@/data/personalities.json';
import type { Personality } from '@/types/personality-record';
import zhLocale from '@/locales/zh.json';
import ShareViewClient from '@/components/result/ShareViewClient';

const personalities = personalitiesData as Personality[];

/**
 * 独立分享页：/[locale]/share/[id]
 * 无需答题就能访问 · 用于分享自己那型的档案。
 * 支持 og:image 自动生成缩略图（见同目录 opengraph-image.tsx）。
 */

interface Params {
  locale: string;
  id: string;
}

export async function generateStaticParams() {
  return personalities.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const p = personalities.find((x) => String(x.id) === id);
  if (!p) return { title: 'GSTI · Not Found' };

  const nameMap = (zhLocale as { personalities: Record<string, { name?: string; shortDesc?: string }> })
    .personalities;
  const name = nameMap[p.i18nKey]?.name ?? p.callsign;
  const shortDesc = nameMap[p.i18nKey]?.shortDesc ?? '';

  const title = `${name} · ${p.callsign} | GSTI`;
  const description = shortDesc ||'The City Knows Who You Are.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
      // opengraph-image.tsx 会自动生成 1200x630 图 · Next 会自动填这个字段
      // 手动写一份兜底以防万一
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: { params: Promise<Params> }) {
  const { id, locale } = await params;
  const p = personalities.find((x) => String(x.id) === id);
  if (!p) return notFound();
  return <ShareViewClient personalityId={p.id} locale={locale} />;
}
