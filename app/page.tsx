import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

// 根路径 → 默认语言（zh）
export default function Root() {
  redirect(`/${defaultLocale}`);
}
