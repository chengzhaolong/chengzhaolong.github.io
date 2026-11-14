# 成朝龙 · 个人学术主页

计算力学方向（大变形热力耦合 / FEM–MPM 耦合 / 高性能计算）的个人主页，同时作为
**CUSPIC 求解器**与 **CUSPER CuttingLab** 软件的展示页。

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
│     └─ docs/cv.pdf         # 简历 PDF（换简历就覆盖这个文件，见 4.2）
├─ scripts/make-og.mjs       # svg → png
├─ src/
│  ├─ content.config.ts      # 内容集合的 schema（字段校验）
│  ├─ content/notes/         # 笔记：一篇一个 .mdx（文件名即 URL）
│  ├─ data/
│  │  ├─ profile.yml         # 个人信息（姓名/单位/邮箱/照片/简介/关键词）
│  │  ├─ cv.yml              # 简历（教育 / 项目 / 获奖 / 技能，写法见 4.2）
│  │  ├─ publications.yml    # 论文列表
│  │  └─ software.yml        # 软件条目（cuspic / cuttinglab）
│  ├─ components/            # Nav / Footer / FigureCard / VideoCard / PubItem …
│  ├─ layouts/Base.astro     # <head>、SEO、导航、页脚、灯箱、入场动效
│  ├─ pages/
│  │  ├─ index.astro         # 首页
│  │  ├─ about.astro         # 简历页（单栏，内容读 cv.yml）
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
2. **简介 + 算例**：左栏 `intro_zh` + `interests` + 「完整介绍与简历 →」；右栏一个算例短片（`VideoCard`，16:9），下面一行小字「了解 CUSPIC 求解器 →」（跳详情页）。
3. **自研工具**：深色区，自动读取 `software.yml`；卡片底部一行 `spec_line`。
4. **论文**：取 3 条（`highlight: true` 优先）。
5. **联系**：页面底部一行「联系」条；页脚只出现一次姓名。

「研究」模块已下线：首页只留首屏与导航入口，方法层面的长文统一写进 `/notes`（笔记）。

### 4.2 简历 — `src/data/cv.yml`

`/about` 是一页单栏简历，版式照 PDF 简历来：**每条一行（标题在左、日期在右）+ 一行行要点**，不放摘要。
页面上所有内容（含姓名下方那行联系方式）都来自 `profile.yml` + `cv.yml`，
`cv.yml` 只有四段：`education` / `projects` / `awards` / `skills`。
每段是一个列表，**写在前面先显示**；某段不需要就写 `[]`（或删掉整段），页面上不会出现空标题。

```yaml
- id: main

  education:                      # 教育背景，新的在上
    - period: 2022.09 — 至今       # 时间原样显示，想怎么写就怎么写，渲染时靠右
      school: 大连理工大学
      major: 计算力学              # 可省略
      degree: 博士研究生
      points:                     # 下面的要点，一条一行
        - 导师：〔姓名〕

  projects:                       # 项目经历
    - period: 2022 — 至今
      name: CUSPIC —— 高性能显式动力求解器
      role: 主要开发者 · C++ / CUDA # 可省略，浅灰字接在标题后面
      points:
        - 解决什么问题、你负责哪块
        - 做到什么程度（规模、加速比、能算多大的算例）

  awards:                         # 获奖与荣誉，没有就 []
    - period: 2022                # 按年份倒序，渲染时靠右
      title: 本科优秀毕业论文       # 写全称，评委认全称
      note: 〔校级〕                # 可省略，浅灰字跟在标题后

  skills:                         # 工具与技能，一栏一行
    - group: 编程
      items: C++ / CUDA、Python
```

字段名是固定的：`period` / `school` / `major` / `degree` / `points`；
`period` / `name` / `role` / `points`；`period` / `title` / `note`；`group` / `items`。
填错字段名 `npm run check` 会直接报 `projects.0: Unrecognized key: "xxx"`，不会静默丢数据。

三条写法约定，能让简历更像简历：

- **条目标题一行写完**：教育写「学校，专业，学位」，项目写「项目名 —— 一句定位」，日期交给 `period` 靠右；
- **`points` 每条 15–30 字**，动词开头、给得出数字（「实现 GPU 并行求解，单算例 10 万单元」），少用形容词；
- **奖项用全称**（「美国大学生数学建模竞赛（MCM/ICM）Finalist」而不是「美赛 F 奖」）；升学结果（保研直博）写进本科那条的 `points`，和 `period` 自然对齐。

页首的姓名、`身份 · 单位 · 地点`、邮箱与 ORCID 都取自 `profile.yml`，改那边即可。
「查看我的个人主页，了解更多我的背景和CUSPIC求解器：…」这行**只在打印出的 PDF 里出现**
（屏幕上 `.cv-line--home` 是 `display:none`），网址取自 `profile.yml` 的 `links.cuspic`，
清空它这行就不打印；蓝色强调（`--link`）只给这行的网址和「下载简历（PDF）↓」，
后者印进 PDF 没意义，打印时隐藏。

简历 PDF 是**预先做好、直接入库**的静态文件：`public/media/docs/cv.pdf`。
`profile.yml` 的 `links.cv` 已指向它，所以首页联系行、页脚、`/about` 页首、英文页联系条
都会出现「CV（PDF）↓」；链接带 `download`，点一下直接存盘，不会在浏览器里打开 PDF 预览。
不想公开就把 `links.cv` 改回 `''`，这几处一起消失。

**换简历 = 覆盖同一个文件**（URL 不变，不用改代码）。生成方式就是打印 `/about`，
`@media print` 里已经写好一页 A4 的版式：正文 13px、页边距 12/14mm、页首带照片、
自指的「CV（PDF）↓」和网页导航页脚自动隐藏：

