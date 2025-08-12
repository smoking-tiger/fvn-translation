import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 랜파이 패치 하는 법 > PC" },
    { name: 'og:title', content: '털겜번역단: 랜파이 패치 하는 법 > PC' },
    { name: 'twitter:title', content: '털겜번역단: 랜파이 패치 하는 법 > PC' },
    { name: 'keywords', content: ['퍼리', '수인', '케모노', '수연시', '게임', '퍼리 비쥬얼 노벨', 'FVN', 'Furry visual Novel', '가이드', '설명', 'PC'].join(',') },
    { name: 'card:site', content: 'summary' },
    { name: 'image:site', content: 'https://kemovn.cc/assets/fallback_logo.png' },
    { name: 'twitter:image', content: 'https://kemovn.cc/assets/fallback_logo.png' },
  ];
}

export default function PcGuide() {
  return (
    <div className="prose dark:prose-invert w-full p-2">
      <Markdown remarkPlugins={[remarkGfm]}>
        {`
## PC 한글 패치 방법

### 1. 게임을 다운로드 받기.
게임이 PC판인지 꼭 확인해주세요!

### 2. 한글패치 다운로드 받기.

### 3. 게임 압축을 풀어 패키지를 열기.
게임 압축을 풀면, 게임 폴더에 game폴더가 있을겁니다.

![pc-1](/assets/guide/pc_1.jpg)

### 4. 파일 옮기기

한글 패치 파일을 game 폴더에 그대로 압축을 풀어주시면 됩니다.

|  |  |
| --- | --- |
| ![pc-2](/assets/guide/pc_2.jpg) | ![pc-3](/assets/guide/pc_3.jpg) |

### 5. 게임을 실행했는데 한글이 안 보여요

한글 설정을 추가하는걸로, 원문과 같이 즐길 수 있게 설정해놨으니,

각자 게임에 들어가, [Korean]을 선택해 한글로 즐겨주세요.

![final](/assets/guide/final.jpg)
        `}
      </Markdown>
    </div>
  );
}
