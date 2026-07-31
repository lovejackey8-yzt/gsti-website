import { setRequestLocale } from 'next-intl/server';
import ResultClient from '@/components/result/ResultClient';

export default async function ResultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ResultClient />;
}
