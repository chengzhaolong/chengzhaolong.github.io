/**
 * 数据本地化：中文主体 + YAML 里的 en 覆盖块（缺项回退中文）。
 * 合并规则统一为「浅合并、数组整体替换」，不做逐项合并——避免中英数组错位。
 */
import type { CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

export type ProfileData = CollectionEntry<'profile'>['data'];
export type SoftwareData = CollectionEntry<'software'>['data'];
export type PublicationData = CollectionEntry<'publications'>['data'];
export type CvData = CollectionEntry<'cv'>['data'];
export type ManualData = CollectionEntry<'manual'>['data'];

/** en 块是主体字段的部分覆盖（schema 里就是 body.partial()） */
type EnBlock<T> = { [K in keyof T]?: T[K] };

/** 以中文主体为底，覆盖块里非 undefined 的键生效 */
export function mergeEn<T extends object>(base: T, en?: EnBlock<T>): T {
  if (!en) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(en)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

/** 去掉 en 块，避免它被当成内容渲染出来 */
function stripEn<T extends object>(data: T & { en?: unknown }): Omit<T, 'en'> {
  const copy = { ...data } as Record<string, unknown>;
  delete copy.en;
  return copy as Omit<T, 'en'>;
}

export const localizeSoftware = (data: SoftwareData, lang: Lang) =>
  lang === 'en' ? mergeEn(stripEn(data), data.en) : stripEn(data);

export const localizeCv = (data: CvData, lang: Lang) =>
  lang === 'en' ? mergeEn(stripEn(data), data.en) : stripEn(data);

export const localizeManual = (data: ManualData, lang: Lang) =>
  lang === 'en' ? mergeEn(stripEn(data), data.en) : stripEn(data);

/** 论文标题本身就是英文原题；英文侧只换期刊/状态的说明，并去掉中文译名副标题 */
export const localizePub = (data: PublicationData, lang: Lang) => {
  if (lang !== 'en') return data;
  return {
    ...stripEn(data),
    /** 英文页题名：中文题名（专利）必须给 title_en，否则会漏中文 */
    title: data.title_en ?? data.title,
    authors: data.authors_en ?? data.authors,
    venue: data.venue_en ?? data.venue,
    status: data.status_en ?? data.status,
    tags: data.tags_en ?? data.tags,
    /** 英文页不显示中文译名 */
    title_zh: undefined,
  };
};

/**
 * 个人信息：profile.yml 里已经是 *_zh / *_en 成对字段，
 * 这里统一成一个对象，页面不用到处写三元表达式。
 */
export const profileText = (p: ProfileData, lang: Lang) => {
  const en = lang === 'en';
  return {
    name: en ? p.name_en : p.name,
    latin: p.latin,
    title: en ? p.title_en : p.title,
    /** 英文页身份行的短标签 */
    roleShort: en ? (p.role_short_en ?? p.title_en) : p.title,
    affiliation: en ? p.affiliation_en : p.affiliation,
    location: en ? (p.location_en ?? p.location) : p.location,
    tagline: en ? p.tagline_en : p.tagline_zh,
    intro: en ? p.intro_en : p.intro_zh,
    interests: en ? (p.interests_en ?? p.interests) : p.interests,
    /** 浏览器标题后缀 */
    siteSuffix: en ? (p.site_suffix_en ?? p.title_en) : (p.site_suffix ?? p.title),
    email: p.email,
    photo: p.photo,
    links: p.links ?? {},
    showNotes: p.show_notes,
    demo: p.demo,
  };
};

/**
 * 简历 PDF 链接：中文页用 links.cv，英文页优先 links.cv_en、缺失时回退 cv。
 * 返回 undefined 表示不显示下载入口 —— 页脚、首页联系行、简历页首三处共用这一个判断。
 */
export const cvHref = (p: ProfileData, lang: Lang): string | undefined => {
  const links = p.links ?? {};
  return (lang === 'en' ? links.cv_en || links.cv : links.cv) || undefined;
};
