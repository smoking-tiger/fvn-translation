import { Button, AnchorButton, IconExternalLink, ChevronLeft, IconAlert, IconMegaphone, Member, Tag, IconItchIO, IconPatreon, IconDownload, IconSteam, Tooltip } from '../../components';
import { useSearchParams } from '../../navigation';
import type { GameData } from '../../content';
import clsx from 'clsx';

function getStaticImagePath(path?: string, fallback?: string) {
  if (path?.endsWith('.mp4') || path?.endsWith('.webm')) {
    return `https://kemovn.cc${fallback || '/assets/fallback_logo.png'}`
  }
  return `https://kemovn.cc${path || '/assets/fallback_logo.png'}`
}

export function meta({ data }: { data: GameData }) {
  if (!data) return [];
  const desc = data.desc.replaceAll('  ', ' ').split('\n').map((txt) => txt.trim()).join(' ').trim();
  let title = '';
  if (data.kr_title) {
    title = `${data.kr_title} (${data.title})`;
  } else {
    title = data.title;
  }
  return [
    { title: `털겜번역단: ${title}` },
    {
      name: 'keywords',
      content: [
        '퍼리', '수인', '케모노', '수연시', '털겜', '털연시', '한글', '한국어', '한글화', '한패', '한국어 패치', '한글패치', '한글 패치',
        data.title.trim(), data.kr_title?.trim(), ...(data.tags || []),
      ].filter(Boolean).join(',')
    },
    { name: 'description', content: desc },
    { name: 'og:title', content: `털겜번역단: ${title}` },
    { name: 'og:description', content: desc },
    { name: 'twitter:title', content: `털겜번역단: ${title}` },
    { name: 'twitter:site', content: '털겜번역단' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'og:image', content: getStaticImagePath(data.banner_url, data.logo_url) },
    { name: 'twitter:image', content: getStaticImagePath(data.banner_url, data.logo_url) },
  ].filter(Boolean);
}

