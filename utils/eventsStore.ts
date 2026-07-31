import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 简易文件型事件存储：每条完成上报追加一行 JSON。
 * 无锁 · 无外部依赖 · 部署到 Vercel 时可直接换 KV/Redis。
 *
 * 每条事件形如：
 * { ts: 1730000000000, code: "CLPS", personalityId: 1, callsign: "GHOST-K" }
 */

const DATA_DIR = path.join(process.cwd(), '.data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.jsonl');

export interface TrackEvent {
  ts: number;
  code: string;
  personalityId: number;
  callsign: string;
}

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(EVENTS_FILE);
  } catch {
    await fs.writeFile(EVENTS_FILE, '', 'utf8');
  }
}

export async function appendEvent(ev: TrackEvent) {
  await ensureFile();
  await fs.appendFile(EVENTS_FILE, JSON.stringify(ev) + '\n', 'utf8');
}

export async function readAllEvents(): Promise<TrackEvent[]> {
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
}
