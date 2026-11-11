# 成朝龙 · 个人学术主页

计算力学方向（大变形热力耦合 / FEM–MPM 耦合 / 高性能计算）的个人主页，同时作为
**cuspic 求解器**与 **Cusper CuttingLab** 软件的展示页。

- 纯静态输出，无框架运行时、无追踪脚本，首屏无 JS 也能读正文
- 中文为主（`/`），英文简版在 `/en/`
- 内容与样式分离：改 YAML / MDX 就能更新全站，不用碰页面代码

---

## 1. 技术栈

| 项 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | **Astro 7**（static，TS strict） | 零 JS 默认，岛式脚本只在需要时加载 |
| 内容 | Content Collections + `file()` / `glob()` loader | 论文、软件是 YAML；研究方向是 MDX |
| 样式 | 原生 CSS + CSS 变量（`src/styles/global.css`） | 无 Tailwind，改 token 即换风格 |
| 字体 | `@fontsource-variable` 自托管（Inter / Source Serif 4 / JetBrains Mono） | 拉丁子集按 `unicode-range` 懒加载；中文走系统字体栈 |
| 图片 | `astro:assets`（sharp） | 真实图片可自动生成多尺寸 srcset |
| 站点地图 | `@astrojs/sitemap` | 构建时自动生成 |

## 2. 目录结构

```
.
├─ astro.config.mjs          # site / 集成 / 代码高亮
├─ public/                   # 原样复制的静态资源
│  ├─ favicon.svg
│  ├─ og-image.svg / .png    # 社交分享图（改完 svg 后 npm run og 重新生成 png）
│  └─ media/                 # 视频、截图、云图放这里
├─ scripts/make-og.mjs       # svg → png
├─ src/
│  ├─ content.config.ts      # 内容集合的 schema（字段校验）
│  ├─ content/research/      # 研究方向：一个方向一个 .mdx
│  ├─ data/
│  │  ├─ profile.yml         # 个人信息（姓名/单位/邮箱/简介/统计数字）
│  │  ├─ publications.yml    # 论文列表
│  │  └─ software.yml        # 软件条目（cuspic / cuttinglab）
│  ├─ components/            # Nav / Footer / FigureCard / VideoCard / PubItem …
│  ├─ layouts/Base.astro     # <head>、SEO、导航、页脚、灯箱、入场动效
│  ├─ pages/
│  │  ├─ index.astro         # 首页
│  │  ├─ about.astro
│  │  ├─ publications.astro
│  │  ├─ research/index.astro + [slug].astro
│  │  ├─ software/index.astro + [slug].astro
│  │  ├─ en/index.astro      # 英文单页
│  │  └─ 404.astro
│  └─ styles/global.css      # 设计系统（唯一 CSS 入口）
└─ dist/                     # 构建产物（部署这个目录）
```

## 3. 本地开发

```bash
npm install          # 国内如果卡住：npm install --registry=https://registry.npmmirror.com
npm run dev          # http://localhost:4321
npm run build        # 产物在 dist/
npm run preview      # 本地预览构建结果
npm run check        # astro check（TS / 模板类型检查）
npm run og           # 把 public/og-image.svg 转成 1200×630 的 png
```

> 本项目依赖安装时用了 npmmirror 源，`package-lock.json` 里的 `resolved` 指向该镜像。
> 若在 Cloudflare 上构建失败，把 `package-lock.json` 删掉重新 `npm install` 即可。

## 4. 改内容（不用碰代码）

### 4.1 个人信息 — `src/data/profile.yml`

| 字段 | 说明 |
| --- | --- |
| `demo` | `true` 时论文页会显示「示例数据」提示。全部换成真实内容后改为 `false` |
| `name` / `name_en` / `latin` | 中文名 / 英文名 / 全大写英文名（页脚、导航用） |
| `title` / `title_en` | 身份，如「计算力学方向 直博生」 |
| `affiliation` / `affiliation_en` | 单位 / 学院 / 实验室（带〔〕的是占位，务必替换） |
| `email` | 全站的联系入口都用它 |
| `tagline_zh` / `tagline_en` | 首屏一句话 |
| `intro_zh` / `intro_en` | 简介段落；用 `|-` 多行，空行分段 |
| `interests` | 关键词，首页与 about 自动渲染 |
| `stats` | 首页三个数字（`num` / `unit` / `label`） |
| `links` | `scholar` / `orcid` / `github` / `researchgate` / `bilibili` / `cv`，**留空则不显示** |

### 4.2 加一篇论文 — `src/data/publications.yml`

复制一段，改字段即可；页面按 `year` 自动分组、倒序排列，编号自动生成。

