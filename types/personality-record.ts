import type { PersonalityCode } from './personality';

export interface PersonalityStats {
  /** 冲动 0-100 */
  impulse: number;
  /** 独行 0-100 */
  lone: number;
  /** 叛逆 0-100 */
  rogue: number;
  /** 赌徒 0-100 */
  highrisk: number;
}

export interface Personality {
  /** 编号 1-16 */
  id: number;
  /** 4 字母编码，例 CLPS */
  code: PersonalityCode;
  /** 英文档案代号，例 GHOST-K */
  callsign: string;
  /** 俄文原代号，例 Крёстный отец */
  ruCode: string;
  /** i18n key 前缀 → `personalities.p1.name` 等 */
  i18nKey: string;
  /** 档案编号（结果卡显示） */
  fileNo: string;
  /** 威胁等级 1-5 */
  threatLevel: number;
  /** 影响力评级 S / A / B / C */
  influence: 'S' | 'A' | 'B' | 'C';
  /** 底稿给出的四维数值 */
  stats: PersonalityStats;
  /** 主色调 · 用于结果卡渐变 */
  accentColor: 'pink' | 'purple' | 'cyan' | 'yellow';
}
