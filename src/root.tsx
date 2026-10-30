import { Header, Tooltip, AnchorButton, IconDiscord, IconMegaphone } from './components';
import type { JSX } from '@solidjs/web';

export default function App(props: { children: JSX.Element }) {
  return <div class="flex min-h-dvh flex-col">
        <Header />
        <main class="flex-1">
          {props.children}
        </main>
        <footer class="w-full p-2 mt-2">
          <div class="container p-1 m-auto flex items-center justify-between">
            <small class="opacity-55">털겜번역단은 한국어로 즐길 수 있는 퍼리 게임을 소개합니다.</small>
            <div class="flex sm:justify-center opacity-55">
              <Tooltip label="털겜번역단 디스코드">
                <AnchorButton href=" https://discord.gg/cmd2kcKHsY" target="_blank">
                  <IconDiscord class="w-4 h-4" />
                </AnchorButton>
              </Tooltip>
              <Tooltip label="문의/제보하기">
                <AnchorButton
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdrx0Az_HQs9sEdMoG73o2ubOdZKEtf1ymtcBkv5oRC3T9dMA/viewform?usp=header"
                  target="_blank"
                >
                  <IconMegaphone class="w-4 h-4" />
                </AnchorButton>
              </Tooltip>
            </div>
          </div>
        </footer>
  </div>;
}
