import type { Trait } from './personality';

/** 一道题的一个选项 */
export interface QuestionChoice {
  /** 'A' | 'B' | 'C' | 'D' */
  key: 'A' | 'B' | 'C' | 'D';
  /** i18n key 前缀下的子键，用于查文案 */
  label: string;
  /** 该选项映射到哪个倾向 */
  trait: Trait;
}

/** 一道 CASE FILE 题 */
export interface Question {
  /** 1..12 */
  id: number;
  /** 三位补零编号，例 "001" */
  caseNumber: string;
  /** 案发地点（i18n key） */
  location: string;
  /** 时间戳文本 · 直接写死用于装饰 */
  time: string;
  /** i18n key 前缀，实际文案在 zh.json 里的 `questions.q1.title` 等 */
  i18nKey: string;
  choices: QuestionChoice[];
}
