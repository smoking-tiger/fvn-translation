import { rm, cp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { plugin } from 'bun';
import { transform } from '@solidjs/compiler';
import { renderToString, generateHydrationScript } from '@solidjs/web';
import { member, license } from '../src/metadata';
import type { GameData, GameListData, GuideData } from '../src/content';
import type { Meta, Page } from '../src/client';

export const project = resolve(import.meta.dir, '..');
export const out = resolve(project, 'build');
const markdown = (text: string) => Bun.markdown.html(text, { headings: { ids: true } });
const transpiler = new Bun.Transpiler({ loader: 'ts' });
function compile(source: string, filename: string, generate: 'dom' | 'ssr') {
  return transpiler.transformSync(transform(source, { filename, generate, hydratable: true }).code);
}
plugin({ name: 'solid-ssr', setup(build) {
  build.onLoad({ filter: /\.tsx$/ }, async ({ path }) => ({ contents: compile(await Bun.file(path).text(), path, 'ssr'), loader: 'js' }));
} });
export function commitRevision() {
  const result = Bun.spawnSync(['git', 'rev-parse', '--short=12', 'HEAD'], { cwd: project });
  if (result.exitCode) throw new Error('Cannot read Git commit');
  return result.stdout.toString().trim();
}

interface GuideMetadata {
  label: string;
  title: string;
  description: string;
  order: number;
  keywords: string[];
  image: string;
}

async function loadGuides(requestedPath?: string): Promise<Route[]> {
  const files = await Array.fromAsync(new Bun.Glob('*.md').scan(resolve(project, 'guides')));
  const guides = await Promise.all(files.sort().map(async (file) => {
    const source = await Bun.file(resolve(project, 'guides', file)).text();
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
    if (!match) throw new Error(`guides/${file}: YAML frontmatter is required`);
    const meta = Bun.YAML.parse(match[1]) as GuideMetadata;
    if (!meta || typeof meta.label !== 'string' || typeof meta.title !== 'string' || typeof meta.description !== 'string'
      || typeof meta.order !== 'number' || !Number.isFinite(meta.order) || typeof meta.image !== 'string'
      || !Array.isArray(meta.keywords) || !meta.keywords.every((item) => typeof item === 'string')) {
      throw new Error(`guides/${file}: invalid guide metadata`);
    }
    return { file, meta, body: match[2], path: file === 'index.md' ? '/guide' : `/guide/${file.slice(0, -3)}` };
  }));
  guides.sort((a, b) => a.meta.order - b.meta.order || a.path.localeCompare(b.path));
  const navigation = guides.map(({ path, meta }) => ({ path, label: meta.label }));
  return guides.filter(({ path }) => !requestedPath || path === requestedPath).map(({ file, meta, body, path }) => ({
    path, component: 'guide', source: `guides/${file}`,
    data: { html: markdown(body), navigation } satisfies GuideData,
    meta: [
      { title: meta.title },
      { name: 'description', content: meta.description },
      { name: 'keywords', content: meta.keywords.join(',') },
      { name: 'og:title', content: meta.title },
      { name: 'og:description', content: meta.description },
      { name: 'og:image', content: meta.image },
      { name: 'twitter:title', content: meta.title },
      { name: 'twitter:description', content: meta.description },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:image', content: meta.image },
    ],
  }));
}

export interface Route { path: string; component: string; data?: unknown; meta?: Meta[]; source?: string; metaData?: unknown }
export async function routes(requestedPath?: string) {
  const games = await Promise.all((await Array.fromAsync(new Bun.Glob('*.yaml').scan(resolve(project, 'games')))).sort().filter((file) => !requestedPath || requestedPath === '/games' || requestedPath === `/games/${file.slice(0, -5)}`).map(async (file) => ({
    name: file.slice(0, -5),
    info: Bun.YAML.parse(await Bun.file(resolve(project, 'games', file)).text()) as GameInfoType,
  })));
  const list: GameListData['list'] = games.map(({ name, info }) => ({
    name, title: info.title, kr_title: info.kr_title, banner_url: info.banner_url, logo_url: info.logo_url,
    tags: info.tags, hidden: info.hidden, nsfw: info.tags.some((tag) => tag.startsWith('성적묘사')),
    mode: info.patch_url === 'official' ? 'official' : info.patch_url ? null : 'wip',
  }));
  list.sort((a, b) => Number(a.mode === 'wip') - Number(b.mode === 'wip') || a.name.localeCompare(b.name));

  const guideRoutes = !requestedPath || requestedPath === '/guide' || requestedPath.startsWith('/guide/')
    ? await loadGuides(requestedPath) : [];
  const routes: Route[] = [
    { path: '/', component: 'index' },
    { path: '/games', component: 'games/index', data: { list } },
    ...guideRoutes,
    ...games.filter(() => requestedPath !== '/games').map(({ name, info }) => ({
      path: `/games/${name}`, component: 'games/[name]', metaData: info, source: `games/${name}.yaml`,
      data: {
        ...info,
        ...Object.fromEntries(['desc', 'status_note', 'tutorial', 'changelog'].map((key) => [key, markdown(info[key as keyof GameInfoType] as string || '')])),
        members: (info.members || []).map((name) => ({ name, ...member[name] })),
        license: (info.license || []).map((name) => ({ name, url: license[name] })),
      } satisfies GameData,
    })),
    { path: '/404', component: 'not-found' },
  ];
  return routes;
}

const templates: Record<string, string> = {
  home: 'index', games: 'games/index', 'game-detail': 'games/[name]', guide: 'guide',
  'not-found': 'not-found',
};
const templateName = (component: string) => Object.entries(templates).find(([, path]) => path === component)![0];

export async function compileAssets(revision: string) {
  const virtual = resolve(project, '__virtual__');
  const assets: Record<string, string> = {};
  const files: Record<string, string> = {};
  const modules = new Map<string, Set<string>>();
  for await (const file of new Bun.Glob('src/**/*.tsx').scan(project)) {
    const filename = resolve(project, file);
    const code = compile(await Bun.file(filename).text(), filename, 'dom');
    files[filename] = code;
    for (const match of code.matchAll(/import\s+(?:([\w$]+)\s*,?\s*)?(?:\{([^}]+)\}\s*)?from\s*['"]([^'"]+)['"]/g)) {
      const path = match[3];
      if (path.startsWith('.') || path.startsWith('/')) continue;
      const names = modules.get(path) || new Set<string>();
      if (match[1]) names.add('default');
      for (const binding of (match[2] || '').split(',')) {
        const name = binding.trim().split(/\s+as\s+/)[0];
        if (name) names.add(name);
      }
      modules.set(path, names);
    }
  }
  const aliases = new Map([...modules].sort(([a], [b]) => a.localeCompare(b)).map(([path, names], index) => [
    path, [...names].sort().map((name) => ({ name, alias: `v${index}_${name}` })),
  ]));
  const vendor = `/_shared/vendor.${revision}.js`;
  const ui = `/_shared/ui.${revision}.js`;
  const dependencies: Bun.BunPlugin = { name: 'vendor', setup(build) {
    build.onResolve({ filter: /^[^./]/ }, ({ path }) => {
      if (!aliases.has(path)) throw new Error(`Unregistered browser dependency: ${path}`);
      return { path, namespace: 'vendor' };
    });
    build.onLoad({ filter: /.*/, namespace: 'vendor' }, ({ path }) => ({ loader: 'js',
      contents: `export { ${aliases.get(path)!.map(({ name, alias }) => `${alias} as ${name}`).join(', ')} } from ${JSON.stringify(vendor)};`,
    }));
  } };
  const boundary: Bun.BunPlugin = { name: 'ui', setup(build) {
    build.onResolve({ filter: /^\./ }, ({ path, importer }) => {
      const resolved = Bun.resolveSync(path, resolve(importer, '..'));
      if ([resolve(project, 'src/components/index.ts'), resolve(project, 'src/navigation.tsx')].includes(resolved)) return { path: ui, external: true };
    });
  } };
  async function bundle(name: string, source: string, plugins: Bun.BunPlugin[] = []) {
    const entry = `${virtual}/${name}.ts`;
    const result = await Bun.build({
      entrypoints: [entry], files: { ...files, [entry]: source }, root: project,
      target: 'browser', format: 'esm', minify: true, splitting: false, external: [vendor, ui],
      define: { 'process.env.NODE_ENV': JSON.stringify('production'), BUILD_REVISION: JSON.stringify(revision) }, plugins,
    });
    if (!result.success) throw new AggregateError(result.logs, `Failed to bundle ${name}`);
    if (result.outputs.length !== 1) throw new Error(`Unexpected extra outputs for ${name}`);
    assets[`/_shared/${name}.${revision}.js`] = await result.outputs[0].text();
  }
  await bundle('vendor', [...aliases].map(([path, names]) => `export { ${names.map(({ name, alias }) => `${name} as ${alias}`).join(', ')} } from ${JSON.stringify(path)};`).join('\n'));
  await bundle('ui', `export * from ${JSON.stringify(resolve(project, 'src/components/index.ts'))};`, [dependencies]);
  await bundle('runtime', `export { boot } from ${JSON.stringify(resolve(project, 'src/client.tsx'))};`, [dependencies, boundary]);
  for (const [name, component] of Object.entries(templates)) await bundle(name, `export { default } from ${JSON.stringify(resolve(project, `src/pages/${component}.tsx`))};`, [dependencies, boundary]);
  const css = Bun.spawn(['bun', 'x', '--no-install', '@tailwindcss/cli', '-i', 'src/App.css', '--minify'], { cwd: project, stdout: 'pipe', stderr: 'pipe' });
  const [style, errors, exitCode] = await Promise.all([new Response(css.stdout).text(), new Response(css.stderr).text(), css.exited]);
  if (exitCode) throw new Error(errors);
  assets[`/style.${revision}.css`] = style;
  return assets;
}

