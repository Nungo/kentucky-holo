import { create } from 'zustand';

export type Mode = 'day' | 'night';

interface AppStore {
  mode: Mode;
  isAutoMode: boolean;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setAutoMode: (auto: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  mode: 'day',
  isAutoMode: true,
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ 
    mode: state.mode === 'day' ? 'night' : 'day',
    isAutoMode: false // Manual toggle disables auto mode
  })),
  setAutoMode: (auto) => set({ isAutoMode: auto }),
}));