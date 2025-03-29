import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/fvn-translation')) return Response.error();

    let path = resolve(__dirname, './build/client', url.pathname.replace('/fvn-translation', '.'));
    if (path.indexOf('.') === -1 && !path.endsWith('__manifest')) {
      path += '/index.html';
    }
    if (!existsSync(path)) return Response.error();

    return new Response(Bun.file(path));
  },
});
