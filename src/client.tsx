import { createSignal, createEffect, flush, onSettled, type Component } from 'solid-js';
import { hydrate, Dynamic } from '@solidjs/web';
import App from './root';
import { Navigation } from './navigation';

export type Meta = { title: string } | { name: string; content: string };
export interface Page { path: string; component: Component<{ data: unknown }>; data: unknown; meta: Meta[] }
declare const BUILD_REVISION: string;
let started = false;
let current: Page;
let updateView: (page: Page, url: URL) => void;
let sequence = 0;
let historyKey = '';
const positions = new Map<string, [number, number]>();
const normalize = (path: string) => path.replace(/\/+$/, '') || '/';

export function PageView(props: { page: Page; url: URL }) {
  const [page, setPage] = createSignal<Page>(() => props.page);
  const [url, setUrl] = createSignal<URL>(() => props.url);
  const [dark, setDark] = createSignal(false);
  const [themeReady, setThemeReady] = createSignal(false);
  if (typeof document !== 'undefined') updateView = (next, location) => { setPage(next); setUrl(location); };
  onSettled(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem('dark'); } catch {}
    setDark(stored === null ? matchMedia('(prefers-color-scheme: dark)').matches : stored === '1');
    setUrl(new URL(location.href));
    setThemeReady(true);
  });
  createEffect(() => themeReady() ? dark() : null, (value) => {
    if (value === null) return;
    document.documentElement.classList.toggle('dark', value);
    try { localStorage.setItem('dark', value ? '1' : '0'); } catch {}
  });
  return <Navigation value={{ url, navigate: (next) => { void navigate(next); }, dark, toggleTheme: () => setDark((value) => !value) }}>
    <App><Dynamic component={page().component} data={page().data} /></App>
  </Navigation>;
}

function updateMeta(page: Page) {
  document.head.querySelectorAll('[data-page-meta]').forEach((node) => node.remove());
  for (const item of page.meta) {
    if ('title' in item) { document.title = item.title; continue; }
    const meta = document.createElement('meta');
    meta.dataset.pageMeta = '';
    meta.setAttribute(item.name.startsWith('og:') ? 'property' : 'name', item.name);
    meta.content = item.content;
    document.head.append(meta);
  }
}

async function navigate(url: URL, pop = false) {
  const request = ++sequence;
  positions.set(historyKey, [scrollX, scrollY]);
  try {
    const previous = current.path;
    const path = normalize(url.pathname);
    const page: Page = path === current.path ? current : (await import(`${path === '/' ? '' : path}/page.${BUILD_REVISION}.js`)).page;
    if (request !== sequence) return;
    if (pop) historyKey = history.state?.key || crypto.randomUUID();
    else { historyKey = crypto.randomUUID(); history.pushState({ key: historyKey }, '', url); }
    current = page;
    updateMeta(page);
    updateView(page, url);
    flush();
    const position = pop ? positions.get(historyKey) : undefined;
    if (position) scrollTo(...position);
    else if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView();
    else if (pop || path !== previous) scrollTo(0, 0);
  } catch (error) {
    console.error(error);
    if (request === sequence) location.assign(url.href);
  }
}

export function boot(page: Page) {
  if (typeof document === 'undefined' || started) return;
  started = true;
  current = page;
  historyKey = crypto.randomUUID();
  history.replaceState({ key: historyKey }, '');
  history.scrollRestoration = 'manual';
  hydrate(() => <PageView page={page} url={new URL(page.path, location.origin)} />, document.getElementById('app')!);
  window.addEventListener('popstate', () => { void navigate(new URL(location.href), true); });
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest('a') : null;
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self') || anchor.relList.contains('external')) return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || url.pathname.split('/').at(-1)?.includes('.')) return;
    event.preventDefault();
    void navigate(url);
  });
}
