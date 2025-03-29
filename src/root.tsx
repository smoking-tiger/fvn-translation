
import { useLayoutEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router';

import Header from './components/Header';
import { useThemeMode, uiStore, THEME_STORAGE_KEY, COLOR_SCHEME_QUERY, IS_SSR } from './ui';
import type { Route } from "./+types/root";

import './App.css';

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400,600;&display=swap",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/fvn-translation/window_icon.png" />
        <style type="text/css">{'@media (prefers-color-scheme: dark) {.loading body { background-color:#171819; color:#efefef;}}'}</style>
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack ? (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      ) : null}
    </main>
  );
}
