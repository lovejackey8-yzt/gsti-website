/**
 * GSTI 4 维 × 2 倾向 = 16 型算法核心类型
 * 底稿定死，禁止改动维度定义。
 */

/** 8 个倾向标签，每个选项映射到其中一个 */
export type Trait =
  | 'impulse' // 冲动 I  (行动风格)
  | 'calculated' // 计划 C  (行动风格)
  | 'lone' // 独行 L  (社交风格)
  | 'pack' // 兄弟 P  (社交风格)
  | 'rogue' // 叛逆 R  (道德罗盘)
  | 'principled' // 原则 P* (道德罗盘 · 注意与社交 P 区分)
  | 'highrisk' // 赌徒 H  (风险偏好)
  | 'safe'; // 稳线 S  (风险偏好)

/** 4 位人格编码，例：ILRH / CPPS */
export type PersonalityCode = string; // 严格来说是 4 字母模板字面量，运行期用 string 便于查表

/** 4 个维度 */
export type DimensionKey = 'action' | 'social' | 'moral' | 'risk';

export interface DimensionScore {
  key: DimensionKey;
  /** 该维度倾向 A 的累计分 */
  aScore: number;
  /** 该维度倾向 B 的累计分 */
  bScore: number;
  /** 计算后的最终倾向字母（编码中的那一位） */
  winner: string;
}

/** 每维度倾向 → 编码字母 */
export const TRAIT_LETTER: Record<Trait, string> = {
  impulse: 'I',
  calculated: 'C',
  lone: 'L',
  pack: 'P', // 社交 P
  rogue: 'R',
  principled: 'P', // 道德 P（与社交 P 同字母，但归属不同维度不会冲突）
  highrisk: 'H',
  safe: 'S',
};

/** 每维度的两个倾向对（用于计算 winner） */
export const DIMENSION_TRAITS: Record<DimensionKey, [Trait, Trait]> = {
  action: ['impulse', 'calculated'],
  social: ['lone', 'pack'],
  moral: ['rogue', 'principled'],
  risk: ['highrisk', 'safe'],
};
