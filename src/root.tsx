
import { useLayoutEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import Header from './components/Header';
import { useThemeMode, uiStore, THEME_STORAGE_KEY, IS_SSR } from './ui';

import './App.css';

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useThemeMode();

  useLayoutEffect(() => {
    if (IS_SSR) return;
    uiStore.subscribe((next, prev) => {
      if (prev.theme !== next.theme) {
        const toDarkMode = next.theme === 'dark';
        window.localStorage.setItem(THEME_STORAGE_KEY, toDarkMode ? '1' : '0');
        document.documentElement.classList.toggle('dark', toDarkMode);
      }
    });
  }, []);

  return (
    <html lang="ko" className={theme || 'loading'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/fvn-translation/window_icon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
