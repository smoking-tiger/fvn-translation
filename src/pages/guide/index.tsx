import { useCallback, useMemo } from 'react';
import { Outlet, NavLink, type NavLinkRenderProps } from 'react-router';
import clsx from 'clsx';

import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 패치 하는 법" },
  ];
}

interface TabProps {
  name: string;
  to: string;
}

function Tab({ name, to }: TabProps) {
  const className = useCallback(({ isActive }: NavLinkRenderProps) => clsx(
    'px-5 py-2 hover:opacity-65 rounded-4xl cursor-pointer',
    isActive ? 'bg-stone-100 dark:bg-stone-600' : '',
  ), [to]);

  return <NavLink className={className} to={to} end>{name}</NavLink>
}

export default function GuidePage() {
  return (
    <div className="container mx-auto pt-4">
      <h1 className="text-3xl pb-4">패치 하는 법</h1>
      <div className="mx-auto inline-flex space-x-1 rounded-4xl p-1 dark:bg-stone-800 bg-stone-300 mb-4">
        <Tab name="PC" to="." />
        <Tab name="MacOS" to="macos" />
        <Tab name="안드로이드" to="android" />
        <Tab name="iOS" to="ios" />
      </div>
      <Outlet />
    </div>
  );
}
