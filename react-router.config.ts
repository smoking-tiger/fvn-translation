import { resolve } from 'node:path';
import * as fs from 'node:fs';

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

export default {
  ssr: false,
  appDirectory: 'src',
  prerender: list,
  async buildEnd(arg) {
    const arr = ['<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
    let latest: Date | null = null;

    for await (const name of list.reverse()) {
      if (name === '/') {
        arr.push(`<url><loc>https://kemovn.cc</loc><lastmod>${(latest || new Date()).toISOString()}</lastmod></url>`)
      } else if (name.startsWith('/games/')) {
        const f = fs.statSync(resolve(cwd, name.replace('/games/', './')) + '.yaml');
        if (!latest || latest < f.mtime) {
          latest = new Date(f.mtime);
        }
        arr.push(`<url><loc>https://kemovn.cc${name}/</loc><lastmod>${f.mtime.toISOString()}</lastmod></url>`)
      } else {
        arr.push(`<url><loc>https://kemovn.cc${name}/</loc><lastmod>${(latest || new Date()).toISOString()}</lastmod></url>`)
      }
    }

    if (arr.length === 1) return;
    arr.push('</urlset>');

    const dist = resolve(__dirname, './build/client/sitemap.xml');
    await Bun.file(dist).write(arr.join('\r\n'));

    if (fs.existsSync(resolve(__dirname, './build/client/__spa-fallback.html'))) {
      fs.renameSync(resolve(__dirname, './build/client/__spa-fallback.html'), resolve(__dirname, './build/client/404.html'));
    }
  },
} satisfies Config;
