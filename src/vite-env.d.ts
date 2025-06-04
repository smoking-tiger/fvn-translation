/// <reference types="vite/client" />

declare interface GameInfoType {
  title: string;
  desc: string;
  url: string;
  patreon_url?: string;
  patch_url?: string;
  logo_url?: string;
  banner_url?: string;
  status?: string;
  status_note?: string;
  members: string[];
  tags: string[];
  license: string[];
  changelog?: string;
  updates: number;
}

declare interface MemberType {
  role: string;
  avatar?: string;
  message?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  /** 디코방에 없는 분은 같은 참가일때 후순위로 돌리기 */
  external?: boolean;
}
