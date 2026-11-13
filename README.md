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
| 内容 | Content Collections + `file()` / `glob()` loader | 论文、软件、个人信息是 YAML；笔记是 MDX |
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
│  ├─ content/notes/         # 笔记：一篇一个 .mdx（文件名即 URL）
│  ├─ data/
│  │  ├─ profile.yml         # 个人信息（姓名/单位/邮箱/照片/简介/关键词）
│  │  ├─ cv.yml              # 简历（教育经历 / 研究经历 / 获奖 / 技能）
│  │  ├─ publications.yml    # 论文列表
│  │  └─ software.yml        # 软件条目（cuspic / cuttinglab）
│  ├─ components/            # Nav / Footer / FigureCard / VideoCard / PubItem …
│  ├─ layouts/Base.astro     # <head>、SEO、导航、页脚、灯箱、入场动效
│  ├─ pages/
│  │  ├─ index.astro         # 首页
│  │  ├─ about.astro
│  │  ├─ publications.astro
│  │  ├─ notes/index.astro + [slug].astro
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
| `title` / `title_en` | 学术身份，用于结构化数据（JSON-LD 的 `jobTitle`）与 `/about` |
| `role_short_en` | 英文页 `/en/` 身份行，如「CUSPIC author」；不填则用 `title_en` |
| `site_suffix` | 浏览器标题后缀，如「个人主页」；不填则用 `title` |
| `affiliation` / `affiliation_en` | 单位 / 学院 / 实验室（带〔〕的是占位，务必替换） |
| `email` | 全站的联系入口都用它 |
| `photo` | 首屏的小照片（3:4 竖图），放在 `public/media/` 下，填 `/media/portrait.jpg` |
| `tagline_zh` / `tagline_en` | 首屏一句话 |
| `intro_zh` / `intro_en` | 简介段落；用 `|-` 多行，空行分段 |
| `interests` | 关键词，首页与 about 自动渲染 |
| `metrics` | 预留：首页算例指标（`k` / `v`），当前模板未使用，可留空 |
| `links` | `scholar` / `orcid` / `github` / `researchgate` / `bilibili` / `cv`，**留空则不显示** |

#### 首页结构（`src/pages/index.astro`）

顺序固定为 5 段，改文案直接改页面里的字符串，改数据改 YAML/MDX：

1. **首屏（矮）**：`eyebrow` + 姓名 + 一句话 + 四个文本链接；右侧是 `profile.photo` 的小照片（点击进 `/about`）。`profile.name` 是唯一的 `h1`，不重复放身份行。
2. **简介 + 算例**：左栏 `intro_zh` + `interests` + 「完整介绍与简历 →」；右栏一个算例短片（`VideoCard`，16:9），下面一行 `metrics` 指标，最后一行小字「了解 cuspic 求解器 →」。
3. **自研工具**：深色区，自动读取 `software.yml`；卡片底部一行 `spec_line`。
4. **论文**：取 3 条（`highlight: true` 优先）。
5. **联系**：页面底部一行「联系」条；页脚只出现一次姓名。

「研究」模块已下线：首页只留首屏与导航入口，方法层面的长文统一写进 `/notes`（笔记）。

### 4.2 简历 — `src/data/cv.yml`

`/about` 的「教育经历 / 研究经历 / 获奖与荣誉 / 工具与技能」全部来自这一个文件。
每段是一个列表，**写在前面先显示**；某段不需要就写 `[]`（或删掉整段），页面上不会出现空标题。

```yaml
- id: main

  education:                      # 教育经历
    - period: 2022.09 — 至今       # 时间原样显示，想怎么写就怎么写
      degree: 博士研究生
      major: 计算力学              # 可省略
      school: 大连理工大学
      note: 导师：〔姓名〕          # 可省略

  experience:                     # 研究 / 工作经历，没有就 []
    - period: 2023.07 — 2023.09
      role: 研究助理
      org: 〔单位 / 课题组〕
      note: 〔一句话：做了什么、结果如何〕

  awards:                         # 获奖与荣誉，没有就 []
    - period: 2024
      title: 〔奖项 / 荣誉名称〕
      note: 〔可省略〕

  skills:                         # 工具与技能，一栏一行
    - group: 编程
      items: C++ / CUDA、Python
```

字段名是固定的：`period` / `degree` / `major` / `school` / `note`、`period` / `role` / `org` / `note`、
`period` / `title` / `note`、`group` / `items`。填错字段名会在 `npm run check` 里报错，不会静默丢数据。

简历 PDF 不放代码里：文件丢进 `public/media/docs/cv.pdf`，再把 `profile.yml` 的
`links.cv` 填成 `/media/docs/cv.pdf`，`/about` 侧栏就会出现「下载 CV（PDF）」按钮。

### 4.3 加一篇论文 — `src/data/publications.yml`

复制一段，改字段即可；页面按 `year` 自动分组、倒序排列，编号自动生成。

