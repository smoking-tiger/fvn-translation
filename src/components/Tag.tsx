import { type HTMLAttributes, useMemo } from 'react';
import clsx from 'clsx';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export default function Tag({ name, className, ...rest }: Props) {
  const n = useMemo(() => {
    let mode = getMode(name);
    return clsx(
      'px-2 py-1 rounded-lg border-1',
      className,
      {
        'bg-red-100 dark:bg-red-700 border-red-500 dark:border-red-800': mode === '19',
        'bg-amber-100 dark:bg-amber-700 border-amber-500 dark:border-amber-800': mode === 'sexual',
        'bg-blue-100 dark:bg-blue-700 border-blue-500 dark:border-blue-800': mode === 'kor',
        'bg-sky-100 dark:bg-sky-700 border-sky-500 dark:border-sky-800': mode === 'official',
        'bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-800': !mode,
      },
    )
  }, [className, name]);
  return (
    <small className={n} {...rest}>{name}</small>
  );
}

function getMode(name: string) {
  if (name === '18금') return '19';
  if (name === '국산') return 'kor';
  if (name === '공식한글화') return 'official';
  if (name.startsWith('성적묘사')) return 'sexual';
  return null;
}
