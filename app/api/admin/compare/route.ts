import { NextResponse } from 'next/server';

/**
 * 临时诊断接口 v2：POST { password }
 * 对比服务器收到的 password vs env 里的 ADMIN_PASSWORD
 * 不返回明文，只返回长度和字符编码差异。用完立刻删。
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function inspect(str: string | undefined) {
  if (!str) return { set: false };
  return {
    set: true,
    length: str.length,
    codes: [...str].map((c) => c.charCodeAt(0)),
    hex: [...str].map((c) => c.charCodeAt(0).toString(16)).join(' '),
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    const received = body.password;
    const expected = process.env.ADMIN_PASSWORD;

    return NextResponse.json({
      received: inspect(received),
      expected: inspect(expected),
      equal: received === expected,
      equalTrim: received?.trim() === expected?.trim(),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}

// GET 版本方便用浏览器测：/api/admin/compare?p=xxx
export async function GET(req: Request) {
  const url = new URL(req.url);
  const received = url.searchParams.get('p') ?? undefined;
  const expected = process.env.ADMIN_PASSWORD;

  return NextResponse.json({
    received: inspect(received),
    expected: inspect(expected),
    equal: received === expected,
    equalTrim: received?.trim() === expected?.trim(),
  });
}
