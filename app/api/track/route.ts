import { NextResponse } from 'next/server';
import { appendEvent } from '@/utils/eventsStore';

export const runtime = 'nodejs';

/**
 * 前端在 Analysis 完成时静默 POST 上报一次。
 * body: { code, personalityId, callsign }
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      code?: string;
      personalityId?: number;
      callsign?: string;
    };

    // 简单校验
    if (
      typeof body.code !== 'string' ||
      body.code.length !== 4 ||
      typeof body.personalityId !== 'number' ||
      typeof body.callsign !== 'string'
    ) {
      return NextResponse.json({ ok: false, err: 'invalid' }, { status: 400 });
    }

    await appendEvent({
      ts: Date.now(),
      code: body.code,
      personalityId: body.personalityId,
      callsign: body.callsign,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, err: 'server' }, { status: 500 });
  }
}
