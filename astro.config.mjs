// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 部署后把 site 换成自己的正式域名（影响 sitemap / canonical / OG 的绝对地址）
export default defineConfig({
  site: 'https://zlcheng.pages.dev',
  integrations: [
    mdx(),
    sitemap({
      // 中英双向 hreflang：中文是默认语言（无前缀），英文在 /en 下
      i18n: {
        defaultLocale: 'zh-CN',
        locales: { 'zh-CN': 'zh-CN', en: 'en' },
      },
      // 笔记模块暂未开放（profile.yml → show_notes: false）：不收录 /notes。
      // 写好第一篇笔记后删掉这个 filter。
      filter: (page) => !/\/notes(\/|$)/.test(page),
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
  devToolbar: { enabled: false },
});
