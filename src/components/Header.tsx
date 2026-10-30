import { useContext } from 'solid-js';
import { Navigation, useSearchParams } from '../navigation';
import Button, { ButtonNav, AnchorButton } from './Button';
import Sun from './Icons/Sun';
import Moon from './Icons/Moon';
import Tooltip from './Tooltip';
import IconLogo from './Icons/Logo';

export default function Header() {
  const [search] = useSearchParams();
  const context = useContext(Navigation);
  return <header class="shadow border-b border-stone-300 bg-stone-200 dark:bg-stone-800 dark:border-stone-700">
    <nav class="container flex justify-between items-center h-14 px-1 mx-auto">
      <AnchorButton class="flex items-center" href="/"><IconLogo class="size-8" width="32" height="32" /></AnchorButton>
      <div class="space-x-2"><ButtonNav class={({ isActive }) => isActive ? 'text-red' : ''} href={`/games${search().size ? `?${search()}` : ''}`}>게임 소개</ButtonNav></div>
      <div class="space-x-2"><Tooltip position="bottom" label={context.dark() ? '라이트 모드로' : '다크 모드로'}>
        <Button aria-label="테마 변경" onClick={context.toggleTheme}>{context.dark() ? <Sun class="size-5" /> : <Moon class="size-5" />}</Button>
      </Tooltip></div>
    </nav>
  </header>;
}
