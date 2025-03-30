import { useMemo, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import { type LinkProps, type NavLinkProps, Link, NavLink } from 'react-router';
import clsx from 'clsx/lite';

export function getButtonStyle(className?: string) {
  return clsx(
    'cursor-pointer p-2 px-3 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600',
    'disabled:opacity-50 disabled:pointer-events-none disabled:select-none',
    className,
  );
}

export default function Button({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const name = useMemo(() => getButtonStyle(className), [className]);
  return <button className={name} {...rest} />;
}

export function AnchorButton({ className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const name = useMemo(() => getButtonStyle(className), [className]);
  return <a className={name} {...rest} />;
}

export function ButtonLink({ className, ...rest }: LinkProps) {
  const name = useMemo(() => getButtonStyle(className), [className]);
  return <Link className={name} {...rest} />;
}

export function ButtonNav({ className, ...rest }: NavLinkProps) {
  const name = useMemo(() => getButtonStyle(), []);
  return (
    <NavLink
      className={(props) => {
        if (typeof className === 'function') {
          const n = className(props);
          return clsx(name, n);
        } else if (typeof className === 'string') {
          return clsx(name, className);
        }
        return name;
      }}
      {...rest}
    />
  );
}

