import { useCallback, useMemo } from 'react';
import { Link, useSearchParams, useLoaderData } from 'react-router';
import clsx from 'clsx';

import Button from 'components/Button';
import Popover from 'components/Popover';
import IconPlus from 'components/Icons/Plus';
import IconClose from 'components/Icons/Close';

import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 게임 소개" },
  ];
}

export async function loader() {
  const { loadList } = await import('../../loaders');
  return loadList();
}

export default function GameList() {
  const { list, tags } = useLoaderData<Route.ComponentProps['loaderData']>();
  const [search, setSearchParams] = useSearchParams();

  const tagList = useMemo<string[]>(() => {
    const arr = search.get('tags');
    if (!arr) return [];
    return arr.split(',');
  }, [search]);

  const showExplict = search.has('explict');
  const showHidden = search.has('hidden');

  const unselected = useMemo(() => {
    const arr = [] as string[];
    tags.forEach((tag) => {
      if (tagList.includes(tag)) return;
      arr.push(tag);
    });
    arr.sort();
    return arr;
  }, [tagList, tags]);

  const addTag = useCallback((tag: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      let list = (prev.get('tags') || '').split(',');
      if (!list.includes(tag)) {
        list.push(tag);
      }
      list = list.filter(Boolean);
      next.set('tags', list.join(','));
      return next;
    });
  }, [setSearchParams]);

  const removeTag = useCallback((tag: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      let list = new Set((prev.get('tags') || '').split(','));
      list.delete(tag);
      if (list.size === 0) {
        next.delete('tags');
      } else {
        next.set('tags', Array.from(list).join(','));
      }
      return next;
    });
  }, [setSearchParams]);

  const handleExplict = useCallback(() => setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    if (next.has('explict')) {
      next.delete('explict');
    } else {
      next.set('explict', '1');
    }
    return next;
  }), [setSearchParams]);

  const handleHidden = useCallback(() => setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    if (next.has('hidden')) {
      next.delete('hidden');
    } else {
      next.set('hidden', '1');
    }
    return next;
  }), [setSearchParams]);

  const filteres = useMemo(() => {
    if (showExplict && showHidden) return list;
    return list.filter((item) => {
      if (item.tags.find((tag) => tag.startsWith('성적묘사')) && !showExplict) return item.hidden && !showHidden;
      if (item.hidden && !showHidden) return false;
      return true;
    });
  }, [list, showExplict, showHidden]);

  const listItems = useMemo(() => {
    if (!tagList.length) return filteres;
    return filteres.filter((item) => {
      if (!item.tags.length) return false;
      const itemTags = new Set(item.tags);
      for (let i = 0, len = tagList.length; i < len; i += 1) {
        if (!itemTags.has(tagList[i])) return false;
      }
      return true;
    });
  }, [filteres, tagList]);

  const searchStr = useMemo(() => search.toString(), [search]);

  return (
    <div className="container mx-auto p-2">
      <header className="flex justify-between pt-2 pb-4">
        <div className="flex items-end">
          <h1 className="text-3xl">게임 소개</h1>
          <small className="ml-3 opacity-65">{`(${listItems.length} / ${list.length})`}</small>
        </div>
        <ul className="flex opacity-65 space-x-1">
          <li className="flex items-center">
            <img className="mr-1" width="30" src="/assets/kuma.png" />
            <span>= 공식한글화</span>
          </li>
          <li className="flex items-center">
            <img className="mr-1" width="28" src="/assets/sorry_wip.png" />
            <span>= 유저 한패 작업중</span>
          </li>
        </ul>
      </header>
      <header>
        <div className="flex flex-nowrap whitespace-nowrap items-center pb-2 space-x-2 max-w-full overflow-x-auto">
          {tagList.map((tag) => (
            <Button
              key={tag}
              className="flex items-center border-stone-100 border-1 bg-stone-200 dark:border-stone-800 dark:bg-stone-700"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <IconClose className="w-4 h-4 ml-1" />
            </Button>
          ))}
          {tagList.length < tags.length ? (
            <Popover
              label={(
                <Button className="flex items-center">
                  <IconPlus className="w-4 h-4" />
                  태그 검색
                </Button>
              )}
            >
              <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded" style={{ maxWidth: '565px' }}>
                {unselected.map((tag) => (
                  <Button key={tag} onClick={() => addTag(tag)}>
                    {tag}
                  </Button>
                ))}
              </div>
            </Popover>
          ) : null}
          <Button
            className={useMemo(() => clsx(
              'flex items-center border-1',
              showExplict ? 'bg-amber-100 border-amber-600 dark:bg-amber-900' : 'border-stone-800 dark:border-stone-200',
            ), [showExplict])}
            onClick={handleExplict}
          >
            {showExplict ? '성적 묘사 표시' : '성적 묘사 숨김'}
          </Button>
          <Button
            className={useMemo(() => clsx(
              'flex items-center border-1',
              showHidden ? 'bg-indigo-100 border-indigo-600 dark:bg-indigo-900' : 'border-stone-800 dark:border-stone-200',
            ), [showHidden])}
            onClick={handleHidden}
          >
            {showHidden ? '임시 공개 표시' : '임시 공개 숨김'}
          </Button>
        </div>
      </header>
      <ul className="flex flex-wrap space-x-2 justify-center xl:justify-start">
        {listItems.map((item) => (
          <Link
            key={item.name}
            to={{ pathname: item.name, search: searchStr }}
            className="relative p-2 hover:opacity-65"
          >
            <figure className="relative overflow-hidden w-64 h-64 rounded-xl shadow-xl">
              {item.banner_url?.endsWith('.mp4') ? (
                  <video autoPlay loop muted playsInline className={clsx('min-h-64 w-auto object-cover', item.mode !== 'wip' ? '' : 'opacity-50')}>
                    <source src={item.banner_url} type="video/mp4" />
                  </video>
              ) : (
                <img className={clsx('min-h-64 w-auto object-cover', item.mode !== 'wip' ? '' : 'opacity-50')} src={item.banner_url} alt={item.name} />
              )}
              {item.mode === 'wip' ? <img className="absolute bottom-5 right-2" width="85" src="/assets/sorry_wip.png" alt="작업중" /> : null}
            </figure>
            {item.mode === 'official' ? <img className="absolute -top-0.5 -right-0.5" width="50" src="/assets/kuma.png" alt="공식한글화" /> : null}
            <GameTitle title={item.kr_title} fallback={item.title} />
          </Link>
        ))}
      </ul>
    </div>
  );
}

function GameTitle({ title, fallback }: { title?: string; fallback: string; }) {
  if (!title) return <span className="block pt-1">{fallback}</span>;
  return (
    <span className="block pt-1">
      <span className="block leading-1.5 pt-1">{title}</span>
      <small className="opacity-35">{fallback}</small>
    </span>
  );
}
