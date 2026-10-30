import clsx from 'clsx';
import { NavAnchor } from '../navigation';
import type { GuideData } from '../content';

export default function GuidePage(props: { data: GuideData }) {
  return (
    <div class="container mx-auto pt-4">
      <h1 class="text-3xl pb-4">패치 하는 법</h1>
      <nav class="mx-auto inline-flex space-x-1 rounded-4xl p-1 dark:bg-stone-800 bg-stone-300 mb-4">
        {props.data.navigation.map(({ path, label }) => (
          <NavAnchor href={path} end class={({ isActive }) => clsx(
            'px-5 py-2 hover:opacity-65 rounded-4xl cursor-pointer',
            isActive && 'bg-stone-100 dark:bg-stone-600',
          )}>{label}</NavAnchor>
        ))}
      </nav>
      <div class="prose dark:prose-invert w-full p-2" innerHTML={props.data.html} />
    </div>
  );
}
