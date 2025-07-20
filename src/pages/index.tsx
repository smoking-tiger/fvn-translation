import { useLoaderData } from "react-router";
import type { Route } from "./+types/index";
import Member from "components/Member";

export async function loader() {
  const { loadMembers } = await import('../loaders');
  return loadMembers();
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: '털겜번역단' },
    { 'og:site_name': '털겜번역단' },
    { 'og:type': 'website' },
  ];
}

export default function Layout() {
  const member = useLoaderData<Route.ComponentProps['loaderData']>();
  return (
    <div className="container mx-auto p-2 pt-8 space-y-5 pb-16">
      <section>
        <h2 className="text-2xl font-semibold py-2">털겜번역단</h2>
        <p>우리는 퍼리 게임, 특히 퍼리 비쥬얼 노벨(일명 수연시) 너무나 사랑해서 한국어로 번역해, 다 같이 공유하고 싶어하는 사람들입니다.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold py-2">커뮤니티</h2>
        <p>디스코드 서버에서 최신 배포와 소식을 알아보세요.</p>
        <a className="inline-block" href=" https://discord.gg/cmd2kcKHsY" target="_blank">
          <img className="size-12" src="/assets/icons/discord_icon.png" alt="discord" />
        </a>
      </section>
      <section>
        <h2 className="text-2xl font-semibold py-2">번역에 참여주해주신 분들</h2>
        <div className="flex space-x-2 space-y-2 flex-wrap">
          {member.map((d) => (
            <Member key={d.name} name={d.name} data={d} full />
          ))}
        </div>
      </section>
    </div>
  );
}
