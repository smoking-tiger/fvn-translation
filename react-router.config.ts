import { resolve } from 'node:path';
import * as fs from 'node:fs';
import { execFileSync } from 'node:child_process';

import type { Config } from '@react-router/dev/config';

const cwd = resolve(__dirname, './games');
const list = [
  '/',
  '/guide',
  '/guide/macos',
  '/guide/android',
  '/guide/ios',
  '/games',
] as string[];
fs.readdirSync(cwd).forEach((filename) => {
  list.push(`/games/${filename.substring(0, filename.length - 5)}`);
});

function collectGitMtimes(cwd: string, files: string[]): Map<string, Date> {
  const mtimes = new Map<string, Date>();
  if (files.length === 0) return mtimes;

  const output = execFileSync('git', [
    '-C', cwd, 'log', '--relative', '--name-only', '--format=COMMIT:%cI', '--', ...files,
  ], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });

  let date: Date | undefined;

  for (const line of output.split('\n')) {
    const name = line.trim();
    if (!name) continue;

    if (name.startsWith('COMMIT:')) {
      date = new Date(name.slice(7));
    } else if (date && !mtimes.has(name)) {
      mtimes.set(name, date);
      if (mtimes.size === files.length) break;
    }
  }

  return mtimes;
}

function lastmod(date?: Date): string {
  return date ? `<lastmod>${date.toISOString()}</lastmod>` : '';
}


export default {
  ssr: false,
  appDirectory: 'src',
  prerender: list,
  async buildEnd() {
    const arr = [] as string[];

    const games = list
      .filter((name) => name.startsWith('/games/'))
      .map((name) => ({ name, file: `${name.slice('/games/'.length)}.yaml` }));

    const mtimes = collectGitMtimes(cwd, games.map((game) => game.file));
    const latest = [...mtimes.values()].reduce<Date | undefined>(
      (max, date) => !max || date > max ? date : max,
      undefined,
    );

    for await (const name of list.reverse()) {
      const date = name.startsWith('/games/')
        ? mtimes.get(`${name.slice('/games/'.length)}.yaml`)
        : latest;

      const loc = name === '/'
        ? 'https://kemovn.cc'
        : `https://kemovn.cc${name}/`;

      arr.push(`<url><loc>${loc}</loc>${lastmod(date)}</url>`);
    }

    if (!arr.length) return;

    const dist = resolve(__dirname, './build/client/sitemap.xml');
    await Bun.file(dist)
      .write(['<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...arr.reverse(), '</urlset>'].join('\r\n'));

    if (fs.existsSync(resolve(__dirname, './build/client/__spa-fallback.html'))) {
      fs.renameSync(resolve(__dirname, './build/client/__spa-fallback.html'), resolve(__dirname, './build/client/404.html'));
    }
  },
} satisfies Config;
