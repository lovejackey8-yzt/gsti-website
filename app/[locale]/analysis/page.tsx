import { setRequestLocale } from 'next-intl/server';
import AnalysisClient from '@/components/analysis/AnalysisClient';

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AnalysisClient />;
}
