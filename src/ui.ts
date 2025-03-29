import { startTransition, useCallback } from 'react';
import { create } from 'zustand';

export const IS_SSR = typeof window === 'undefined';
export const THEME_STORAGE_KEY = 'dark';
export const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

interface UIStore {
  theme?: 'dark' | 'light';
}

export const uiStore = create<UIStore>(() => ({ theme: undefined }));

export const useUI = uiStore;

export function useThemeMode() {
  return useUI(useCallback((s) => s.theme, []));
}

export function toggleThemeMode() {
  startTransition(() => {
    uiStore.setState((prev) => ({ theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  });
}