```yaml
- id: cheng2026-xxx            # 唯一，用于锚点 #pub-cheng2026-xxx
  title: 英文原题（学术规范：不翻译题名）
  title_zh: 中文译名（可选，显示为副标题）
  authors: [Chaolong Cheng, 〔合作者〕]   # 本人姓名会被自动加粗+下划线
  venue: Computer Methods in Applied Mechanics and Engineering
  venue_short: CMAME          # 可选，缩写
  year: 2026
  type: journal               # journal | conference | preprint
  highlight: true             # 首页「代表性论文」优先取
  status: in press            # 可选，显示为角标
  links: { pdf: '', doi: '', code: '', data: '' }   # 留空不显示徽章
  bibtex: |
    @article{...}
  tags: [FEM–MPM, 切削]        # 用于「研究方向」页的相关论文联动
```

要点：
- `tags` 与研究方向的 `tags` 有交集时，该论文会自动出现在对应研究方向的「相关论文」里。
- `bibtex` 会渲染成「复制 BibTeX」按钮；不要的话删掉该字段即可。
- `doi` 可以只写 `10.xxxx/xxxxx`，页面会自动补 `https://doi.org/`。

### 4.3 软件 — `src/data/software.yml`

两个条目：`cuspic`（求解器）与 `cuttinglab`（软件）。字段：

- `kicker` / `tagline` / `summary`：卡片与详情页首屏文案
- `version` / `status` / `license`：版本、状态、许可（会以徽章显示）
- `features[]`：`title` + `text`，详情页两列卡片，首页只取前 3 个 `title`
- `specs[]`：`k` + `v`，详情页右侧「技术规格」表
- `links[]`：`label` / `href` / `variant`（`primary` 实心、`ghost` 描边）

详情页路由由 id 决定：`/software/cuspic`、`/software/cuttinglab`。
若要加第三个软件，直接在 YAML 末尾追加一个条目即可，列表与详情页会自动生成。

### 4.4 研究方向 — `src/content/research/*.mdx`

frontmatter：

```yaml
title: 大变形热力耦合          # 中文标题（必填）
title_en: Large-deformation thermo-mechanical coupling   # 英文标题
summary: 一句话概述（首页卡片）
summary_en: 一句话英文概述（/en/ 用）
order: 1                      # 排序
tags: [热力耦合, 大变形]       # 与论文 tags 联动
placeholder: a                # 占位云图配色：a / b / c
software: [cuspic]            # 关联软件 id
```

正文就是普通 Markdown。要插图，在正文里用组件（MDX 需要先 `import`）：

```mdx
import FigureCard from '../../components/FigureCard.astro';

<FigureCard
  src="/media/figures/temp-field.png"
  alt="切削温度场云图"
  meta="Fig. 1"
  caption="v = 120 m/min，最高温出现在刀–屑接触区。"
/>
```

新增一个方向 = 新建一个 `.mdx`，`order` 决定顺序，导航与本页目录自动更新。

### 4.5 图片与视频

**图片（`FigureCard`）** 支持两种写法：

```astro
<!-- 1) 放在 public/media/ 下，直接用路径（简单，不做优化） -->
<FigureCard src="/media/figures/peeq.png" alt="等效塑性应变" caption="..." />

<!-- 2) 让 Astro 自动优化：把图放 src/assets/，import 后传入（会生成 srcset） -->
---
import { Image } from 'astro:assets';
import peeq from '../assets/figures/peeq.png';
---
<FigureCard src={peeq} alt="等效塑性应变" caption="..." />
```

不传 `src` 时会渲染一个「待替换」的占位云图——所有占位都会明确标出，方便一眼找出待补位置。

**视频（`VideoCard`）**：`src` 填 mp4 路径，`poster` 填首帧图。

```astro
<VideoCard src="/media/videos/cutting.mp4" poster="/media/videos/cutting.jpg"
           alt="切屑形成过程" badge="Simulation" caption="正交切削，v = 120 m/min" />
```

体积控制（重要）：
- 循环短片：720p、5–10 s、**3 MB 以内**，优先 H.264 mp4（兼容性最好）
- 更长/更高清的视频**不要进仓库**：传到 B 站或对象存储，页面里用链接或嵌入播放器
- 大文件天然会拖慢构建与部署，Cloudflare Pages 单文件上限 25 MB

## 5. 样式怎么改

所有设计变量在 `src/styles/global.css` 顶部 `:root` 里：

