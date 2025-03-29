import clsx from 'clsx/lite';

import Button, { ButtonNav, ButtonLink } from './Button';
import Sun from './Icons/Sun';
import Moon from './Icons/Moon';

import { useThemeMode, toggleThemeMode, IS_SSR } from '../ui';
import Tooltip from './Tooltip';

function ToggleMode() {
  const themeMode = useThemeMode();
  const isDark = themeMode === 'dark';
  return (
    <Tooltip position="bottom" label={isDark ? '라이트 모드로' : '다크 모드로'}>
      <Button onClick={() => toggleThemeMode()}>
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>
    </Tooltip>
  );
}

export default function Header() {
  return (
    <header
      className={clsx(
        'shadow border-b',
        'border-slate-300 bg-slate-200 dark:bg-slate-800 dark:border-slate-700',
      )}
    >
      <nav className="container flex justify-between items-center h-14 px-1 mx-auto">
        <ButtonLink to="/">털겜번역단</ButtonLink>
        <div className="space-x-2">
          <ButtonNav className={({ isActive }) => isActive ? 'text-red' : ''} to="/guide">패치 하는 법</ButtonNav>
          <ButtonNav className={({ isActive }) => isActive ? 'text-red' : ''} to="/games">게임 목록</ButtonNav>
        </div>
        <div className="space-x-2">
          <ToggleMode />
        </div>
      </nav>
    </header>
  );
}