```bash
npm run build
npx astro preview --port 4399      # 这个终端保持开着
```

浏览器打开 `http://localhost:4399/about/` → `Ctrl+P` → 目标选「另存为 PDF」：
纸张 A4（CSS 的 `@page { size: A4 }` 已锁死）、边距「默认」、缩放 100%、背景图形不用勾；
预览右下角确认是 `1 / 1` 页，存到 `public/media/docs/cv.pdf` 覆盖。

习惯命令行就用 Edge/Chrome 的 headless 打印（一次成型，不用开浏览器）：

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu `
  --no-pdf-header-footer --virtual-time-budget=3500 `
  --print-to-pdf="$PWD\public\media\docs\cv.pdf" http://127.0.0.1:4399/about/
```

自检一行：`pdfinfo public/media/docs/cv.pdf | findstr Pages` → 应为 `Pages: 1`。

`public/_headers` 给 `/media/*` 设了 30 天缓存，所以换完简历老访客可能还拿到旧版；
想立刻生效就把文件改名（`cv-2026-11.pdf`）并同步 `links.cv`，或者等缓存过期。
公开的这份只有邮箱和 ORCID；带手机号的求职版**别放 `public/`**（那目录部署后就是公开 URL），
扔进已被 `.gitignore` 的 `_private/` 即可。

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

- `name`：产品名（卡片标题、详情页 `h1` 与 `<title>`），写短名，不带「求解器 / 软件」后缀
- `kicker` / `tagline` / `summary`：卡片与详情页首屏文案
- `version` / `status`：版本、状态（`status` 以徽章显示在首屏；没填 `version` 就不显示版本）
- `chips[]`：首屏那一行小标签（FEM–MPM 耦合、GPU 并行…），4 个以内
- `spec_line`：首页卡片底部那一行等宽字体的技术规格，一句话，别超过 30 个字符
- `features[]`：`title` + `text`，详情页卡片（4 条走两列，6 条走三列），首页只取前 3 个 `title`
- `specs[]`：`k` + `v`，详情页右侧「技术规格」表；`v` 里带〔…〕的行不上页面
- `matrix[]`：`k` + `v`，能力矩阵，只在 `/software` 总览里出现（详情页用 `specs`，避免两张表重复）
- `cases[]`：`title` / `meta` / `caption` / `video` / `poster` / `image` / `badge`，详情页深色区「界面与案例」，
  **第一条整行、其余两条并排**；`video` 留空即显示「待替换」占位，补上 mp4 路径就自动换成播放器
- `application`：**只有 CuttingLab 有**，`/software/cuttinglab#access` 的试用申请块：
  `open`（`false` = 「试用即将开启」，`true` = 「申请试用」，文案自动切换）/ `email` / `subject` /
  `lead` / `fields[]`（`k` + `hint`，必填三项）/ `extra_lines[]`（邮件模板里的可选项）/ `note` / `mac_help[]`
- `links[]`：`label` / `href` / `variant`（`primary` 实心、`ghost` 描边）/ `download`（`true` 时直接存盘）；
  同页锚点直接写 `'#access'`、`'#workflow'`

详情页路由由 id 决定：`/software/cuspic`、`/software/cuttinglab`。
若要加第三个软件，直接在 YAML 末尾追加一个条目即可，列表与详情页会自动生成。

#### 换 CUSPIC 用户手册

手册本体是静态文件，元信息与章节索引在 `src/data/cuspic-manual.yml`（collection `manual`）：

1. PDF 放进 `public/media/docs/`，**文件名用 ASCII**（如 `cuspic-manual-v3.0.0.pdf`）。
   中文文件名在部分部署 / URL 编码环境下会 404，`dist/` 里也可能复制不过去。
2. 改 `cuspic-manual.yml` 的 `version` / `pages` / `size` / `date` / `file`。
3. 章节页码变了就改 `chapters[].page`——`page` 是 PDF **物理页**，要和页脚「第 N 页」对得上，
   详情页 `#docs` 的深链按它生成 `file#page=N`。
4. 软件页用 `ManualDocs` 的 `compact` 模式（只渲染「章 · 标题 · 页」目录，宽度够就自动分两栏），
   章节关键词只在需要完整目录时才出现；新增章节不用改页面代码。

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
- [ ] `cv.yml`：本科学校/专业/起止年月、导师、项目文案、获奖年份，〔 〕全部替换
- [ ] 简历 PDF → `public/media/docs/cv.pdf`，`profile.yml` 的 `links.cv` 填 `/media/docs/cv.pdf`
- [ ] 个人照片 → 放到 `public/media/portrait.jpg`（3:4 竖图，长边 1200 px 以内），把 `profile.yml` 的 `photo` 改成 `/media/portrait.jpg`
- [ ] `publications.yml`：换成真实论文（含 BibTeX）
- [ ] 首页算例短片：`cut3d1.mp4` 现在约 10 MB，建议压到 3 MB 以内（720p、5–10 s）；替换后把 `index.astro` 里 `VideoCard` 的 `placeholderLabel` 一并改成对应的说明
- [ ] 技术笔记：把 `/notes` 里「在写」的四条逐个写成 `src/content/notes/*.mdx`，写完从 `planned` 删掉
- [ ] `software.yml`：`specs` / `matrix` 核对一遍；`cases[].video` 与 `poster` 补上真实文件（留空即占位）
- [ ] `software.yml` 的 `application.open`：试用正式开放时改成 `true`，页面文案自动从「即将开启」切到「申请试用」
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
