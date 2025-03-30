import { resolve } from 'node:path';
import fs from 'node:fs';
import { load } from 'js-yaml';

interface ListItem extends Pick<GameInfoType, 'title' | 'banner_url' | 'logo_url' | 'tags'> {
  name: string;
}

export function loadList() {
   const cwd = resolve(import.meta.dirname, import.meta.env.DEV ? '../games' : '../../games');
 
   const tags = new Set<string>();
   const list = [] as ListItem[];
 
   fs.readdirSync(cwd).forEach((filename) => {
     const txt = fs.readFileSync(resolve(cwd, filename), 'utf-8');
     const conf = load(txt) as GameInfoType;
     list.push({
       name: filename.substring(0, filename.length - 5),
       title: conf.title,
       banner_url: conf.banner_url,
       logo_url: conf.logo_url,
       tags: conf.tags,
     });
     conf.tags.forEach((tag) => tags.add(tag));
   });
   list.sort((a, b) => a.name > b.name ? 1 : -1);
   return { list, tags: Array.from(tags) } as { list: ListItem[]; tags: string[]; }; 
}

export function loadGame(name: string) {
  const cwd = resolve(import.meta.dirname, import.meta.env.DEV ? '../games' : '../../games');
  const txt = fs.readFileSync(resolve(cwd, `./${name}.yaml`), 'utf-8');
  return load(txt) as GameInfoType;
}
