import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 简易文件型事件存储。
 *
 * 目录选择：
 * - 本地开发：写到 项目根/.data/events.jsonl（gitignore）
 * - Serverless（Vercel）：写到 /tmp/gsti-events.jsonl（Lambda 唯一可写位置，冷启动会丢，但至少不崩）
 *
 * 更持久的方案：换 Vercel KV / Upstash Redis，把 appendEvent / readAllEvents 改成 KV 操作。
 *
 * 每条事件形如：
 * { ts: 1730000000000, code: "CLPS", personalityId: 1, callsign: "GHOST-K" }
 */

const IS_SERVERLESS = !!process.env.VERCEL || !!process.env.LAMBDA_TASK_ROOT;

const DATA_DIR = IS_SERVERLESS ? '/tmp' : path.join(process.cwd(), '.data');
const EVENTS_FILE = IS_SERVERLESS
  ? path.join(DATA_DIR, 'gsti-events.jsonl')
  : path.join(DATA_DIR, 'events.jsonl');

export interface TrackEvent {
  ts: number;
  code: string;
  personalityId: number;
  callsign: string;
}

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // /tmp 通常已存在，忽略权限异常
  }
  try {
    await fs.access(EVENTS_FILE);
  } catch {
    try {
      await fs.writeFile(EVENTS_FILE, '', 'utf8');
    } catch {
      // 只读文件系统上写不成也不阻塞查询，返回空事件即可
    }
  }
}

export async function appendEvent(ev: TrackEvent) {
  try {
    await ensureFile();
    await fs.appendFile(EVENTS_FILE, JSON.stringify(ev) + '\n', 'utf8');
  } catch (e) {
    // 记录失败不影响主流程
    console.error('[eventsStore] appendEvent failed:', e);
  }
}

export async function readAllEvents(): Promise<TrackEvent[]> {
  try {
    await ensureFile();
    const raw = await fs.readFile(EVENTS_FILE, 'utf8');
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
    console.error('[eventsStore] readAllEvents failed:', e);
    return [];
  }
}
