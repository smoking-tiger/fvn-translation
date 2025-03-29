import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';

import Button from 'components/Button';
import Popover from 'components/Popover';
import IconPlus from 'components/Icons/Plus';
import IconClose from 'components/Icons/Close';

import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 게임 목록" },
  ];
}


interface ListItem extends Pick<GameInfoType, 'title' | 'banner_url' | 'logo_url' | 'tags'> {
  name: string;
}

export async function loader() {
  const { resolve } = await import('node:path');
  const { load } = await import('js-yaml');
  const cwd = resolve(import.meta.dirname, import.meta.env.DEV ? '../../../games' : '../../games');
  const glob = new Bun.Glob('*.yaml');

  const tags = new Set<string>();
  const list = [] as ListItem[];

  for await (const filename of glob.scanSync({ cwd })) {
    const f = Bun.file(resolve(cwd, filename));
    const txt = await f.text();
    const conf = load(txt) as GameInfoType;
    list.push({
      name: filename.substring(0, filename.length - 5),
      title: conf.title,
      banner_url: conf.banner_url,
      logo_url: conf.logo_url,
      tags: conf.tags,
    });
    conf.tags.forEach((tag) => tags.add(tag));
  }
  return { list, tags } as { list: ListItem[]; tags: Set<string>; };
}

export default function GameList({ loaderData: { list, tags } }: Route.ComponentProps) {
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
        <div className="flex items-center pb-2 space-x-2">
          {tagList.map((tag) => (
            <Button
              key={tag}
              className="flex items-center border-slate-100 border-1 bg-slate-200 dark:border-slate-800 dark:bg-slate-700"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <IconClose className="w-4 h-4 ml-1" />
            </Button>
          ))}
          {tagList.length < tags.size ? (
            <Popover
              label={(
                <Button className="flex items-center">
                  <IconPlus className="w-4 h-4" />
                  태그 검색
                </Button>
              )}
            >
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
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
          <Link key={item.name} to={item.name} className="p-2 hover:opacity-65">
            {item.banner_url?.endsWith('.mp4') ? (
              <figure className="relative overflow-hidden w-64 h-64 rounded-xl shadow-xl">
                <video autoPlay loop muted className="min-h-64 w-auto object-cover">
                  <source src={item.banner_url} type="video/mp4" />
                </video>
              </figure>
            ) : (
              <figure className="bg-cover bg-center w-64 h-64 rounded-xl shadow-xl" style={{ backgroundImage: `url(${item.banner_url})` }} />
            )}
            <span className="block pt-1">{item.title}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
}
