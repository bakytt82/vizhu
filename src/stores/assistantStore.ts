'use client';

import { create } from 'zustand';
import type { ChatMessage, Prescription } from '@/types';

interface AssistantState {
  // Chat state
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;

  // User preferences (gathered during conversation)
  userPreferences: {
    faceShape?: string;
    style?: string;
    purpose?: string;
  };

  // Prescription data (from OCR)
  prescription: Prescription | null;

  // Virtual Mirror state
  selectedProductId: string | null;
  isMirrorOpen: boolean;

  // Actions
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setMessages: (msgs: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setUserPreference: (key: string, value: string) => void;
  setPrescription: (rx: Prescription | null) => void;
  setSelectedProductId: (id: string | null) => void;
  setMirrorOpen: (open: boolean) => void;
  clearChat: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: '0',
  role: 'assistant',
  content: 'Здравствуйте! 👋 Я — **OptiCare AI**, ваш экспертный гид в мире стиля и здоровья ваших глаз.\n\nЯ помогу вам:\n• Определить форму вашего лица\n• Подобрать идеальную оправу\n• Объяснить сложные оптические термины\n• Протестировать оправы в нашей **Виртуальной Примерочной**\n\nС чего бы вы хотели начать?',
  timestamp: new Date(),
};

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [INITIAL_MESSAGE],
  isOpen: false,
  isLoading: false,
  userPreferences: {},
  prescription: null,
  selectedProductId: null,
  isMirrorOpen: false,

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateMessage: (id, content) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content } : m
      ),
    })),
  setMessages: (msgs) => set({ messages: msgs }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
  setUserPreference: (key, value) =>
    set((s) => ({ userPreferences: { ...s.userPreferences, [key]: value } })),
  setPrescription: (prescription) => set({ prescription }),
  setSelectedProductId: (selectedProductId) => set({ selectedProductId }),
  setMirrorOpen: (isMirrorOpen) => set({ isMirrorOpen }),
  clearChat: () => set({ messages: [INITIAL_MESSAGE], userPreferences: {}, prescription: null }),
}));
