import { createContext, useContext, omit, type Accessor } from 'solid-js';
import type { JSX } from '@solidjs/web';

export const Navigation = createContext<{
  url: Accessor<URL>;
  navigate: (url: URL) => void;
  dark: Accessor<boolean>;
  toggleTheme: () => void;
}>();

export function useSearchParams() {
  const context = useContext(Navigation);
  const search = () => context.url().searchParams;
  return [search, (update: (previous: URLSearchParams) => URLSearchParams) => {
    const next = new URL(context.url());
    next.search = update(new URLSearchParams(next.search)).toString();
    context.navigate(next);
  }] as const;
}

export interface ActiveState { isActive: boolean }
export type NavAnchorProps = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'class'> & {
  end?: boolean;
  class?: string | ((state: ActiveState) => string);
};

export function NavAnchor(props: NavAnchorProps) {
  const context = useContext(Navigation);
  const active = () => {
    const path = new URL(String(props.href || '/'), context.url()).pathname.replace(/\/$/, '') || '/';
    const current = context.url().pathname.replace(/\/$/, '') || '/';
    return current === path || (!props.end && current.startsWith(`${path}/`));
  };
  return <a {...omit(props, 'class', 'end')} aria-current={active() ? 'page' : undefined}
    class={typeof props.class === 'function' ? props.class({ isActive: active() }) : props.class} />;
}
