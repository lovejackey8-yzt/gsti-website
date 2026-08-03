'use client';

import ResultClient from '@/components/result/ResultClient';

/**
 * 分享页视图 · 无需答题即可查看某型档案卡
 * 通过 forcedPersonalityId + isShareView 复用 ResultClient 组件
 */
export default function ShareViewClient({
  personalityId,
}: {
  personalityId: number;
  locale: string;
}) {
  return <ResultClient forcedPersonalityId={personalityId} isShareView />;
}
