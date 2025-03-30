import { type HTMLAttributes, useMemo } from 'react';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export default function Tag({ name, className, ...rest }: Props) {
  const n = useMemo(() => clsx(
    'px-2 py-1 rounded-lg bg-stone-50 dark:bg-stone-700 border-1 border-stone-200 dark:border-stone-800',
    className,
  ), [className]);
  return (
    <small className={n} {...rest}>{name}</small>
  );
}
