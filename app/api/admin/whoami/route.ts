import { NextResponse } from 'next/server';

/**
 * 临时诊断接口：返回 ADMIN_PASSWORD 环境变量的元信息（不返回明文）
 * 用于排查密码输入不匹配问题。用完立刻删除。
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const pwd = process.env.ADMIN_PASSWORD;

  if (!pwd) {
    return NextResponse.json({
      set: false,
      note: 'ADMIN_PASSWORD 环境变量未设置',
    });
  }

  const chars = [...pwd].map((c) => ({
    ch: c,
    code: c.charCodeAt(0),
    hex: c.charCodeAt(0).toString(16),
  }));

  return NextResponse.json({
    set: true,
    length: pwd.length,
    firstChar: pwd[0],
    lastChar: pwd[pwd.length - 1],
    // 逐字符打印 code point，能立刻看出全角/半角、隐藏空格等问题
    chars,
    // 校验特殊字符是不是 ASCII 半角
    hasFullWidthHash: pwd.includes('\uFF03'),
    hasHalfWidthHash: pwd.includes('#'),
    hasLeadingSpace: pwd !== pwd.trimStart(),
    hasTrailingSpace: pwd !== pwd.trimEnd(),
  });
}
