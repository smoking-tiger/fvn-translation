import { Link, useLoaderData } from 'react-router';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';

import Button, { AnchorButton } from 'components/Button';
import IconExternalLink from 'components/Icons/ExternalLink';
import ChevronLeft from 'components/Icons/ChevronLeft';
import IconAlert from 'components/Icons/Alert';
import IconMegaphone from 'components/Icons/Megaphone';
import Member from 'components/Member';
import Tag from 'components/Tag';
import IconItchIO from 'components/Icons/ItchIO';
import IconPatreon from 'components/Icons/Patreon';
import IconDownload from 'components/Icons/Download';
import IconSteam from 'components/Icons/Steam';
import Tooltip from 'components/Tooltip';

import type { Route } from './+types/[name]';
import { useMemo } from 'react';

export async function loader({ params }: Route.LoaderArgs) {
  const { loadGame } = await import('../../loaders');
  return loadGame(params.name);
}

function getStaticImagePath(path?: string, fallback?: string) {
  if (path?.endsWith('.mp4') || path?.endsWith('.webm')) {
    return `https://kemovn.cc${fallback || '/assets/fallback_logo.png'}`
  }
  return `https://kemovn.cc${path || '/assets/fallback_logo.png'}`
}

export function meta({ data }: Route.MetaArgs) {
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
        '퍼리', '수인', '케모노', '수연시', '퍼리 비쥬얼 노벨', '한글', '한국어', '한글화', '한패', '한국어 패치',
        data.title.trim(), data.kr_title?.trim(), ...(data.tags || []),
      ].filter(Boolean).join(',')
    },
    { name: 'description', content: desc },
    { name: 'og:title', content: `털겜번역단: ${title}` },
    { name: 'og:description', content: desc },
    { name: 'twitter:title', content: `털겜번역단: ${title}` },
    { name: 'twitter:site', content: '털겜번역단' },
    { name: 'card:site', content: 'summary_large_image' },
    { name: 'image:site', content: getStaticImagePath(data.banner_url, data.logo_url) },
    { name: 'twitter:image', content: getStaticImagePath(data.banner_url, data.logo_url) },
  ].filter(Boolean);
}

const plugins = [remarkGfm];

