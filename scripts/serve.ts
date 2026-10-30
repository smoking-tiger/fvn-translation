import { resolve, sep } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';
import { watch } from 'node:fs';
import { commitRevision, project, out, routes, renderPage, compileAssets } from './build';

const compressed = new Map<string, Uint8Array<ArrayBuffer>>();
const clearCompressionCache = () => compressed.clear();

function assetResponse(request: Request, body: string | Uint8Array<ArrayBuffer>, type: string, cacheControl: string) {
  const accepted = (request.headers.get('accept-encoding') || '').split(',').map((part) => {
    const [name, ...parameters] = part.trim().split(';');
    const quality = parameters.find((value) => value.trim().startsWith('q='));
    return { name, quality: quality ? Number(quality.trim().slice(2)) : 1 };
  }).filter(({ quality }) => quality > 0);
  const encoding = ['br', 'gzip'].find((name) => accepted.some((item) => item.name === name));
  const headers: Record<string, string> = { 'content-type': type, 'cache-control': cacheControl, vary: 'Accept-Encoding' };
  if (!encoding) return new Response(body, { headers });
  const key = `${new URL(request.url).pathname}:${encoding}`;
  let bytes = compressed.get(key);
  if (!bytes) {
    const source = typeof body === 'string' ? new TextEncoder().encode(body) : body;
    bytes = encoding === 'br'
      ? new Uint8Array(brotliCompressSync(source, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }))
      : Bun.gzipSync(source, { level: 9 });
    compressed.set(key, bytes);
  }
  headers['content-encoding'] = encoding;
  return new Response(bytes, { headers });
}

const dev = Bun.argv.includes('--dev');
let generation = 0;
const commit = commitRevision();
const revision = () => `${commit}-dev-${generation}`;
const assets = new Map<string, string>();
const compiled = new Set<string>();
const invalidate = () => { generation++; assets.clear(); compiled.clear(); clearCompressionCache(); };
if (dev) {
  for (const directory of ['src', 'games', 'guides', 'scripts']) watch(resolve(project, directory), { recursive: true }, invalidate);
  for (const file of ['package.json', 'tsconfig.json', 'bun.lock']) watch(resolve(project, file), invalidate);
}

async function render(path: string, version: string) {
  const child = Bun.spawn(['bun', 'scripts/serve.ts', '--render'], {
    cwd: project, stdin: 'pipe', stdout: 'pipe', stderr: 'pipe',
  });
  child.stdin.write(JSON.stringify({ path, revision: version, compile: !compiled.has(version) }));
  child.stdin.end();
  const [text, errors, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
  if (code) throw new Error(errors);
  const result: { html: string; script: string; javascript: string; assets: Record<string, string>; status: number } = JSON.parse(text);
  for (const [url, text] of Object.entries(result.assets)) assets.set(url, text);
  compiled.add(version);
  assets.set(result.script, result.javascript);
  return result;
}

export function startServer() {
  const server = Bun.serve({
    hostname: '127.0.0.1', port: Number(Bun.env.PORT || 3000),
    async fetch(request) {
      try {
        const url = new URL(request.url);
        let pathname: string;
        try { pathname = decodeURIComponent(url.pathname); } catch { return new Response(null, { status: 400 }); }
        const root = dev ? resolve(project, 'public') : out;
        const path = resolve(root, `.${pathname}`);
        if (path !== root && !path.startsWith(root + sep)) return new Response(null, { status: 403 });
        const headers = { 'cache-control': 'no-store' };
        if (dev) {
          if (assets.has(pathname)) return assetResponse(request, assets.get(pathname)!, pathname.endsWith('.css') ? 'text/css' : 'text/javascript', 'no-store');
          const module = pathname.match(/^(.*)\/page\.([a-f0-9]{12}-dev-\d+)\.js$/);
          if (module) {
            if (module[2] !== revision()) return new Response(null, { status: 404, headers });
            const result = await render(module[1] || '/', module[2]);
            if (result.status !== 200) return new Response(null, { status: result.status, headers });
            return assetResponse(request, result.javascript, 'text/javascript', 'no-store');
          }
          if (pathname.split('/').at(-1)?.includes('.')) {
            const file = Bun.file(path);
            return await file.exists() ? new Response(file, { headers }) : new Response(null, { status: 404, headers });
          }
          const result = await render(pathname.replace(/\/+$/, '') || '/', revision());
          return new Response(result.html, { status: result.status, headers: { ...headers, 'content-type': 'text/html; charset=utf-8' } });
        }
        const file = Bun.file(path);
        if (pathname.split('/').at(-1)?.includes('.') && await file.exists()) {
          const cache = /\.[a-f0-9]{12}\.(js|css)$/.test(pathname) ? 'public, max-age=31536000, immutable' : 'no-cache';
          if (/\.(js|css)$/.test(pathname)) return assetResponse(request, await file.bytes(), file.type, cache);
          return new Response(file, { headers: { 'cache-control': cache } });
        }
        const html = Bun.file(resolve(path, 'index.html'));
        if (await html.exists()) return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
        return new Response(Bun.file(resolve(root, '404.html')), { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
      } catch (error) {
        console.error(error);
        return new Response('Page generation failed. See terminal for details.', { status: 500, headers: { 'cache-control': 'no-store' } });
      }
    },
  });
  console.log(`${dev ? 'On-demand dev' : 'Static site'}: ${server.url}`);
  return server;
}
if (Bun.argv.includes('--render')) {
  const { path, revision, compile } = await new Response(Bun.stdin.stream()).json();
  const pages = await routes(path);
  const route = pages.find((route) => route.path === path) || pages.find((route) => route.path === '/404')!;
  const assets = compile ? await compileAssets(revision) : {};
  process.stdout.write(JSON.stringify({ ...await renderPage(route, revision), assets, status: route.path === '/404' ? 404 : 200 }));
} else if (import.meta.main) startServer();
