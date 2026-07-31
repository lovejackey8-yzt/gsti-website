import type { Question } from '@/types/question';
import type { Trait, PersonalityCode } from '@/types/personality';
import { DIMENSION_TRAITS, TRAIT_LETTER } from '@/types/personality';
import questionsData from '@/data/questions.json';
import personalitiesData from '@/data/personalities.json';
import type { Personality } from '@/types/personality-record';

const questions = questionsData as Question[];
const personalities = personalitiesData as Personality[];

/** 用户回答：题目 id -> 选项 key */
export type Answers = Record<number, 'A' | 'B' | 'C' | 'D'>;

/** 每维度分数分布 */
export interface DimensionBreakdown {
  action: { impulse: number; calculated: number };
  social: { lone: number; pack: number };
  moral: { rogue: number; principled: number };
  risk: { highrisk: number; safe: number };
}

/**
 * 计分：把回答映射到 8 个倾向的累计分。
 * 后半程题（id > 6）权重稍高，用于 tiebreaker。
 */
export function scoreAnswers(answers: Answers): DimensionBreakdown {
  const tally: Record<Trait, number> = {
    impulse: 0,
    calculated: 0,
    lone: 0,
    pack: 0,
    rogue: 0,
    principled: 0,
    highrisk: 0,
    safe: 0,
  };

  for (const q of questions) {
    const pickedKey = answers[q.id];
    if (!pickedKey) continue;
    const choice = q.choices.find((c) => c.key === pickedKey);
    if (!choice) continue;
    const weight = q.id > 6 ? 1.1 : 1;
    tally[choice.trait] += weight;
  }

  return {
    action: { impulse: tally.impulse, calculated: tally.calculated },
    social: { lone: tally.lone, pack: tally.pack },
    moral: { rogue: tally.rogue, principled: tally.principled },
    risk: { highrisk: tally.highrisk, safe: tally.safe },
  };
}

/** 由每维度取胜方拼出 4 字母编码 */
export function computeCode(breakdown: DimensionBreakdown): PersonalityCode {
  const pick = (a: Trait, b: Trait, aScore: number, bScore: number): Trait => {
    if (aScore === bScore) {
      // tiebreaker: 冲动 / 独行 / 叛逆 / 赌徒 更"戏剧化"，平局倾向 A（更贴合 GTA 世界观）
      return a;
    }
    return aScore > bScore ? a : b;
  };

  const winners: Trait[] = [
    pick('impulse', 'calculated', breakdown.action.impulse, breakdown.action.calculated),
    pick('lone', 'pack', breakdown.social.lone, breakdown.social.pack),
    pick('rogue', 'principled', breakdown.moral.rogue, breakdown.moral.principled),
    pick('highrisk', 'safe', breakdown.risk.highrisk, breakdown.risk.safe),
  ];

  return winners.map((t) => TRAIT_LETTER[t]).join('');
}

/** 编码 → 16 型档案；找不到时兜底为第一个（不应发生） */
export function findPersonalityByCode(code: PersonalityCode): Personality {
  const found = personalities.find((p) => p.code === code);
  return found ?? personalities[0];
}

/** 计算维度百分比（0-100） */
export function toPercent(breakdown: DimensionBreakdown) {
  const pair = (a: number, b: number) => {
    const total = a + b || 1;
    return { a: Math.round((a / total) * 100), b: Math.round((b / total) * 100) };
  };
  return {
    action: pair(breakdown.action.impulse, breakdown.action.calculated),
    social: pair(breakdown.social.lone, breakdown.social.pack),
    moral: pair(breakdown.moral.rogue, breakdown.moral.principled),
    risk: pair(breakdown.risk.highrisk, breakdown.risk.safe),
  };
}

/** 从答案到最终 Personality 一站式 */
export function resolvePersonality(answers: Answers): {
  personality: Personality;
  breakdown: DimensionBreakdown;
  percent: ReturnType<typeof toPercent>;
  code: PersonalityCode;
} {
  const breakdown = scoreAnswers(answers);
  const code = computeCode(breakdown);
  const personality = findPersonalityByCode(code);
  const percent = toPercent(breakdown);
  return { personality, breakdown, percent, code };
}
