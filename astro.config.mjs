// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 部署后把 site 换成自己的正式域名（影响 sitemap / canonical / OG 的绝对地址）
export default defineConfig({
  site: 'https://zlcheng.pages.dev',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
  devToolbar: { enabled: false },
});
