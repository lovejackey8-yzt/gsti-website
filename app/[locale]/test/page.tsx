import { setRequestLocale } from 'next-intl/server';
import TestClient from '@/components/test/TestClient';

export default async function TestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TestClient />;
}
