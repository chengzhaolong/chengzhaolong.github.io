import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 笔记（技术写作）：一篇一个 mdx，放在 src/content/notes/。
 * 文件名即 URL：/notes/<文件名>。写完一篇放进目录就会自动出现在列表里。
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    /** 一句话说明这篇回答什么问题（列表页与 meta description 都取它） */
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    /** 草稿：不进列表、不生成路由 */
    draft: z.boolean().default(false),
  }),
});

/** 论文：改 src/data/publications.yml 即可，页面自动按年份分组 */
const publications = defineCollection({
  loader: file('./src/data/publications.yml'),
  schema: z.object({
    title: z.string(),
    /** 中文译名，可选；列表里作为副标题显示 */
    title_zh: z.string().optional(),
    authors: z.array(z.string()),
    venue: z.string(),
    venue_short: z.string().optional(),
    year: z.number(),
    type: z.enum(['journal', 'conference', 'preprint', 'patent']).default('journal'),
    /** 置顶：首页「最新论文」优先取这些 */
    highlight: z.boolean().default(false),
    /** 例如 "in press" / "under review" */
    status: z.string().optional(),
    links: z
      .object({
        pdf: z.string().optional(),
        doi: z.string().optional(),
        code: z.string().optional(),
        data: z.string().optional(),
      })
      .default({}),
    bibtex: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

/** 软件：cuspic 求解器 + Cusper CuttingLab */
const software = defineCollection({
  loader: file('./src/data/software.yml'),
  schema: z.object({
    name: z.string(),
    name_zh: z.string(),
    kicker: z.string(),
    tagline: z.string(),
    summary: z.string(),
    version: z.string().optional(),
    status: z.string().optional(),
    license: z.string().optional(),
    /** 卡片底部的一行技术规格（首页/总览卡用） */
    spec_line: z.string().optional(),
    features: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    specs: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(['primary', 'ghost']).default('ghost'),
        })
      )
      .default([]),
  }),
});

/** 简历：改 src/data/cv.yml 即可，/about 页自动渲染 */
const cv = defineCollection({
  loader: file('./src/data/cv.yml'),
  schema: z.object({
    /** 教育背景：一行「学校，专业，学位」+ 右侧日期，points 是下面的项目符号 */
    education: z
      .array(
        z
          .object({
            period: z.string(),
            school: z.string(),
            major: z.string().optional(),
            degree: z.string(),
            points: z.array(z.string()).default([]),
          })
          .strict()
      )
      .default([]),
    /** 项目经历：一行「项目名 + 角色」+ 右侧日期，points 是下面的事项 */
    projects: z
      .array(
        z
          .object({
            period: z.string(),
            name: z.string(),
            role: z.string().optional(),
            points: z.array(z.string()).default([]),
          })
          .strict()
      )
      .default([]),
    /** 获奖与荣誉 */
    awards: z
      .array(
        z
          .object({
            period: z.string(),
            title: z.string(),
            note: z.string().optional(),
          })
          .strict()
      )
      .default([]),
    /** 工具与技能：group 一栏一个标签，items 一行文字 */
    skills: z
      .array(z.object({ group: z.string(), items: z.string() }).strict())
      .default([]),
  }),
});

const profile = defineCollection({
  loader: file('./src/data/profile.yml'),
  schema: z.object({
    demo: z.boolean().default(false),
    name: z.string(),
    name_en: z.string(),
    latin: z.string(),
    title: z.string(),
    title_en: z.string(),
    /** 英文页首屏身份行的短标签；不填则用 title_en */
    role_short_en: z.string().optional(),
    /** 浏览器标题后缀，写技术定位而不是头衔；不填则退回 title */
    site_suffix: z.string().optional(),
    affiliation: z.string(),
    affiliation_en: z.string(),
    location: z.string(),
    /** 首屏小照片（3:4 竖图）；不给则用 /media/portrait.svg 占位 */
    photo: z.string().optional(),
    email: z.string(),
    tagline_zh: z.string(),
    tagline_en: z.string(),
    intro_zh: z.string(),
    intro_en: z.string(),
    interests: z.array(z.string()).default([]),
    /** 首页算例区的实测指标 */
    metrics: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    links: z
      .object({
        scholar: z.string().optional(),
        orcid: z.string().optional(),
        github: z.string().optional(),
        researchgate: z.string().optional(),
        bilibili: z.string().optional(),
        cv: z.string().optional(),
      })
      .default({}),
  }),
});

export const collections = { notes, publications, software, cv, profile };
