import clsx from 'clsx';

export default function Tag(props: { name: string; class?: string }) {
  const mode = () => {
    if (props.name === '18금') return '19';
    if (props.name === '국산') return 'kor';
    if (props.name === '공식한글화') return 'official';
    if (props.name === '동성애') return 'bara';
    if (props.name.startsWith('성적묘사')) return 'sexual';
    return '';
  };
  return <small class={clsx('px-2 py-1 rounded-lg border', props.class, {
    'bg-red-100 dark:bg-red-700 border-red-500 dark:border-red-800': mode() === '19',
    'bg-amber-100 dark:bg-amber-700 border-amber-500 dark:border-amber-800': mode() === 'sexual',
    'bg-pink-100 dark:bg-pink-700 border-pink-500 dark:border-pink-800': mode() === 'bara',
    'bg-blue-100 dark:bg-blue-700 border-blue-500 dark:border-blue-800': mode() === 'kor',
    'bg-sky-100 dark:bg-sky-700 border-sky-500 dark:border-sky-800': mode() === 'official',
    'bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-800': !mode(),
  })}>{props.name}</small>;
}
