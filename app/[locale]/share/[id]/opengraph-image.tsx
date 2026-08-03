import { ImageResponse } from 'next/og';
import personalitiesData from '@/data/personalities.json';
import type { Personality } from '@/types/personality-record';
import zhLocale from '@/locales/zh.json';

const personalities = personalitiesData as Personality[];

/**
 * 动态生成社媒分享缩略图 · 1200 × 630
 * 结构：左侧人物大图 + 右侧档案信息（编号 / 名字 / 星级 / 4 维数值）
 * Vercel 边缘节点缓存 · 首次生成 ~1s · 后续毫秒级
 */

export const runtime = 'edge';
export const alt = 'GSTI Criminal Personality File';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PINK = '#FF2D87';
const PURPLE = '#7B61FF';
const CYAN = '#00F5FF';
const YELLOW = '#FFD100';
const NIGHT = '#0A0F1A';
const PANEL = '#1A1F2E';

export default async function OGImage({ params }: { params: { id: string; locale: string } }) {
  const p = personalities.find((x) => String(x.id) === params.id);
  if (!p) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: NIGHT,
            color: PINK,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          GSTI · FILE NOT FOUND
        </div>
      ),
      size,
    );
  }

  const nameMap = (zhLocale as { personalities: Record<string, { name?: string; shortDesc?: string }> })
    .personalities;
  const name = nameMap[p.i18nKey]?.name ?? p.callsign;
  const shortDesc = nameMap[p.i18nKey]?.shortDesc ?? 'The City Knows Who You Are.';

  const s = p.stats;
  const fileNo = `VC-${String(p.id).padStart(2, '0')}-GSTI-${(Math.abs(p.id * 397) % 999)
    .toString()
    .padStart(3, '0')}`;

  // Vercel 部署时可以用绝对 URL 引图，本地/边缘环境用相对
  // 但 edge runtime 不支持文件系统 · 只能用 public URL
  // 我们的 portrait 图在 public/portraits/ · Vercel 会自动 serve
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://gsti-website-11bh.vercel.app';
  const portraitUrl = `${origin}/portraits/p${p.id}.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${NIGHT} 0%, ${PANEL} 60%, ${NIGHT} 100%)`,
          display: 'flex',
          fontFamily: 'sans-serif',
          color: '#fff',
        }}
      >
        {/* 左侧 · 人物大图 */}
        <div
          style={{
            width: 500,
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: `2px solid ${PINK}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitUrl}
            width={500}
            height={630}
            alt=""
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          {/* 底部渐变遮罩 · 让底部字更清晰 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
              background: `linear-gradient(to top, ${NIGHT} 0%, rgba(10,15,26,0) 100%)`,
              display: 'flex',
            }}
          />
          {/* 左上角 GSTI 标记 */}
          <div
            style={{
              position: 'absolute',
              top: 30,
              left: 30,
              padding: '6px 14px',
              border: `2px solid ${PINK}`,
              background: 'rgba(10,15,26,0.8)',
              color: PINK,
              fontSize: 20,
              letterSpacing: 4,
              fontWeight: 900,
              display: 'flex',
            }}
          >
            GSTI
          </div>
          {/* 左下角 CONFIDENTIAL */}
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              left: 30,
              color: YELLOW,
              fontSize: 16,
              letterSpacing: 6,
              fontWeight: 700,
              display: 'flex',
            }}
          >
            CONFIDENTIAL
          </div>
        </div>

        {/* 右侧 · 档案信息 */}
        <div
          style={{
            flex: 1,
            padding: '55px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* 顶部 · 编号 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                color: CYAN,
                fontSize: 18,
                letterSpacing: 6,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              // FILE NO. {fileNo}
            </div>
            <div
              style={{
                color: '#fff',
                fontSize: 20,
                letterSpacing: 3,
                opacity: 0.6,
                display: 'flex',
              }}
            >
              CITY DATABASE · ROOKLYN CITY
            </div>
          </div>

          {/* 中部 · CALLSIGN + 名字 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                color: PINK,
                fontSize: 68,
                letterSpacing: 6,
                fontWeight: 900,
                lineHeight: 1,
                textShadow: `0 0 40px ${PINK}66`,
                display: 'flex',
              }}
            >
              {p.callsign}
            </div>
            <div
              style={{
                color: '#fff',
                fontSize: 40,
                letterSpacing: 4,
                fontWeight: 700,
                display: 'flex',
              }}
            >
              {name}
            </div>
            <div
              style={{
                color: '#fff',
                fontSize: 22,
                opacity: 0.72,
                lineHeight: 1.4,
                display: 'flex',
                maxWidth: 560,
              }}
            >
              {shortDesc}
            </div>
          </div>

          {/* 底部 · 4 维数值 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <StatRow label="冲动 IMPULSE" value={s.impulse} color={PINK} />
            <StatRow label="独行 LONE" value={s.lone} color={PURPLE} />
            <StatRow label="叛逆 ROGUE" value={s.rogue} color={CYAN} />
            <StatRow label="赌徒 HIGH-RISK" value={s.highrisk} color={YELLOW} />
          </div>

          {/* 最底部 · CTA */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${PINK}44`,
              paddingTop: 20,
            }}
          >
            <div
              style={{
                color: '#fff',
                fontSize: 20,
                letterSpacing: 3,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              THE CITY KNOWS WHO YOU ARE.
            </div>
            <div
              style={{
                color: YELLOW,
                fontSize: 18,
                letterSpacing: 4,
                fontWeight: 700,
                display: 'flex',
              }}
            >
              → IDENTIFY YOURSELF
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: 180,
          fontSize: 16,
          letterSpacing: 3,
          color: '#fff',
          opacity: 0.8,
          display: 'flex',
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 12,
          background: 'rgba(255,255,255,0.08)',
          display: 'flex',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: color,
            boxShadow: `0 0 20px ${color}`,
            display: 'flex',
          }}
        />
      </div>
      <div
        style={{
          width: 60,
          fontSize: 20,
          fontWeight: 700,
          color,
          textAlign: 'right',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {value}
      </div>
    </div>
  );
}
