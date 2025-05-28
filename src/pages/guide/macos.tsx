import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 패치 하는 법 > MacOS" },
  ];
}

export default function MacOSGuide() {
  return (
    <div className="prose dark:prose-invert w-full p-2">
      <Markdown remarkPlugins={[remarkGfm]}>
        {`
## MacOS 한글 패치 방법

### 1. 게임을 다운로드 받기.
게임이 macos버전인지 꼭 확인해주세요!  

### 2. 한글패치 다운로드 받기.
압축을 풀면 이런 파일들이 보일 겁니다.

![macos-2](/assets/guide/mac_2.jpg)

### 3. 게임 압축을 풀어 패키지를 열기.
일단 [패키지 내용 보기] 를 눌러 패키지 내용을 확인하고,  
Content > Resource > autorun에 들어가 game 폴더를 확인합니다.

![macos-1](/assets/guide/mac_1.jpg)

### 4. 파일 옮기기
한글 패치에서 밖에 있는 두개의 파일 screen.rpy, screen.rpyc (게임에 따라 screen.rpy가 없는 경우도 있습니다.) 를 game 폴더에 넣어주세요.

![macos-3](/assets/guide/mac_3.jpg)

한글 패치 파일에 있는 tl/korean 폴더를 game폴더 안에 tl 폴더에 넣어주세요 (tl폴더가 없을 때는, 한글패치 tl폴더를 그대로 game폴더에 넣어주세요.)

![macos-4](/assets/guide/mac_4.jpg)

### 5. 게임 실행

처음 실행하는 경우라면, 대부분의 수인 게임은 비공식이라, 권한을 얻어야 합니다.

이런 화면이 뜨면 일단 당황하지말고, [완료]를 눌러 창을 닫아주세요.

![macos-5](/assets/guide/mac_5.jpg)

설정 창을 열어, [개인정보 보호 및 보안]의 제일 아랫쪽으로 스크롤 하시면, 차단된 앱을 실행 할 수 있습니다.

![macos-6](/assets/guide/mac_6.jpg)

[그래도 열기] 를 선택 한 후, 비밀번호를 입력하면 게임이 실행됩니다.

![macos-7](/assets/guide/mac_7.jpg)


### 6. 실행했는데 한글이 안 보여요

한글 설정을 추가하는걸로, 원문과 같이 즐길 수 있게 설정해놨으니,

각자 게임에 들어가, [Korean]을 선택해 한글로 즐겨주세요.

![final](/assets/guide/final.jpg)
        `}
      </Markdown>
    </div>
  );
}
