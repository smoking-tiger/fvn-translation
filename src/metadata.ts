
interface MemberType {
  avatar: string;
  role: string;
  message?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  /** 팀의 일원은 아님 */
  external?: boolean;
}

export const member = {
  '도루룽': {
    avatar: '/fvn-translation/assets/members/dorurung.png',
    message: '아다스트라를 너무 감명 깊게 플레이해서 시작한 번역 프로젝트인데.. 스케일이 끝도없이 커지고 있다!',
    role: '프로그래머',
    discord: 'Dorurung#6690',
    telegram: 'dorurung',
  },
  'Husky': {
    avatar: '/fvn-translation/assets/members/husky.jpg',
    role: '번역가',
  },
  '늑발': {
    avatar: '/fvn-translation/assets/members/nukbal.jpg',
    message: '직접 번역해서 영업해야...',
    role: '프로그래머',
    twitter: 'frostwolfclaw',
  },
  'Nelson': {
    avatar: '/fvn-translation/assets/members/nelson.jpg',
    role: '번역가',
    twitter: 'ultim8nelson',
  },
  '레드벨': {
    avatar: '/fvn-translation/assets/members/redbell.jpg',
    message: '누군가 이미 열심히 일궈놓은 농사 도우면 될 줄 알았는데 내가 쟁기끄는 소일줄은 몰랐죠',
    role: '번역가',
  },
  'Autumn': {
    avatar: '/fvn-translation/assets/members/autumnfop.jpg',
    role: '번역가',
    twitter: 'Autumnfop',
    external: true,
  },
} as Record<string, MemberType>;

export const license = {
  '나눔폰트': 'https://help.naver.com/service/30016/contents/18088?osType=PC&lang=ko',
  '인천교육힘찬체': '',
} as Record<string, string>;
