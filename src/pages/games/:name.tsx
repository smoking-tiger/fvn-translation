import { Link, useLoaderData } from 'react-router';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

import Button, { AnchorButton } from 'components/Button';
import IconExternalLink from 'components/Icons/ExternalLink';
import ChevronLeft from 'components/Icons/ChevronLeft';
import Member from 'components/Member';
import Tag from 'components/Tag';

import type { Route } from './+types/:name';

import { license } from '../../metadata';
import { loadGame } from '../../loaders';

export async function loader({ params }: Route.LoaderArgs) {
  return loadGame(params.name) as GameInfoType;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `털겜번역단: ${data.title}` }];
}

export default function GameInfo() {
  const info = useLoaderData<Route.ComponentProps['loaderData']>();
  return (
    <div className="pb-12">
      <section className="relative w-full bg-slate-200 dark:bg-slate-700">
        <div className="relative container h-128 mx-auto shadow-sm">
          {info.banner_url?.endsWith('.mp4') ? (
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-hidden">
              <video autoPlay muted loop playsInline className="object-cover w-full min-h-128">
                <source src={info.banner_url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <figure
              className="absolute top-0 left-0 right-0 bottom-0 bg-cover"
              style={{ backgroundImage: `url(${info.banner_url})` }}
            />
          )}
          <div className="absolute top-0 container mx-auto">
            <Link className="inline-flex items-center p-1 text-slate-200 hover:underline" to="../games">
              <ChevronLeft className="size-4 mr-1" />
              뒤로
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-white dark:from-black to-transparent pb-2">
          <div className="relative container flex p-2 pt-6 mx-auto items-center">
            {info.logo_url ? (
              <img className="w-auto h-11 rounded mr-2" src={info.logo_url} />
            ) : null}
            <h1 className="text-5xl text-black dark:text-white">{info.title}</h1>
          </div>
        </div>
      </section>
      <section className="container mx-auto">
        <div className="flex justify-between p-2 bg-slate-200 dark:bg-slate-700 rounded-b-md mb-4">
          <div className="space-x-2">
            <AnchorButton className="inline-flex items-center" href={info.url} target="_blank">
              게임 다운로드
              <IconExternalLink className="size-4 ml-1" />
            </AnchorButton>
            {info.patch_url ? (
              <AnchorButton href={info.patch_url} target="_blank">한글패치</AnchorButton>
            ) : (
              <Button disabled>작업중</Button>
            )}
          </div>
          <div className="flex items-center pr-2">
            {info.members.map((m, i) => <Member key={m} name={m} style={{ zIndex: info.members.length - i, marginLeft: i * -8 }} />)}
          </div>
        </div>
        <div className="p-2 pb-4 space-x-1">
          {info.tags.map((tag) => <Tag key={tag} name={tag} />)}
        </div>
        <div className="p-2 pb-4">
          <p className="whitespace-pre-wrap">{info.desc}</p>
        </div>
        {info.changelog ? (
          <div className="p-2 pb-4">
            <h3 className="text-xl font-semibold pb-2">패치노트</h3>
            <div className="bg-slate-100 dark:bg-slate-800 dark:text-slate-200 p-2 rounded">
              <Markdown remarkPlugins={[remarkGfm]}>{info.changelog}</Markdown>
            </div>
          </div>
        ) : null}
        <div className="p-2">
          <h3 className="text-xl font-semibold pb-2">라이센스</h3>
          <ul className="list-disc pl-6">
            {info.license?.map((n) => {
              if (!(n in license)) return null;
              const name = license[n];
              if (!name) return <li key={n}>{n}</li>;
              return (
                <li key={n}>
                  <a className="inline-flex items-center hover:underline" href={name} target="_blank">
                    {n}
                    <IconExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
