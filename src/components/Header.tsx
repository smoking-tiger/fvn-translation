import clsx from 'clsx/lite';
import { useSearchParams } from 'react-router';

import Button, { ButtonNav, ButtonLink } from './Button';
import Sun from './Icons/Sun';
import Moon from './Icons/Moon';

import { useThemeMode, toggleThemeMode } from '../ui';
import Tooltip from './Tooltip';
import IconLogo from './Icons/Logo';

function ToggleMode() {
  const themeMode = useThemeMode();
  const isDark = themeMode === 'dark';
  return (
    <Tooltip position="bottom" label={isDark ? '라이트 모드로' : '다크 모드로'}>
      <Button onClick={() => toggleThemeMode()}>
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
    </Tooltip>
  );
}

export default function Header() {
  const [search] = useSearchParams();
  return (
    <header
      className={clsx(
        'shadow border-b',
        'border-stone-300 bg-stone-200 dark:bg-stone-800 dark:border-stone-700',
      )}
    >
      <nav className="container flex justify-between items-center h-14 px-1 mx-auto">
        <ButtonLink className="flex items-center" to="/">
          <IconLogo className="size-8" width="32" height="32" />
        </ButtonLink>
        <div className="space-x-2">
          <ButtonNav className={({ isActive }) => isActive ? 'text-red' : ''} to="/guide">패치 하는 법</ButtonNav>
          <ButtonNav
            className={({ isActive }) => isActive ? 'text-red' : ''}
            to={{ pathname: '/games', search: search.toString() }}
          >
            게임 목록
          </ButtonNav>
        </div>
        <div className="space-x-2">
          <ToggleMode />
        </div>
      </nav>
    </header>
  );
}
