import { resolve } from 'node:path';
import fs from 'node:fs';
import { load } from 'js-yaml';

import * as m from './metadata';

interface ListItem extends Pick<GameInfoType, 'title' | 'banner_url' | 'logo_url' | 'tags'> {
  name: string;
  kr_title?: string;
  patched?: boolean;
  hidden?: boolean;
}

export function loadList() {
  const cwd = resolve(import.meta.dirname, import.meta.env.DEV ? '../games' : '../../../games');

  const tags = new Set<string>();
  const list = [] as ListItem[];

  fs.readdirSync(cwd).forEach((filename) => {
    const txt = fs.readFileSync(resolve(cwd, filename), 'utf-8');
    const conf = load(txt) as GameInfoType;
    list.push({
      name: filename.substring(0, filename.length - 5),
      title: conf.title,
      kr_title: conf.kr_title,
      banner_url: conf.banner_url,
      logo_url: conf.logo_url,
      tags: conf.tags,
      patched: !!conf.patch_url,
      hidden: conf.hidden,
    });
    conf.tags.forEach((tag) => {
      if (tag.startsWith('성적묘사')) return;
      tags.add(tag);
    });
  });

  list.sort((a, b) => {
    if (a.patched !== b.patched) return a.patched ? -1 : 1;
    return a.name > b.name ? 1 : -1;
  });
  return { list, tags: Array.from(tags) } as { list: ListItem[]; tags: string[]; }; 
}

export function loadGame(name: string) {
  const cwd = resolve(import.meta.dirname, import.meta.env.DEV ? '../games' : '../../../games');
  const txt = fs.readFileSync(resolve(cwd, `./${name}.yaml`), 'utf-8');
  const cfg = load(txt) as GameInfoType;
  const members = cfg.members?.map((name) => ({ name, ...(m.member[name] || {}) })) as Array<MemberType & { name: string; }> || [];
  const license = cfg.license?.map((name) => ({ name, url: m.license[name] })) || [];
  return { ...cfg, members, license };
}

export function loadMembers() {
  const cwd = resolve(import.meta.dirname, import.meta.env.DEV ? '../games' : '../../../games');
  const members = {} as Record<string, MemberType & { name: string; count: number; }>;
  const names = new Set<string>();

  fs.readdirSync(cwd).forEach((filename) => {
    const txt = fs.readFileSync(resolve(cwd, filename), 'utf-8');
    const conf = load(txt) as GameInfoType;
    conf.members.forEach((name) => {
      if (!m.member[name] || m.member[name]?.external) return;
      if (members[name]) {
        members[name].count += 1;
      } else {
        // @ts-expect-error
        members[name] = { name, role: '번역가', count: 0, ...(m.member[name] || {}) };
      }
      names.add(name);
    });
  });
  const arr = Array.from(names).map((name) => members[name]).filter(Boolean);
  arr.sort((a, b) => {
    if (a.count === b.count) return a.external ? 1 : -1;
    return a.count > b.count ? -1 : 1;
  });
  return arr;
}
