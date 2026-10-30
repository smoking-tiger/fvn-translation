import { omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { NavAnchor, type NavAnchorProps } from '../navigation';
import { twMerge } from 'tailwind-merge';

const base = 'cursor-pointer p-2 px-3 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 disabled:opacity-50 disabled:pointer-events-none disabled:select-none';
export function getButtonStyle(className?: string) { return twMerge(base, className); }
type ButtonProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'class'> & { class?: string };
type AnchorProps = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'class'> & { class?: string };

export default function Button(props: ButtonProps) {
  return <button {...omit(props, 'class')} class={getButtonStyle(props.class)} />;
}
export function AnchorButton(props: AnchorProps) {
  return <a {...omit(props, 'class')} class={getButtonStyle(props.class)} />;
}
export function ButtonNav(props: NavAnchorProps) {
  return <NavAnchor {...omit(props, 'class')} class={(state) => getButtonStyle(typeof props.class === 'function' ? props.class(state) : props.class)} />;
}
