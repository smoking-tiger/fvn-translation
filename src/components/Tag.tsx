import { type HTMLAttributes, useMemo } from 'react';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export default function Tag({ name, className, ...rest }: Props) {
  const n = useMemo(() => clsx(
    'px-2 py-1 rounded-lg border-1',
    className,
    {
      'bg-red-50 dark:bg-red-700 border-red-200 dark:border-red-800': name === '18금',
      'bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-800': name !== '18금'
    },
  ), [className, name]);
  return (
    <small className={n} {...rest}>{name}</small>
  );
}
