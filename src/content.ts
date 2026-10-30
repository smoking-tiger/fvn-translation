export type GameData = Omit<GameInfoType, 'members' | 'license'> & {
  members: Array<MemberType & { name: string }>;
  license: Array<{ name: string; url?: string }>;
};

export interface GameListData {
  list: Array<Pick<GameInfoType, 'title' | 'kr_title' | 'banner_url' | 'logo_url' | 'tags' | 'hidden'> & {
    name: string;
    mode: 'wip' | 'official' | null;
    nsfw: boolean;
  }>;
}

export interface GuideData {
  html: string;
  navigation: Array<{ path: string; label: string }>;
}
