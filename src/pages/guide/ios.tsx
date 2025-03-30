import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 패치 하는 법 > iOS" },
  ];
}

export default function IOSGuide() {
  return (
    <div className="prose dark:prose-invert w-full p-2">
      <Markdown remarkPlugins={[remarkGfm]}>
        {`
## iOS 한글 패치 방법

### 1. 어플 다운로드

여러가지 앱이 있습니다만, 그 중에 제일 평가가 많은(좋은) 앱으로 선택했습니다.  
다른 앱은 동작 확인은 안 해봤지만, 아마 될 가능성이 높습니다.  

[spark renpy](https://apps.apple.com/kr/app/id6474479684) 다운로드

### 2. 게임을 다운로드 받기.

게임은 편의상 PC판으로 다운 받아주세요.

### 3. 한글패치 다운로드 받기.

둘 다 다운 받았으면, 파일앱의 다운로드에 이렇게 파일들일 있을겁니다.

둘 다 압축을 풀어주세요.

![](/fvn-translation/assets/guide/ios-1.jpg)

### 3. 파일 복사하기

덮어씌우기를 하면 멋대로 바꾸기 때문에 일단 복사를 하고 게임 폴더안에 game폴더에 덮어쓰기를 합니다.  
게임에 따라 screen.rpy가 없는 경우도 있습니다.

![](/fvn-translation/assets/guide/ios-2.jpg)
복사 하기를 누르고,

![](/fvn-translation/assets/guide/ios-3.jpg)
game 폴더에 가서,

![](/fvn-translation/assets/guide/ios-4.jpg)
붙여넣기를 하고,

![](/fvn-translation/assets/guide/ios-5.jpg)
덮어씌웁니다.

![](/fvn-translation/assets/guide/ios-6.jpg)
그 다음엔 tl/korean 폴더를 복사해서

![](/fvn-translation/assets/guide/ios-7.jpg)
게임폴더의 game/tl 에 덮어씌웁니다.  
해당 폴더에 korean폴더가 이미 있으면(한패 업데이트 적용이라던가) 지우고 덮어씌워주세요 혹시 모를 파일이 남을 수 있으니.

### 4. 압축 파일 만들기

이제 게임 폴더 외에는 필요가 없으니 다 지우셔도 됩니다. (혹시 모르면, 이름을 바꿔서 백업 해 두세요!)

![](/fvn-translation/assets/guide/ios-8.jpg)

폴더를 압축합니다.

![](/fvn-translation/assets/guide/ios-9.jpg)

이것으로, 사전 준비는 다 끝났습니다.

### 5. renpy spark

앱을 키면 제일 위에 나오는 버튼을 눌러주세요.

![](/fvn-translation/assets/guide/ios-10.jpg)

[아카이브 선택]을 누르고

![](/fvn-translation/assets/guide/ios-11.jpg)

방금 만든 압축파일을 선택합니다.

![](/fvn-translation/assets/guide/ios-12.jpg)

이제 게임을 즐기시면 됩니다.

![](/fvn-translation/assets/guide/ios-13.jpg)

### 6. 게임을 실행했는데 한글이 안 보여요

한글 설정을 추가하는걸로, 원문과 같이 즐길 수 있게 설정해놨으니,

각자 게임에 들어가, [Korean]을 선택해 한글로 즐겨주세요.

![final](/fvn-translation/assets/guide/final.jpg)
        `}
      </Markdown>
    </div>
  );
}