export default function GameInfo() {
  const info = useLoaderData<Route.ComponentProps['loaderData']>();
  const urlsafeTitle = useMemo(() => window.encodeURIComponent(info.title), [info.title]);
  return (
    <div className="pb-12">
      <section className="relative w-full bg-stone-200 dark:bg-stone-700">
        <div className="relative container h-128 mx-auto shadow-lg">
          {info.banner_url?.endsWith('.mp4') ? (
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-hidden">
              <video autoPlay muted loop playsInline className="object-cover w-full min-h-128">
                <source src={info.banner_url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <figure
              className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
            >
              <img className="object-cover w-full min-h-128" src={info.banner_url} loading="lazy" alt={info.title} />
            </figure>
          )}
          <div className="absolute top-0 container mx-auto">
            <Link className="inline-flex items-center p-1 text-stone-200 hover:underline" to="../games">
              <ChevronLeft className="size-4 mr-1" />
              뒤로
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-white dark:from-black to-transparent pb-2" style={{ zIndex: '1' }}>
          <div className="relative container flex p-2 pt-6 mx-auto items-center">
            {info.logo_url ? (
              <img className="w-auto h-11 rounded mr-2 max-[385px]:hidden" src={info.logo_url} alt={info.title} />
            ) : null}
            <GameTitle title={info.kr_title} fallback={info.title} />
          </div>
        </div>
        {info.patch_url ? null : (
          <div className="relative container mx-auto" style={{ zIndex: '0' }}>
            <img className="absolute bottom-1 right-2" width="85" src="/assets/sorry_wip.png" alt="작업중" />
          </div>
        )}
      </section>
      <section className="container mx-auto">
        <div className="flex justify-between p-2 bg-slate-300 dark:bg-slate-700 rounded-b-md mb-4">
          <div className="flex space-x-2 items-center">
            <span className="pl-2">게임:</span>
            {info.url?.includes('itch.io') ? (
              <Tooltip label="Itch.io" position="top">
                <AnchorButton className="inline-flex items-center" href={info.url} target="_blank">
                  <IconItchIO className="size-4" />
                </AnchorButton>
              </Tooltip>
            ) : null}
            {info.url?.includes('store.steampowered.com') ? (
              <Tooltip label="스팀" position="top">
                <AnchorButton className="inline-flex items-center" href={info.url} target="_blank">
                  <IconSteam className="size-4" />
                </AnchorButton>
              </Tooltip>
            ) : null}
            {info.patreon_url ? (
              <Tooltip label="패트리온" position="top">
                <AnchorButton className="inline-flex items-center" href={info.url} target="_blank">
                  <IconPatreon className="size-4" />
                </AnchorButton>
              </Tooltip>
            ) : null}
            <hr className="w-px self-stretch opacity-25" />
            {info.patch_url && info.patch_url !== 'official' ? (
              <AnchorButton className="flex items-center" href={info.patch_url} target="_blank">
                한패받기
                <IconDownload className="size-4 ml-2" />
              </AnchorButton>
            ) : null}
            {info.patch_url ? null : <Button disabled>작업중</Button>}
          </div>
          <div className="flex space-x-2 items-center">
            <Tooltip label="문의/제보하기">
              <AnchorButton
                className="flex items-center"
                href={`https://docs.google.com/forms/d/e/1FAIpQLSdrx0Az_HQs9sEdMoG73o2ubOdZKEtf1ymtcBkv5oRC3T9dMA/viewform?usp=pp_url&entry.2118121111=${urlsafeTitle}`}
                target="_blank"
              >
                <IconMegaphone className="w-4 h-4" />
              </AnchorButton>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center flex-wrap p-2 pb-4 space-x-1">
          {info.tags.map((tag) => <Tag key={tag} name={tag} />)}
        </div>
        {info.status ? (
          <div className="my-2 p-2">
            <div className="inline-block">
              <h3
                className={clsx(
                  'flex items-center font-semibold text-xl p-4 pb-3 rounded-t-lg shadow bg-slate-300 dark:bg-slate-800',
                )}
              >
                <IconAlert className="size-6 mr-2" />
                {info.status}
              </h3>
              {info.status_note ? (
                <p className="rounded-b-lg opacity-85 whitespace-pre-wrap p-4 pt-3 bg-slate-200 dark:bg-slate-700 [&_a]:underline">
                  <Markdown remarkPlugins={plugins}>{info.status_note}</Markdown>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="p-2 pb-4 min-w-full prose dark:prose-invert">
          <Markdown remarkPlugins={plugins}>{info.desc}</Markdown>
        </div>
        {info.tutorial ? (
          <div className="p-2 pb-4">
            <h3 className="text-xl font-semibold pb-2">설치 방법</h3>
            <div className="bg-stone-100 dark:bg-stone-800 dark:text-stone-200 py-2 px-4 rounded prose dark:prose-invert">
              <Markdown remarkPlugins={plugins}>{info.tutorial}</Markdown>
            </div>
          </div>
        ) : null}
        {info.members?.length ? (
          <div className="p-2 pb-4">
            <h3 className="text-xl font-semibold pb-2">번역에 참여주해주신 분들</h3>
            <div className="flex items-center pr-2 space-x-1 flex-wrap">
              {info.members.map(({ name, ...rest }, i) => <Member key={name} name={name} data={rest} />)}
            </div>
          </div>
        ) : null}
        {info.license?.length ? (
          <div className="p-2 pb-4">
            <h3 className="text-xl font-semibold pb-2">라이센스</h3>
            <ul className="list-disc pl-6">
              {info.license?.map(({ name, url }) => (
                <li key={name}>
                  {url ? (
                    <a className="inline-flex items-center hover:underline" href={url} target="_blank">
                      {name}
                      <IconExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ) : (
                    <span>{name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {info.changelog ? (
          <div className="p-2 pb-4">
            <h3 className="text-xl font-semibold pb-2">패치노트</h3>
            <div className="bg-stone-100 overflow-y-auto dark:bg-stone-800 dark:text-stone-200 py-2 px-4 rounded prose dark:prose-invert" style={{ maxHeight: '500px' }}>
              <Markdown remarkPlugins={plugins}>{info.changelog}</Markdown>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function GameTitle({ title, fallback }: { title?: string; fallback: string; }) {
  if (!title) return <h1 className="text-5xl text-black dark:text-white">{fallback}</h1>
  return (
    <h1 className="flex text-black dark:text-white flex-col md:items-end md:flex-row">
      <span className="text-5xl">{title}</span>
      <small className="pl-2 opacity-35 text-2xl">{fallback}</small>
    </h1>
  );
}

