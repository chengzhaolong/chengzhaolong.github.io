/**
 * 中英路由工具：语言判定、同页互跳、站内链接加语言前缀。
 * 英文站是中文站的镜像（页面结构完全一致），区别只是 URL 多一层 /en。
 */

export type Lang = 'zh' | 'en';

/**
 * 已经做了英文镜像的路径（不带 /en 前缀）。
 * 新增英文页时在这里登记，语言切换才能停在“同一页”而不是退回首页。
 */
const MIRRORED = [
  '/',
  '/about',
  '/publications',
  '/software',
  '/software/cuspic',
  '/software/cuttinglab',
  '/notes',
];

/** 去掉结尾斜杠（根路径保留为 /） */
const norm = (path: string) => {
  const p = path.replace(/\/+$/, '');
  return p === '' ? '/' : p;
};

export const langFromPath = (pathname: string): Lang => {
  const p = norm(pathname);
  return p === '/en' || p.startsWith('/en/') ? 'en' : 'zh';
};

/** 去掉 /en 前缀，得到对应的中文路径 */
export const zhPath = (pathname: string): string => {
  const p = norm(pathname);
  if (p === '/en') return '/';
  if (p.startsWith('/en/')) return p.slice(3);
  return p;
};

/** 站内链接按语言加前缀；外链、mailto、锚点、public 资源原样返回 */
export const withLang = (href: string, lang: Lang): string => {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (lang === 'zh') return href;
  const p = norm(href);
  return p === '/' ? '/en/' : `/en${p}`;
};

/** 语言切换目标：有镜像页面就落到同一页，没有则回目标语言首页 */
export const counterpartPath = (pathname: string, target: Lang): string => {
  const zh = zhPath(pathname);
  if (!MIRRORED.includes(zh)) return target === 'en' ? '/en/' : '/';
  // 站点按目录生成（trailingSlash: ignore），这里统一带斜杠，与 canonical 一致
  const slashed = zh === '/' ? '/' : `${zh}/`;
  if (target === 'zh') return slashed;
  return zh === '/' ? '/en/' : `/en${slashed}`;
};

/** 导航高亮：首页只认精确匹配，其余认子路径（/software/cuspic 会亮「软件」） */
export const isActive = (pathname: string, href: string): boolean => {
  const p = norm(pathname);
  const h = norm(href);
  const isHome = h === '/' || h === '/en';
  return isHome ? p === h : p === h || p.startsWith(`${h}/`);
};
