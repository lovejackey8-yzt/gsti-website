import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * 登录：POST { password } → 校验后种 cookie
 * 校验字段来自 process.env.ADMIN_PASSWORD (未设时 fallback = "GSTI2026")
 */
export const runtime = 'nodejs';

const COOKIE_NAME = 'gsti_admin';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 天

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    const expected = process.env.ADMIN_PASSWORD || 'GSTI2026';

    if (!body.password || body.password !== expected) {
      // 故意延迟一下，缓解暴力破解
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const jar = await cookies();
    jar.set(COOKIE_NAME, expected, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: MAX_AGE_SECONDS,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
