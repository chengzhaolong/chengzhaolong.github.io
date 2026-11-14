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

/** 软件：CUSPIC 求解器 + CUSPER CuttingLab */
const software = defineCollection({
  loader: file('./src/data/software.yml'),
  schema: z.object({
    /** 产品名：卡片标题、详情页 h1 与 <title>，写短名不带后缀（CUSPIC / CUSPER CuttingLab） */
    name: z.string(),
    kicker: z.string(),
    tagline: z.string(),
    summary: z.string(),
    version: z.string().optional(),
    status: z.string().optional(),
    /** 卡片底部的一行技术规格（首页/总览卡用） */
    spec_line: z.string().optional(),
    /** 首屏标签：能力关键词，一行小徽章 */
    chips: z.array(z.string()).default([]),
    features: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    specs: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    /** 能力矩阵：只在 /software 总览里用，一行一类 */
    matrix: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    /**
     * 案例位：第一条整行展示，其余两条并排。
     * video 留空即渲染「待替换」占位（见 VideoCard），后面补 mp4 路径即可。
     */
    cases: z
      .array(
        z.object({
          title: z.string(),
          caption: z.string().optional(),
          meta: z.string().optional(),
          /** mp4 路径（public 下），留空显示占位 */
          video: z.string().optional(),
          /** 视频首帧图 */
          poster: z.string().optional(),
          /** 静态截图（给图不给视频时用） */
          image: z.string().optional(),
          badge: z.string().optional(),
        })
      )
      .default([]),
    /**
     * 试用申请：只有 CuttingLab 有。
     * open=false 时页面写「试用即将开启」，true 时写「申请试用」，其余文案共用。
     */
    application: z
      .object({
        open: z.boolean().default(false),
        email: z.string(),
        subject: z.string(),
        lead: z.string().optional(),
        /** 必填项：按钮上方逐条列出，也用来生成邮件模板 */
        fields: z.array(z.object({ k: z.string(), hint: z.string().optional() })).default([]),
        /** 邮件模板里补充的可选项 */
        extra_lines: z.array(z.string()).default([]),
        note: z.string().optional(),
        /** 灰色小字里的「怎么查物理 MAC」三行 */
        mac_help: z.array(z.string()).default([]),
      })
      .optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(['primary', 'ghost']).default('ghost'),
          /** true 时链接带 download 属性（PDF 直接存盘，不在浏览器里打开） */
          download: z.boolean().default(false),
        })
      )
      .default([]),
  }),
});

/** CUSPIC 用户手册：元信息 + 章节索引（手册本体在 public/media/docs/） */
const manual = defineCollection({
  loader: file('./src/data/cuspic-manual.yml'),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    version: z.string(),
    /** 手册自身的文档版本号，和软件版本不是一回事 */
    doc_version: z.string().optional(),
    date: z.string().optional(),
    pages: z.number(),
    /** 相对 public 的路径，例如 /media/docs/cuspic-manual-v3.0.0.pdf */
    file: z.string(),
    size: z.string().optional(),
    abstract: z.string().optional(),
    /** 章节：page 是 PDF 物理页，用于 file#page=N 深链 */
    chapters: z
      .array(
        z.object({
          no: z.string(),
          title: z.string(),
          page: z.number(),
          summary: z.string().optional(),
          keywords: z.array(z.string()).default([]),
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
    links: z
      .object({
        scholar: z.string().optional(),
        orcid: z.string().optional(),
        github: z.string().optional(),
        researchgate: z.string().optional(),
        bilibili: z.string().optional(),
        cv: z.string().optional(),
        /** CUSPIC 项目主页：只在简历 PDF 里显示 */
        cuspic: z.string().optional(),
      })
      .default({}),
  }),
});

export const collections = { notes, publications, software, cv, profile, manual };
