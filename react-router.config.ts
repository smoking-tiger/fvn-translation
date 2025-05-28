import { resolve } from 'node:path';
import * as fs from 'node:fs';

import type { Config } from '@react-router/dev/config';

export default {
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
} satisfies Config;
