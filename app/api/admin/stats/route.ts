import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readAllEvents } from '@/utils/eventsStore';
import personalitiesData from '@/data/personalities.json';
import type { Personality } from '@/types/personality-record';

const personalities = personalitiesData as Personality[];

export const runtime = 'nodejs';
const COOKIE_NAME = 'gsti_admin';

export async function GET() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_PASSWORD || 'GSTI2026';
  if (!token || token !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const events = await readAllEvents();
  const total = events.length;

  // 每型统计
  const perTypeMap = new Map<number, number>();
  for (const e of events) {
    perTypeMap.set(e.personalityId, (perTypeMap.get(e.personalityId) ?? 0) + 1);
  }
  const perType = personalities
    .map((p) => ({
      id: p.id,
      code: p.code,
      callsign: p.callsign,
      i18nKey: p.i18nKey,
      count: perTypeMap.get(p.id) ?? 0,
      percent: total > 0 ? Math.round(((perTypeMap.get(p.id) ?? 0) / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 时间维度：24h / 7d
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const last24h = events.filter((e) => now - e.ts < oneDay).length;
  const last7d = events.filter((e) => now - e.ts < 7 * oneDay).length;

  // 最近 7 天每天的量
  const buckets: Array<{ date: string; count: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = dayStart.getTime() + oneDay;
    const count = events.filter((e) => e.ts >= dayStart.getTime() && e.ts < dayEnd).length;
    buckets.push({
      date: `${dayStart.getMonth() + 1}/${dayStart.getDate()}`,
      count,
    });
  }

  return NextResponse.json({
    ok: true,
    total,
    last24h,
    last7d,
    daily: buckets,
    perType,
  });
}
