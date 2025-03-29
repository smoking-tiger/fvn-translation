import { resolve } from 'node:path';
import * as fs from 'node:fs';

import type { Config } from '@react-router/dev/config';

export default {
  // ssr: false,
  basename: '/fvn-translation/',
  appDirectory: 'src',
  prerender() {
    const cwd = resolve(__dirname, './games');
    const list = [] as string[];
    fs.readdirSync(cwd).forEach((filename) => {
      list.push(`/games/${filename.substring(0, filename.length - 5)}`);
    });
    return [
      '/',
      '/guide',
      '/guide/macos',
      '/guide/android',
      '/guide/ios',
      '/games',
      ...list,
    ];
  },
  buildEnd: () => {
    // react-router가 fvn-translation을 붙여서 빌드해버리니 떼버리기
    const cwd = resolve('./build/client/fvn-translation');
    if (!fs.existsSync('./build/client/games')) fs.mkdirSync('./build/client/games');
    if (!fs.existsSync('./build/client/guide')) fs.mkdirSync('./build/client/guide');
    const glob = new Bun.Glob('**/*');
    for (const p of glob.scanSync({ cwd })) {
      if (p.endsWith('index.html') && p !== 'index.html' && p !== 'games/index.html' && p !== 'guide/index.html') {
        const name = p.substring(0, p.lastIndexOf('/'));
        if (!fs.existsSync(`./build/client/${name}`)) fs.mkdirSync(`./build/client/${name}`);
      }
      fs.renameSync(
        `./build/client/fvn-translation/${p}`,
        `./build/client/${p}`,
      );
    }
    if (fs.existsSync('./build/client/fvn-translation')) {
      fs.rmdirSync('./build/client/fvn-translation', { recursive: true });
    }
  },
} satisfies Config;
