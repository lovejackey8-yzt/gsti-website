import { setRequestLocale } from 'next-intl/server';
import LibraryClient from '@/components/library/LibraryClient';

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LibraryClient />;
}
