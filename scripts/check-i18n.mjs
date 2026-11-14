/**
 * 英文站自检：构建完后跑 `npm run check:i18n`。
 *
 * 检查 dist/en 下的三件事：
 *   1. 可见文本与 alt/aria/title 里没有中文（语言切换按钮上的「中文」除外）；
 *   2. 站内链接都带 /en 前缀（语言切换、/media、/_astro 除外）；
 *   3. hreflang 三件套齐全，且 en 指向自己、zh-CN 指向中文同页。
 * 有任何一条不过就以退出码 1 结束，适合挂进 CI。
 * 站点地址从 astro.config.mjs 的 site 读取，换域名不用改这个脚本。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = 'dist';

/** 站点根地址：读 astro.config.mjs，避免脚本里再写一份域名 */
const site = readFileSync('astro.config.mjs', 'utf8').match(/site:\s*'([^']+)'/)?.[1];
if (!site) {
  console.error('✗ 读不到 astro.config.mjs 里的 site，自检中止');
  process.exit(1);
}
const siteOrigin = site.replace(/\/+$/, '');
const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\u3000-\u303f\uff01-\uff60]/g;
const HAS_CJK = /[\u3400-\u4dbf\u4e00-\u9fff\u3000-\u303f\uff01-\uff60]/;

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
};

const problems = [];
const report = (file, kind, detail) => problems.push(`${kind} ${file}  ${detail}`);

for (const file of walk(join(root, 'en'))) {
  const rel = relative(root, file).split(sep).join('/');
  const html = readFileSync(file, 'utf8');

  // 跳转页（例如 show_notes: false 时的 /en/notes）只输出 meta refresh，跳过
  if (/http-equiv="refresh"/.test(html)) continue;

  // 语言切换链接（带 hreflang）上的「中文」是唯一允许出现的中文
  const body = html.replace(/<a\b[^>]*hreflang="[^"]*"[^>]*>[\s\S]*?<\/a>/g, ' ');

  const text = body
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]*>/g, ' ');
  const cjk = [...new Set([...text.matchAll(CJK)].map((m) => m[0]))];
  if (cjk.length) report(rel, '[中文文本]', cjk.join(''));

  const attrs = [...body.matchAll(/\s(alt|aria-label|title|content)="([^"]*)"/g)].filter((m) =>
    HAS_CJK.test(m[2])
  );
  if (attrs.length) report(rel, '[中文属性]', attrs.map((m) => `${m[1]}=${m[2].slice(0, 40)}`).join(' | '));

  const hrefs = [...html.matchAll(/<a\b[^>]*>/g)]
    .filter((m) => !/\shreflang=/.test(m[0]))
    .map((m) => /\shref="([^"]+)"/.exec(m[0])?.[1])
    .filter(
      (h) =>
        h &&
        h.startsWith('/') &&
        !h.startsWith('/en') &&
        !h.startsWith('//') &&
        !/^\/(media|_astro|favicon)/.test(h)
    );
  if (hrefs.length) report(rel, '[站内链接缺 /en]', [...new Set(hrefs)].join(' '));

  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  const langs = alternates.map((m) => m[1]).sort().join(',');
  if (langs !== 'en,x-default,zh-CN') {
    report(rel, '[hreflang 不全]', langs || '(无)');
  } else {
    const map = Object.fromEntries(alternates.map((m) => [m[1], m[2]]));
    const self = `${siteOrigin}/${rel.replace(/index\.html$/, '')}`;
    if (map.en !== self) report(rel, '[hreflang en]', `en=${map.en} 期望=${self}`);
    if (map['zh-CN'].includes('/en/')) report(rel, '[hreflang zh-CN]', map['zh-CN']);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n✗ ${problems.length} 处需要修`);
  process.exit(1);
}
console.log('✓ 英文站自检通过：无中文残留、站内链接带 /en、hreflang 配对正常');
