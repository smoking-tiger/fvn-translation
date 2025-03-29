import { type HTMLAttributes, useMemo } from 'react';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export default function Tag({ name, className, ...rest }: Props) {
  const n = useMemo(() => clsx(
    'px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border-1 border-slate-50 dark:border-slate-800',
    className,
  ), [className]);
  return (
    <small className={n} {...rest}>{name}</small>
  );
}
