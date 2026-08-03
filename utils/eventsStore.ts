import { Redis } from '@upstash/redis';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 事件存储：
 * - 生产环境（Vercel）：用 @upstash/redis 存到 Redis List `gsti:events`（永久持久化，冷启动不丢）
 * - 本地开发：如果没有配 Redis 环境变量，回落到 .data/events.jsonl 文件
 *
 * 每条事件形如：
 * { ts: 1730000000000, code: "CLPS", personalityId: 1, callsign: "GHOST-K" }
 */

export interface TrackEvent {
  ts: number;
  code: string;
  personalityId: number;
  callsign: string;
}

const REDIS_KEY = 'gsti:events';
const MAX_EVENTS = 100_000; // 超过 10w 自动截断，避免无限增长

// Redis 客户端（懒加载）· 检测是否有 KV 环境变量
let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

// —— 本地文件兜底 —— //
const LOCAL_DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_EVENTS_FILE = path.join(LOCAL_DATA_DIR, 'events.jsonl');

async function ensureLocalFile() {
  try {
    await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
    await fs.access(LOCAL_EVENTS_FILE);
  } catch {
    try {
      await fs.writeFile(LOCAL_EVENTS_FILE, '', 'utf8');
    } catch {
      // ignore
    }
  }
}

export async function appendEvent(ev: TrackEvent) {
  const client = getRedis();
  if (client) {
    try {
      await client.lpush(REDIS_KEY, JSON.stringify(ev));
      // 保险：自动截断超长 list，防止内存爆炸
      await client.ltrim(REDIS_KEY, 0, MAX_EVENTS - 1);
      return;
    } catch (e) {
      console.error('[eventsStore] redis lpush failed, falling back to file:', e);
    }
  }
  // 本地/降级路径
  try {
    await ensureLocalFile();
    await fs.appendFile(LOCAL_EVENTS_FILE, JSON.stringify(ev) + '\n', 'utf8');
  } catch (e) {
    console.error('[eventsStore] file appendEvent failed:', e);
  }
}

export async function readAllEvents(): Promise<TrackEvent[]> {
  const client = getRedis();
  if (client) {
    try {
      // LRANGE 拿全部，最新的在前面（LPUSH 的方向）
      const raw = await client.lrange(REDIS_KEY, 0, -1);
      const events: TrackEvent[] = [];
      for (const item of raw) {
        try {
          // Upstash Redis JS SDK 有时会自动 JSON.parse，所以要判断
          if (typeof item === 'string') {
            events.push(JSON.parse(item) as TrackEvent);
          } else if (item && typeof item === 'object') {
            events.push(item as unknown as TrackEvent);
          }
        } catch {
          // 跳过损坏的条目
        }
      }
      return events;
    } catch (e) {
      console.error('[eventsStore] redis lrange failed, falling back to file:', e);
    }
  }
  // 本地/降级路径
  try {
    await ensureLocalFile();
    const raw = await fs.readFile(LOCAL_EVENTS_FILE, 'utf8');
    if (!raw.trim()) return [];
    return raw
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as TrackEvent;
        } catch {
          return null;
        }
      })
      .filter((v): v is TrackEvent => v !== null);
  } catch (e) {
    console.error('[eventsStore] file readAllEvents failed:', e);
    return [];
  }
}
