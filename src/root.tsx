
import { useLayoutEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router';

import Header from './components/Header';
import { useThemeMode, uiStore, THEME_STORAGE_KEY, COLOR_SCHEME_QUERY, IS_SSR } from './ui';
import type { Route } from "./+types/root";

import './App.css';

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
    crossOrigin: "anonymous",
  },
];

export function HydrateFallback() {
  return (
    <div className="container mx-auto pt-64 flex justify-center">
      <svg className="mr-3 -ml-1 size-8 animate-spin text-white" width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );
}

export function clientLoader() {
  const getCurrentModeStatus = () => {
      const status = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (status) return status === '1';
    
      return window.matchMedia?.(COLOR_SCHEME_QUERY).matches || false;
  };
  const isDark = getCurrentModeStatus();

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.remove('loading');
  uiStore.setState({ theme: isDark ? 'dark' : 'light' });
}

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
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="google-site-verification" content="E5YH5b14azIAJvAy5eudiputbiLvNmGDUktKI4gqT_M" />
        <link rel="icon" type="image/png" href="/window_icon.png" />
        <style type="text/css">{'@media (prefers-color-scheme: dark) {.loading body { background-color:#171819; color:#efefef;}}'}</style>
        <Meta />
        <meta name="robot" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "앗!";
  let details = "에러가 발생했습니다.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "에러";
    details =
      error.status === 404
        ? "해당 페이지가 없는 것 같아요."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <div className="pt-16 p-4 container mx-auto">
      <h1 className="text-4xl">{message}</h1>
      <p>{details}</p>
    </div>
  );
}
