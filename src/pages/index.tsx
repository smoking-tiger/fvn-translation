import type { Route } from "./+types/index";

import { member } from '../metadata';

export function meta({}: Route.MetaArgs) {
  return [{ title: "털겜번역단" }];
}

export default function Layout() {
  return (
    <div className="container mx-auto p-2 pt-8 space-y-5">
      <section>
        <h2 className="text-2xl font-semibold py-2">우리는...</h2>
        <p>퍼리 비주얼 노벨을 너무나 사랑해서 한국어로 번역하고 싶어하는 사람들입니다.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold py-2">커뮤니티</h2>
        <p>디스코드 서버에서 최신 배포와 소식을 알아보세요.</p>
        <a href="https://discord.com/invite/U7XsRUc83T" target="_blank">
          <img className="size-12" src="/fvn-translation/assets/icons/discord_icon.png" alt="discord" />
        </a>
      </section>
      <section>
        <h2 className="text-2xl font-semibold py-2">팀원 소개</h2>
        <ul className="space-y-4">
          {Object.keys(member).map((name) => {
            const data = member[name];
            if (!data || data.external) return null;
            return (
              <li key={name} className="flex">
                <img className="size-28 rounded" src={data.avatar} alt={name} />
                <div className="flex flex-col ml-2 justify-between">
                  <div>
                    <h5 className="font-semibold">{name}</h5>
                    <small className="opacity-75 text-sm">{data.role}</small>
                  </div>
                  {data.message ? (
                    <p className="pt-1 whitespace-pre-wrap">{data.message}</p>
                  ) : null}
                  <div className="space-x-2 flex pt-2">
                    {data.twitter ? (
                      <a className="flex items-center hover:underline text-sm" href={`https://x.com/${data.twitter}`} target="_blank">
                        <img className="size-6 mr-1" src="/fvn-translation/assets/icons/twitter_icon.jpg" alt="x" />
                        {`@${data.twitter}`}
                      </a>
                    ) : null}
                    {data.discord ? (
                      <span className="flex items-center text-sm">
                        <img className="size-6 mr-2" src="/fvn-translation/assets/icons/discord_icon.png" alt="discord" />
                        {data.discord}
                      </span>
                    ) : null}
                    {data.telegram ? (
                      <span className="flex items-center text-sm">
                        <img className="size-6 mr-2" src="/fvn-translation/assets/icons/telegram_icon.png" alt="telegram" />
                        {`@${data.telegram}`}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
