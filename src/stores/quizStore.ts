import { create } from 'zustand';
import { QuizAnswers } from '@/types';

interface QuizStore {
  currentStep: number;
  answers: QuizAnswers;
  setAnswer: (key: keyof QuizAnswers, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipStep: () => void;
  reset: () => void;
  isComplete: () => boolean;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentStep: 1,
  answers: {},

  setAnswer: (key, value) => {
    set({ answers: { ...get().answers, [key]: value } });
  },

  nextStep: () => {
    const step = get().currentStep;
    if (step < 6) set({ currentStep: step + 1 });
  },

  prevStep: () => {
    const step = get().currentStep;
    if (step > 1) set({ currentStep: step - 1 });
  },

  skipStep: () => {
    const step = get().currentStep;
    if (step < 6) set({ currentStep: step + 1 });
  },

  reset: () => set({ currentStep: 1, answers: {} }),

  isComplete: () => get().currentStep >= 6,
}));
