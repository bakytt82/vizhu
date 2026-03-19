import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'light' | 'dark';
  isManual: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isManual: false,
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme, isManual: true });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          localStorage.setItem('vizhu-theme-manual', 'true');
        }
      },
      setTheme: (theme) => {
        set({ theme, isManual: true });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
          localStorage.setItem('vizhu-theme-manual', 'true');
        }
      },
      initializeTheme: () => {
        const hour = new Date().getHours();
        const autoTheme = hour >= 7 && hour < 19 ? 'light' : 'dark';
        
        // Only use auto theme if user hasn't manually overridden it
        const isCurrentlyManual = get().isManual || (typeof localStorage !== 'undefined' && localStorage.getItem('vizhu-theme-manual') === 'true');
        
        if (!isCurrentlyManual) {
          set({ theme: autoTheme, isManual: false });
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', autoTheme === 'dark');
          }
        } else {
          // If manual, just ensure the class is applied
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', get().theme === 'dark');
          }
        }
      },
    }),
    { 
      name: 'vizhu-theme',
      onRehydrateStorage: () => (state) => {
        if (state) state.initializeTheme();
      }
    }
  )
);