```yaml
- id: cheng2026-xxx            # 唯一，用于锚点 #pub-cheng2026-xxx
  title: 英文原题（学术规范：不翻译题名）
  title_zh: 中文译名（可选，显示为副标题）
  authors: [Chaolong Cheng, 〔合作者〕]   # 本人姓名会被自动加粗+下划线
  venue: Computer Methods in Applied Mechanics and Engineering
  venue_short: CMAME          # 可选，缩写
  year: 2026
  type: journal               # journal | conference | preprint | patent
  highlight: true             # 首页「代表性论文」优先取
  status: in press            # 可选，显示为角标
  links: { pdf: '', doi: '', code: '', data: '' }   # 留空不显示徽章
  bibtex: |
    @article{...}
  tags: [FEM–MPM, 切削]        # 便于检索，也与笔记/软件的标签呼应
```

要点：
- `tags` 只是检索用：首页、`/publications` 按年份分组展示，不做联动跳转。
- `bibtex` 会渲染成「复制 BibTeX」按钮；不要的话删掉该字段即可。
- `doi` 可以只写 `10.xxxx/xxxxx`，页面会自动补 `https://doi.org/`。

**专利**用同一套字段，把 `type` 写成 `patent` 即可（角标显示「专利」）。不想逐条列发明人时，`authors` 直接写专利权人（单位），完整发明人留在 `bibtex` 里：

```yaml
- id: zhang2026-patent-embedded-contact
  title: 一种用于多体接触问题的表面嵌入物质点方法
  authors: [大连理工大学, 中国核电工程有限公司]
  venue: 中国发明专利
  venue_short: CN121031225B   # 公告号，显示为「中国发明专利 (CN121031225B), 2026」
  year: 2026
  type: patent
  status: 已授权
  bibtex: |
    @patent{CN121031225B, ...}
```

### 4.4 软件 — `src/data/software.yml`

两个条目：`cuspic`（求解器）与 `cuttinglab`（软件）。字段：

- `kicker` / `tagline` / `summary`：卡片与详情页首屏文案
- `version` / `status` / `license`：版本、状态、许可（会以徽章显示）
- `spec_line`：首页卡片底部那一行等宽字体的技术规格，一句话，别超过 30 个字符
- `features[]`：`title` + `text`，详情页两列卡片，首页只取前 3 个 `title`
- `specs[]`：`k` + `v`，详情页右侧「技术规格」表
- `links[]`：`label` / `href` / `variant`（`primary` 实心、`ghost` 描边）

详情页路由由 id 决定：`/software/cuspic`、`/software/cuttinglab`。
若要加第三个软件，直接在 YAML 末尾追加一个条目即可，列表与详情页会自动生成。

### 4.5 写笔记 — `src/content/notes/*.mdx`

笔记 = 技术写作，回答「为什么这么做、试过什么、数对不对」。**写一篇 = 新建一个 `.mdx`**，
文件名就是 URL（`gpu-particle-loop.mdx` → `/notes/gpu-particle-loop`），不用改任何页面代码。

```mdx
---
title: 接触界面：嵌入拉格朗日表面，还是点–面罚函数？
summary: 一句话说明这篇回答什么问题（列表页与 meta description 都取它）
date: 2026-03-01
tags: [MPM, 接触算法]
draft: false          # true = 不进列表、不生成路由
---

正文用普通 Markdown；`##` 二级标题会自动进入右侧目录。
```

- 列表页 `/notes` 顶部是已发布文章，下面是页面里 `planned` 数组维护的「在写」选题；
  某条写完后，把对应条目从 `planned` 删掉即可。
- `src/content/notes/draft-template.mdx` 是一份 `draft: true` 的模板，复制改名再写内容；
  它不会出现在站点上。
- 中文首页保持精简：只在首屏链接行留「笔记」入口；`/en/` 会自动列出最新笔记（无笔记时整块不渲染）。

要插图，在正文里用组件（MDX 需要先 `import`）：

```mdx
import FigureCard from '../../components/FigureCard.astro';

<FigureCard
  src="/media/figures/temp-field.png"
  alt="切削温度场云图"
  meta="Fig. 1"
  caption="v = 120 m/min，最高温出现在刀–屑接触区。"
/>
```

新增一篇笔记 = 在 `src/content/notes/` 新建一个 `.mdx`，`date` 决定排序，列表、详情页与 `/en/` 自动更新。

### 4.6 图片与视频

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
- [ ] `cv.yml`：教育经历的时间与导师、研究经历、获奖、技能；〔 〕全部替换
- [ ] 简历 PDF → `public/media/docs/cv.pdf`，`profile.yml` 的 `links.cv` 填 `/media/docs/cv.pdf`
- [ ] 个人照片 → 放到 `public/media/portrait.jpg`（3:4 竖图，长边 1200 px 以内），把 `profile.yml` 的 `photo` 改成 `/media/portrait.jpg`
- [ ] `publications.yml`：换成真实论文（含 BibTeX）
- [ ] 首页算例短片：`index.astro` 里 `VideoCard` 填 `src`（mp4，5–10 s，3 MB 以内），并删掉 `placeholderLabel`；`metrics` 换成实测值
- [ ] 技术笔记：把 `/notes` 里「在写」的四条逐个写成 `src/content/notes/*.mdx`，写完从 `planned` 删掉
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
