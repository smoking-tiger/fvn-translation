import { Button, Popover, IconPlus, IconClose, Tag } from '../../components';
import { createMemo } from 'solid-js';
import clsx from 'clsx';

import { useSearchParams } from '../../navigation';
import type { GameListData } from '../../content';

export function meta() {
  return [
    { title: "털겜번역단: 게임 소개" },
  ];
}

export default function GameList(props: { data: GameListData }) {
  const list = () => props.data.list;
  const [search, setSearchParams] = useSearchParams();

  const tagList = createMemo<string[]>(() => {
    const arr = search().get('tags');
    if (!arr) return [];
    return arr.split(',');
  });

  const showExplict = () => search().has('explict');
  const showHidden = () => search().has('hidden');

  const addTag = ((tag: string) => {
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
  });

  const removeTag = ((tag: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const list = new Set((prev.get('tags') || '').split(','));
      list.delete(tag);
      if (list.size === 0) {
        next.delete('tags');
      } else {
        next.set('tags', Array.from(list).join(','));
      }
      return next;
    });
  });

  const handleExplict = (() => setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    if (next.has('explict')) {
      next.delete('explict');
    } else {
      next.set('explict', '1');
    }
    return next;
  }));

  const filteres = createMemo(() => {
    if (showExplict() && showHidden()) return list();
    return list().filter((item) => {
      if (item.tags.find((tag) => tag.startsWith('성적묘사')) && !showExplict()) return false;
      if (item.hidden && !showHidden()) return false;
      return true;
    });
  });

  const listItems = createMemo(() => {
    if (!tagList().length) return filteres();
    return filteres().filter((item) => {
      if (!item.tags.length) return false;
      const itemTags = new Set(item.tags);
      for (let i = 0, len = tagList().length; i < len; i += 1) {
        if (!itemTags.has(tagList()[i])) return false;
      }
      return true;
    });
  });

  const availableTags = createMemo(() => {
    const arr: string[] = [];
    listItems().forEach((item) => arr.push(...item.tags));

    const unique = new Set(arr);
    tagList().forEach((tag) => {
      if (unique.has(tag)) unique.delete(tag);
    });
    return Array.from(unique);
  });

  const searchStr = createMemo(() => search().toString());

  return (
    <div class="container mx-auto p-2">
      <header class="flex justify-between pt-2 pb-4">
        <div class="flex items-end">
          <h1 class="text-3xl">게임 소개</h1>
          <small class="ml-3 opacity-65">{`(${listItems().length} / ${list().length})`}</small>
        </div>
        <ul class="flex opacity-65 space-x-1">
          <li class="flex items-center">
            <img class="mr-1" width="30" src="/assets/kuma.png" />
            <span>= 공식한글화</span>
          </li>
          <li class="flex items-center">
            <img class="mr-1" width="28" src="/assets/sorry_wip.png" />
            <span>= 작업중</span>
          </li>
        </ul>
      </header>
      <header>
        <div class="flex flex-nowrap whitespace-nowrap items-center pb-2 space-x-2 max-w-full overflow-x-auto">
          <span>태그 검색:</span>
          <div class="flex items-center space-x-1">
            {tagList().map((tag) => (
              <Button class="flex items-center py-1 px-1 text-left" onClick={() => removeTag(tag)}>
                <Tag name={tag} />
                <IconClose class="ml-0.5 size-3" />
              </Button>
            ))}
          </div>
          {availableTags().length ? (
            <Popover
              label={(
                <IconPlus class="w-4 h-4" />
              )}
            >
              <div class="p-2 bg-stone-100 dark:bg-stone-800 rounded overflow-y-auto max-h-60">
                {availableTags().map((tag) => (
                  <Button class="block w-full text-left" onClick={() => addTag(tag)}>
                    <Tag name={tag} />
                  </Button>
                ))}
              </div>
            </Popover>
          ) : null}
          <Button
            class={clsx(
              'flex items-center border text-sm px-2',
              showExplict() ? 'bg-amber-200 border-amber-600 dark:bg-amber-900' : 'border-stone-800 dark:border-stone-200',
            )}
            onClick={handleExplict}
          >
            {showExplict() ? '성적 묘사 표시 중' : '성적 묘사 제외 중'}
          </Button>
        </div>
      </header>
      <ul class="flex flex-wrap space-x-2 justify-center xl:justify-start">
        {listItems().map((item) => (
          <a
            href={`/games/${item.name}${searchStr() ? `?${searchStr()}` : ""}`}
            class="relative p-2 hover:opacity-65"
          >
            <figure class={clsx('relative overflow-hidden w-64 h-64 rounded-xl shadow-xl', item.nsfw ? 'ring-1 ring-amber-600 dark:ring-amber-500' : '')}>
              {item.banner_url?.endsWith('.mp4') ? (
                  <video autoplay loop muted playsinline class={clsx('min-h-64 w-auto object-cover', item.mode !== 'wip' ? '' : 'opacity-50')}>
                    <source src={item.banner_url} type="video/mp4" />
                  </video>
              ) : (
                <img class={clsx('min-h-64 w-auto object-cover', item.mode !== 'wip' ? '' : 'opacity-50')} src={item.banner_url} alt={item.name} />
              )}
              {item.mode === 'wip' ? <img class="absolute bottom-5 right-2" width="85" src="/assets/sorry_wip.png" alt="작업중" /> : null}
            </figure>
            {item.mode === 'official' ? <img class="absolute -top-0.5 -right-0.5" width="50" src="/assets/kuma.png" alt="공식한글화" /> : null}
            <GameTitle title={item.kr_title} fallback={item.title} />
          </a>
        ))}
      </ul>
    </div>
  );
}

function GameTitle(props: { title?: string; fallback: string }) {
  return <span class="block pt-1">
    {props.title ? <><span class="block leading-1.5 pt-1">{props.title}</span><small class="opacity-35">{props.fallback}</small></> : props.fallback}
  </span>;
}
