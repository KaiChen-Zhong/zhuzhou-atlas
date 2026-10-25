import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chapters } from "./curriculum";

type ProgressState = {
  completed: Record<string, boolean>;
  quiz: Record<string, boolean>;
  labs: Record<string, boolean>;
  exam: Record<string, number>;
  lastSlug: string | null;
  markChapter: (id: string) => void;
  markQuiz: (id: string, correct: boolean) => void;
  markLab: (id: string) => void;
  markExam: (id: string, choice: number) => void;
  setLast: (slug: string) => void;
  reset: () => void;
};

const empty = {
  completed: {} as Record<string, boolean>,
  quiz: {} as Record<string, boolean>,
  labs: {} as Record<string, boolean>,
  exam: {} as Record<string, number>,
  lastSlug: null as string | null,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...empty,
      markChapter: (id) =>
        set((s) => ({ completed: { ...s.completed, [id]: true } })),
      markQuiz: (id, correct) =>
        set((s) => ({ quiz: { ...s.quiz, [id]: correct } })),
      markLab: (id) => set((s) => ({ labs: { ...s.labs, [id]: true } })),
      markExam: (id, choice) =>
        set((s) => ({ exam: { ...s.exam, [id]: choice } })),
      setLast: (slug) => set({ lastSlug: slug }),
      reset: () => set({ ...empty }),
    }),
    { name: "zhuzhou-atlas-progress" },
  ),
);

export function useHydrated() {
  return useProgress.persist?.hasHydrated?.() ?? true;
}

export function chapterProgress(completed: Record<string, boolean>) {
  const done = chapters.filter((c) => completed[c.id]).length;
  return { done, total: chapters.length, ratio: done / chapters.length };
}
