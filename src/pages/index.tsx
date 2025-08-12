import { useLoaderData } from "react-router";
import type { Route } from "./+types/index";

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
        <p>처음에는 퍼리 게임 (주로 수연시)를 번역해 배포및 홍보하는 사이트로 만들어졌으나, 한국어로 즐길 수 있는 퍼리 게임을 소개하는 목적으로 변경되었습니다.</p>
        <p>여전히, 한패 배포도 담당하고(혹은 위탁 받고) 있어, 털겜번역단이 소개하는 게임의 번역자나 개발지원은 각 게임마다 따로 소개되어있습니다.</p>
        <p>각 게임을 한국어로 즐길 수 있게 해 주신 분들에게 응원의 한마디 부탁드립니다.</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold py-2">커뮤니티</h2>
        <p>디스코드 서버에서 최신 배포와 소식을 알아보거나, 후기를 서로 공유해보아요.</p>
        <a className="inline-block" href=" https://discord.gg/cmd2kcKHsY" target="_blank">
          <img className="size-12" src="/assets/icons/discord_icon.png" alt="discord" />
        </a>
      </section>
      <section>
        <h2 className="text-2xl font-semibold py-2">사이트 업데이트</h2>
        <small className="block opacity-75">
          공식 한글화 게임, 국산 게임의 소개도 함께 포함하도록 수정했습니다
        </small>
        <small className="block opacity-75">
          2025년 7월부터 서버 역할이 지급안되던 문제를 수정했습니다
        </small>
      </section>
      <small className="block opacity-75">
        본 사이트 일부 이미지는 <a className="underline" href="https://www.irasutoya.com/p/letter.html" target="_blank">いらすとや</a> 의 자료를 사용하고있습니다.
      </small>
    </div>
  );
}
