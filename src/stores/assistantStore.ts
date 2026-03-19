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
  selectedProductId: string | null;

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
  clearChat: (initialMessage: ChatMessage) => void;
  initChat: (initialMessage: ChatMessage) => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  userPreferences: {},
  prescription: null,
  selectedProductId: null,

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
  clearChat: (initialMessage) => set({ messages: [initialMessage], userPreferences: {}, prescription: null }),
  initChat: (initialMessage) => set((state) => {
    if (state.messages.length === 0) {
      return { messages: [initialMessage] };
    }
    if (state.messages[0]?.id === '0') {
      return { messages: [initialMessage, ...state.messages.slice(1)] };
    }
    return state;
  }),
}));
