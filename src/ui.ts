import { startTransition, useCallback } from 'react';
import { create } from 'zustand';

export const IS_SSR = typeof window === 'undefined';
export const THEME_STORAGE_KEY = 'dark';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function getCurrentModeStatus() {
  if (IS_SSR) return false;

  const status = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (status) return status === '1';

  return window.matchMedia?.(COLOR_SCHEME_QUERY).matches || false;
}

interface UIStore {
  theme?: 'dark' | 'light';
}

export const uiStore = create<UIStore>(() => {
  if (IS_SSR) return { theme: undefined };
  const isDark = getCurrentModeStatus();

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.remove('loading');

  return { theme: isDark ? 'dark' : 'light' };
});

export const useUI = uiStore;

export function useThemeMode() {
  return useUI(useCallback((s) => s.theme, []));
}

export function toggleThemeMode() {
  startTransition(() => {
    uiStore.setState((prev) => ({ theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  });
}
