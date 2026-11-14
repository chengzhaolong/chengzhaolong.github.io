// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 部署在 GitHub Pages 用户站：仓库名就是 chengzhaolong.github.io，站点落在根域，
// 所以不需要 base（换成项目站 /<repo>/ 才需要，并要给所有站内链接和 /media/* 手动加前缀）。
// site 决定 sitemap / canonical / OG / hreflang 的绝对地址；换自定义域名时只改这一行。
export default defineConfig({
  site: 'https://chengzhaolong.github.io',
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
