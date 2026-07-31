'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Answers } from '@/utils/scoring';

interface TestState {
  answers: Answers;
  currentIndex: number; // 0-based, 0..11
  isCompleted: boolean;
  /** 已从 localStorage 完成 rehydrate。在此之前不要基于 answers 做任何判断/重定向。 */
  hasHydrated: boolean;
  setAnswer: (questionId: number, choice: 'A' | 'B' | 'C' | 'D') => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  complete: () => void;
  reset: () => void;
  _setHasHydrated: (v: boolean) => void;
}

const TOTAL = 12;

export const useTestStore = create<TestState>()(
  persist(
    (set) => ({
      answers: {},
      currentIndex: 0,
      isCompleted: false,
      hasHydrated: false,
      setAnswer: (questionId, choice) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: choice } })),
      next: () =>
        set((s) => ({
          currentIndex: Math.min(s.currentIndex + 1, TOTAL - 1),
        })),
      prev: () =>
        set((s) => ({
          currentIndex: Math.max(s.currentIndex - 1, 0),
        })),
      goTo: (index) =>
        set(() => ({
          currentIndex: Math.max(0, Math.min(TOTAL - 1, index)),
        })),
      complete: () => set(() => ({ isCompleted: true })),
      reset: () =>
        set(() => ({ answers: {}, currentIndex: 0, isCompleted: false })),
      _setHasHydrated: (v) => set(() => ({ hasHydrated: v })),
    }),
    {
      name: 'gsti-test-state',
      storage: createJSONStorage(() => localStorage),
      // 只持久化数据字段，避免把 hasHydrated 也写进去导致永远 true
      partialize: (state) => ({
        answers: state.answers,
        currentIndex: state.currentIndex,
        isCompleted: state.isCompleted,
      }),
      onRehydrateStorage: () => (state) => {
        // rehydrate 结束（无论有无数据）都标记为 true
        state?._setHasHydrated(true);
      },
    },
  ),
);