```css
--bg: #fafaf9;        /* 浅色正文区底色 */
--media-bg: #0a0a0d;  /* 深色媒体区底色 */
--accent: #21918c;    /* 强调色（viridis 青） */
--accent-warm-bright: #faba39;  /* 深底上的琥珀 */
--grad-data: linear-gradient(...);  /* 数据色带：分隔线、进度条、hover 线 */
--f-display / --f-sans / --f-mono   /* 三套字体栈 */
```

版式节奏靠「浅色正文 band ↔ 深色媒体 band」交替：浅色区读文字，深色区放云图、动画、性能数据。
`Section.astro` 的 `tone="media"` 就是一段深色区，也可以直接写 `<section class="media-band">`。

## 6. 部署（Cloudflare Pages）

1. 推到 GitHub：`git init` → 建仓库 → `git remote add origin ...` → `git push -u origin main`
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → 选仓库
3. 构建设置：
   - Framework preset：**Astro**
   - Build command：`npm run build`
   - Build output directory：`dist`
   - 环境变量：`NODE_VERSION = 24`（Astro 7 需要 Node ≥ 22.12）
4. 先拿到 `xxx.pages.dev` 域名；绑定自定义域名后再改 `astro.config.mjs` 的 `site`（影响 canonical / sitemap / OG 绝对地址）。

部署完记得做这四件事：
- [ ] 改 `astro.config.mjs` 里的 `site`
- [ ] `npm run og` 重新生成分享图（图上写的是姓名与方向）
- [ ] 把 `profile.yml` 的 `demo` 改为 `false`
- [ ] 在 Google Search Console 提交 `https://你的域名/sitemap-index.xml`

> 中文字体：本站中文走系统字体栈（PingFang / 微软雅黑 / 思源），**不下载任何中文字体文件**，
> 这是国内访问速度能接受的关键。英文只自托管拉丁子集（约 60–80 KB，按需加载）。

## 7. 素材替换清单

占位内容在页面上都有明确标注（「待替换」/〔 〕），按下面顺序替换即可：

- [ ] `profile.yml`：单位、邮箱、`links`（Scholar / ORCID / GitHub / B站）
- [ ] 个人照片 → `public/media/portrait.jpg`，然后 `about.astro` 里 `FigureCard` 填 `src` 并删掉 `placeholderLabel`
- [ ] `publications.yml`：换成真实论文（含 BibTeX）
- [ ] 首页媒体区：切屑动画 mp4 + 温度场 / 塑性应变 / 力曲线 3 张图
- [ ] 4 个研究方向：把各页 `FigureCard` 的 `src` 填上真实结果图；`profile.yml` / MDX 里〔待填〕的技术参数补齐
- [ ] `software.yml`：版本、许可、平台、输出格式
- [ ] `software/[slug].astro` 里 `perf` 数组换成实测加速比，算例表里的「耗时」补上
- [ ] `public/og-image.svg` 的文案（改完跑 `npm run og`）

## 8. 常见问题

**npm install 很慢或超时？**
用镜像：`npm install --registry=https://registry.npmmirror.com`。若之后 Cloudflare 构建报找不到包，
删掉 `package-lock.json` 后重新安装（生成指向官方源的锁文件）。

**`sharp` 装不上？**
它是 `astro:assets` 的图片优化依赖。`npm install sharp --registry=https://registry.npmmirror.com` 即可；
只用占位图（不做图片优化）时，缺 `sharp` 也不影响构建。

**中文标题在分享卡片里是乱码？**
`og-image.png` 是 sharp 调 librsvg 渲染的，依赖系统里有中文字体。Windows/macOS 默认可用；
Linux CI 里若乱码，装 `fonts-noto-cjk` 后重跑 `npm run og`。

**首页/详情页的「待替换」占位图要删掉吗？**
不用删组件，只要给 `FigureCard` / `VideoCard` 传 `src`，占位样式会自动消失。

**想改配色？**
只改 `:root` 里的 `--accent` / `--accent-warm-bright` / `--grad-data` 三处，全站强调色、色带、
hover 线会一起变。`--grad-data` 目前是 viridis→turbo 的近似采样，和云图色标呼应。

## 9. 可访问性与性能

- 语义结构：`header/nav/main/section/figure/figcaption`，每页唯一 `h1`
- 键盘可达：`skip-link`、`:focus-visible` 描边、灯箱用原生 `<dialog>`（Esc 可关）
- 动效尊重 `prefers-reduced-motion`；无 JS 时 `[data-reveal]` 内容直接可见
- 图片默认 `loading="lazy" decoding="async"`，首屏 hero 用 `fetchpriority="high"`
- 媒体区对比度：深底 `#0a0a0d` 上的正文用 `#c3c3cb`（≥ 7:1），小字用 `#a1a1aa`
