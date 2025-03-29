/// <reference types="vite/client" />

declare interface GameInfoType {
  title: string;
  desc: string;
  url: string;
  patch_url?: string;
  logo_url?: string;
  banner_url?: string;
  members: string[];
  tags: string[];
  license: string[];
  changelog?: string;
  updates: number;
}