export function pageModule(route: Route, meta: Meta[], revision: string) {
  return `import { boot } from "/_shared/runtime.${revision}.js";
import component from "/_shared/${templateName(route.component)}.${revision}.js";
export const page = { path: ${JSON.stringify(route.path)}, meta: ${JSON.stringify(meta)}, component, data: ${JSON.stringify(route.data) ?? 'undefined'} };
boot(page);`;
}

export async function renderPage(route: Route, revision: string) {
  const module = await import(resolve(project, `src/pages/${route.component}.tsx`));
  const meta: Meta[] = route.meta || module.meta?.({ data: route.metaData }) || [{ title: '털겜번역단' }];
  const page: Page = { path: route.path, meta, component: module.default, data: route.data };
  const { PageView } = await import('../src/client');
  const body = renderToString(() => PageView({ page, url: new URL(page.path, 'https://kemovn.cc') }));
  const escape = (value: string) => Bun.escapeHTML(value);
  const metadata = meta.map((item) => 'title' in item ? `<title>${escape(item.title)}</title>`
    : `<meta data-page-meta ${item.name.startsWith('og:') ? 'property' : 'name'}="${escape(item.name)}" content="${escape(item.content)}">`).join('');
  const head = `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${page.path === '/404' ? 'noindex' : 'index,follow'}">${metadata}<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/style.${revision}.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" crossorigin="anonymous">${generateHydrationScript()}</head>`;
  const script = `${page.path === '/' ? '' : page.path}/page.${revision}.js`;
  const theme = `try{document.documentElement.classList.toggle('dark',localStorage.getItem('dark')===null?matchMedia('(prefers-color-scheme: dark)').matches:localStorage.getItem('dark')==='1')}catch{}`;
  const html = `<!doctype html><html lang="ko">${head}<body><script>${theme}</script><div id="app">${body}</div><script type="module" src="${script}"></script></body></html>`;
  return { html, script, javascript: pageModule(route, meta, revision) };
}

