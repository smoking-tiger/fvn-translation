import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm';

import type { Route } from './+types/index';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "털겜번역단: 패치 하는 법 > 안드로이드" },
  ];
}

export default function AndroidGuide() {
  return (
      <div className="prose dark:prose-invert w-full p-2">
        <Markdown remarkPlugins={[remarkGfm]}>
          {`
## 안드로이드 한글 패치 방법

### 1. 사전 준비

#### 1. 개발자 모드 켜기

1. 안드로이드 [설정]에서 [휴대전화 정보] 메뉴 진입

![](/fvn-translation/assets/guide/android-1.jpg)

2. [소프트웨어 정보] 메뉴 진입

![](/fvn-translation/assets/guide/android-2.jpg)

2. [빌드번호] 메뉴를 개발자 모드 활성화 문구가 나올 때까지 반복 터치

![](/fvn-translation/assets/guide/android-3.jpg)

#### 2. Shizuku 설치 및 세팅

1. 구글 플레이에서 [Shizuku](https://play.google.com/store/apps/details?id=moe.shizuku.privileged.api)를 설치

![](/fvn-translation/assets/guide/android-4.jpg)

2. 앱 실행 후 페어링 버튼 클릭

![](/fvn-translation/assets/guide/android-5.jpg)

3. 페어링 서비스 검색중 창 확인

![](/fvn-translation/assets/guide/android-6.jpg)

4. [설정]에서 개발자 옵션 진입

![](/fvn-translation/assets/guide/android-7.jpg)

5. 무선 디버깅 활성화 및 메뉴 진입

![](/fvn-translation/assets/guide/android-8.jpg)

6. [페어링 코드로 기기 페어링] 메뉴 클릭

![](/fvn-translation/assets/guide/android-9.jpg)

7. Shizuku가 "페어링 서비스를 찾았습니다" 알람을 띄우면서 Wi-Fi 페어링 코드가 나타나면 숫자를 기억

![](/fvn-translation/assets/guide/android-10.jpg)

8. 알림창에서 [페어링 코드 입력] 버튼 터치

![](/fvn-translation/assets/guide/android-11.jpg)

9. (7)의 Wi-Fi 페어링 코드를 입력 후 [전송] 터치

![](/fvn-translation/assets/guide/android-12.jpg)

10. 페어링 성공 메시지가 뜨면 성공

![](/fvn-translation/assets/guide/android-13.jpg)

11. Shizuku 앱으로 돌아가서 시작 버튼 클릭

![](/fvn-translation/assets/guide/android-14.jpg)

12. 다음 화면이 뜨면 대기

![](/fvn-translation/assets/guide/android-15.jpg)

13. Shizuku앱에 "Shizuku가 실행 중입니다." 메시지가 뜨면 성공

![](/fvn-translation/assets/guide/android-16.jpg)

### 2. 게임 다운로드

해당 게임 페이지에 가서 안드로이드 버전 (apk) 를 다운 받은 후, apk 파일을 설치 해 주세요.

### 3. 한글 패치 하기

1. 한글 패치 다운로드 하기

2. 한국어 패치 압축 풀기 (스크린샷은 Google Files 사용)

![](/fvn-translation/assets/guide/android-17.jpg)

3. FV File Manager 설치 (Android/data 접근 가능한 파일 탐색기면 다 가능)

![](/fvn-translation/assets/guide/android-18.jpg)

4. 파일 탐색기를 실행하여 (1)에서 압축을 푼 경로로 가기

![](/fvn-translation/assets/guide/android-19.jpg)

5. [game] 폴더를 [복사] or [잘라내기]

game폴더가 없을 시엔, 압축을 푼 폴더를 game 폴더로 이름 번경 해주세요.

![](/fvn-translation/assets/guide/android-20.jpg)

6. Android/data/(패치할 어플 이름)/files 폴더에 들어가서(files 폴더가 없으면 직접 만들어서) [붙여넣기]

![](/fvn-translation/assets/guide/android-21.jpg)
![](/fvn-translation/assets/guide/android-22.jpg)

### 4. 게임을 실행했는데 한글이 안 보여요

한글 설정을 추가하는걸로, 원문과 같이 즐길 수 있게 설정해놨으니,

각자 게임에 들어가, [Korean]을 선택해 한글로 즐겨주세요.

![final](/fvn-translation/assets/guide/final.jpg)
          `}
        </Markdown>
      </div>
  );
}
