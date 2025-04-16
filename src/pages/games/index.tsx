import { useCallback, useMemo } from 'react';
import { Link, useSearchParams, useLoaderData } from 'react-router';

import Button from 'components/Button';
import Popover from 'components/Popover';
import IconPlus from 'components/Icons/Plus';
import IconClose from 'components/Icons/Close';

import type { Route } from "./+types/index";

import { loadList } from '../../loaders';
import clsx from 'clsx';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 게임 목록" },
  ];
}

export async function loader() {
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
      let list = (prev.get('tags') || '').split(',');
      if (!list.includes(tag)) {
        list.push(tag);
      }
      list = list.filter(Boolean);
      prev.set('tags', list.join(','));
      return prev;
    });
  }, [setSearchParams]);

  const removeTag = useCallback((tag: string) => {
    setSearchParams((prev) => {
      let list = new Set((prev.get('tags') || '').split(','));
      list.delete(tag);
      if (list.size === 0) {
        prev.delete('tags');
      } else {
        prev.set('tags', Array.from(list).join(','));
      }
      return prev;
    });
  }, [setSearchParams]);

  const listItems = useMemo(() => {
    if (!tagList.length) return list;
    return list.filter((item) => {
      if (!item.tags.length) return false;
      const itemTags = new Set(item.tags);
      for (let i = 0, len = tagList.length; i < len; i += 1) {
        if (!itemTags.has(tagList[i])) return false;
      }
      return true;
    });
  }, [list, tagList]);

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl pt-2 pb-4">게임 목록</h1>
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
              <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded">
                {unselected.map((tag) => (
                  <Button key={tag} onClick={() => addTag(tag)}>
                    {tag}
                  </Button>
                ))}
              </div>
            </Popover>
          ) : null}
        </div>
      </header>
      <ul className="flex flex-wrap space-x-2">
        {listItems.map((item) => (
          <Link
            key={item.name}
            to={item.name}
            className="p-2 hover:opacity-65"
            aria-disabled={!item.patched}
          >
            <figure className="relative overflow-hidden w-64 h-64 rounded-xl shadow-xl">
              {item.banner_url?.endsWith('.mp4') ? (
                  <video autoPlay loop muted playsInline className={clsx('min-h-64 w-auto object-cover', item.patched ? '' : 'opacity-50')}>
                    <source src={item.banner_url} type="video/mp4" />
                  </video>
              ) : (
                <img className={clsx('min-h-64 w-auto object-cover', item.patched ? '' : 'opacity-50')} src={item.banner_url} alt={item.name} />
              )}
              {item.patched ? null : <img className="absolute bottom-5 right-2" width="85" src="/fvn-translation/assets/sorry_wip.png" alt="작업중" />}
            </figure>
            <span className="block pt-1">{item.title}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
}