if (import.meta.main) {
  const revision = commitRevision();
  const pages = await routes();
  const assets = await compileAssets(revision);
  await rm(out, { recursive: true, force: true });
  await cp(resolve(project, 'public'), out, { recursive: true });
  for (const [path, text] of Object.entries(assets)) await Bun.write(resolve(out, `.${path}`), text);
  for (const route of pages) {
    const page = await renderPage(route, revision);
    await Bun.write(resolve(out, `.${page.script}`), page.javascript);
    await Bun.write(route.path === '/404' ? resolve(out, '404.html') : resolve(out, `.${route.path}/index.html`), page.html);
  }
  const history = Bun.spawnSync(['git', 'log', '--format=COMMIT:%cI', '--name-only', '--', 'games', 'guides'], { cwd: project });
  if (history.exitCode !== 0) throw new Error('Cannot read content modification dates');
  const mtimes = new Map<string, string>();
  let date = '';
  for (const line of history.stdout.toString().split('\n')) {
    if (line.startsWith('COMMIT:')) date = line.slice(7);
    else if ((line.startsWith('games/') || line.startsWith('guides/')) && !mtimes.has(line)) mtimes.set(line, date);
  }
  const latest = [...mtimes.values()].sort().at(-1);
  const sitemap = pages.filter(({ path }) => path !== '/404').map(({ path, source }) => {
    const modified = source ? mtimes.get(source) : latest;
    return `<url><loc>https://kemovn.cc${path === '/' ? '' : `${path}/`}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`;
  });
  await Bun.write(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.join('')}</urlset>`);
  console.log(`Built ${pages.length} pages (${revision})`);
}