export default function GameInfo(props: { data: GameData }) {
  const info = () => props.data;
  const [search] = useSearchParams();
  const urlsafeTitle = () => encodeURIComponent(info().title);
  return (
    <div class="pb-12">
      <section class="relative w-full bg-stone-200 dark:bg-stone-700">
        <div class="relative container h-128 mx-auto shadow-lg">
          {info().banner_url?.endsWith('.mp4') ? (
            <div class="absolute top-0 left-0 right-0 bottom-0 overflow-y-hidden">
              <video autoplay muted loop playsinline class="object-cover object-center w-full min-h-128">
                <source src={info().banner_url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <figure
              class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
            >
              <img class="object-cover object-center w-full min-h-128" src={info().banner_url} loading="lazy" alt={info().title} />
            </figure>
          )}
          <div class="absolute top-0 container mx-auto">
            <a class="inline-flex items-center p-1 text-stone-200 hover:underline" href={`/games${search().size ? `?${search()}` : ''}`}>
              <ChevronLeft class="size-4 mr-1" />
              뒤로
            </a>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-white dark:from-black to-transparent pb-2" style={{ 'z-index': '1' }}>
          <div class="relative container flex p-2 pt-6 mx-auto items-center">
            {info().logo_url ? (
              <img class="w-auto h-11 rounded mr-2 max-[385px]:hidden" src={info().logo_url} alt={info().title} />
            ) : null}
            <GameTitle title={info().kr_title} fallback={info().title} />
          </div>
        </div>
        {info().patch_url ? null : (
          <div class="relative container mx-auto" style={{ 'z-index': '0' }}>
            <img class="absolute bottom-1 right-2" width="85" src="/assets/sorry_wip.png" alt="작업중" />
          </div>
        )}
      </section>
      <section class="container mx-auto">
        <div class="flex justify-between p-2 bg-slate-300 dark:bg-slate-700 rounded-b-md mb-4">
          <div class="flex space-x-2 items-center">
            <span class="pl-2">게임:</span>
            {info().url?.includes('itch.io') ? (
              <Tooltip label="Itch.io" position="top">
                <AnchorButton class="inline-flex items-center" href={info().url} target="_blank">
                  <IconItchIO class="size-4" />
                </AnchorButton>
              </Tooltip>
            ) : null}
            {info().url?.includes('store.steampowered.com') ? (
              <Tooltip label="스팀" position="top">
                <AnchorButton class="inline-flex items-center" href={info().url} target="_blank">
                  <IconSteam class="size-4 not-dark:text-white" />
                </AnchorButton>
              </Tooltip>
            ) : null}
            {info().patreon_url ? (
              <Tooltip label="패트리온" position="top">
                <AnchorButton class="inline-flex items-center" href={info().url} target="_blank">
                  <IconPatreon class="size-4" />
                </AnchorButton>
              </Tooltip>
            ) : null}
            <hr class="w-px self-stretch opacity-25" />
            {info().patch_url && info().patch_url !== 'official' ? (
              <AnchorButton class="flex items-center" href={info().patch_url} target="_blank">
                한패받기
                <IconDownload class="size-4 ml-2" />
              </AnchorButton>
            ) : null}
            {info().patch_url ? null : <Button disabled>작업중</Button>}
          </div>
          <div class="flex space-x-2 items-center">
            <Tooltip label="문의/제보하기">
              <AnchorButton
                class="flex items-center"
                href={`https://docs.google.com/forms/d/e/1FAIpQLSdrx0Az_HQs9sEdMoG73o2ubOdZKEtf1ymtcBkv5oRC3T9dMA/viewform?usp=pp_url&entry.2118121111=${urlsafeTitle()}`}
                target="_blank"
              >
                <IconMegaphone class="w-4 h-4" />
              </AnchorButton>
            </Tooltip>
          </div>
        </div>
        <div class="flex items-center flex-wrap p-2 pb-4 space-x-1">
          {info().tags.map((tag) => <Tag name={tag} />)}
        </div>
        {info().status ? (
          <div class="my-2 p-2">
            <div class="inline-block">
              <h3
                class={clsx(
                  'flex items-center font-semibold text-xl p-4 pb-3 rounded-t-lg shadow bg-slate-300 dark:bg-slate-800',
                )}
              >
                <IconAlert class="size-6 mr-2" />
                {info().status}
              </h3>
              {info().status_note ? (
                <div class="rounded-b-lg opacity-85 whitespace-pre-wrap p-4 pt-3 bg-slate-200 dark:bg-slate-700 [&_a]:underline">
                  <div innerHTML={info().status_note} />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        <div class="p-2 pb-4 min-w-full prose dark:prose-invert">
          <div innerHTML={info().desc} />
        </div>
        {info().tutorial ? (
          <div class="p-2 pb-4">
            <h3 class="text-xl font-semibold pb-2">설치 방법</h3>
            <div class="bg-stone-100 dark:bg-stone-800 dark:text-stone-200 py-2 px-4 rounded prose dark:prose-invert">
              <div innerHTML={info().tutorial} />
            </div>
          </div>
        ) : null}
        {info().members?.length ? (
          <div class="p-2 pb-4">
            <h3 class="text-xl font-semibold pb-2">번역에 참여주해주신 분들</h3>
            <div class="flex items-center pr-2 space-x-1 flex-wrap">
              {info().members.map(({ name, ...rest }) => <Member name={name} data={rest} />)}
            </div>
          </div>
        ) : null}
        {info().changelog ? (
          <div class="p-2 pb-4">
            <h3 class="text-xl font-semibold pb-2">패치노트</h3>
            <div class="bg-stone-100 overflow-y-auto dark:bg-stone-800 dark:text-stone-200 py-2 px-4 rounded prose dark:prose-invert" style={{ 'max-height': '500px' }}>
              <div innerHTML={info().changelog} />
            </div>
          </div>
        ) : null}
        {info().license?.length ? (
          <div class="p-2 pb-4">
            <h3 class="text-xl font-semibold pb-2">라이센스</h3>
            <ul class="list-disc pl-6">
              {info().license?.map(({ name, url }) => (
                <li>
                  {url ? (
                    <a class="inline-flex items-center hover:underline" href={url} target="_blank">
                      {name}
                      <IconExternalLink class="w-3 h-3 ml-1" />
                    </a>
                  ) : (
                    <span>{name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function GameTitle(props: { title?: string; fallback: string }) {
  return <h1 class="flex text-black dark:text-white flex-col md:items-end md:flex-row">
    <span class="text-5xl">{props.title || props.fallback}</span>
    {props.title ? <small class="pl-2 opacity-35 text-2xl">{props.fallback}</small> : null}
  </h1>;
}
