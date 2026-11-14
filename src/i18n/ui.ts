import type { Lang } from '../utils/i18n';

/**
 * 界面文案字典：中文与英文两套 key 必须完全同形 —— en 用 `typeof zh` 约束，
 * 少一个键、或多一个参数都会直接变成 type error。
 *
 * 这里只放「写死在页面/组件里的文案」；数据文件的内容（软件、简历、手册、论文）
 * 用各自 YAML 里的 en 块，不在这里维护。
 */
const zh = {
  /** 读屏与 aria 文案 */
  a11y: {
    skip: '跳到正文',
    menu: '菜单',
    primaryNav: '主导航',
    breadcrumb: '面包屑',
    lightbox: '图片放大',
    close: '关闭',
    zoom: '放大 ⤢',
    placeholder: '待替换',
    placeholderFigure: '仿真结果图',
    placeholderVideo: '仿真动画（mp4，720p，<3 MB）',
  },

  nav: {
    home: '主页',
    software: '软件',
    publications: '论文',
    notes: '笔记',
    cv: '简历',
    /** 语言切换按钮上的字：中文页显示 EN，英文页显示 中文 */
    switchLabel: 'EN',
  },

  footer: {
    navHeading: '导航',
    contactHeading: '联系',
    email: '邮箱',
    scholar: 'Google Scholar',
    orcid: 'ORCID',
    github: 'GitHub',
    bilibili: 'Bilibili',
    cv: 'CV（PDF）',
    copyright: (year: number) => `© ${year} · 内容、图表与代码版权归作者所有`,
    builtWith: 'Built with Astro · 静态输出，无追踪脚本',
  },

  common: {
    cardDetails: '了解详情',
    mp4Suffix: '（mp4）',
    home: '首页',
    contact: '联系',
    software: '软件',
  },

  home: {
    eyebrow: '热力耦合 · 高性能 · 非线性 · CAE求解器',
    portraitAria: (name: string) => `${name} 的简历`,
    portraitAlt: (name: string) => `${name}的照片`,
    introEyebrow: '简介',
    aboutLink: '完整介绍与简历 →',
    caseEyebrow: '算例',
    caseAlt: 'CUSPIC案例：三维微铣削仿真（FEM-MPM热力耦合）',
    caseCaption: 'CUSPIC案例：三维微铣削仿真（FEM-MPM热力耦合）',
    caseMeta: 'Simulation',
    casePlaceholder: '切削仿真循环短片',
    caseLink: '了解 CUSPIC 求解器，用消费级 GPU 把 FEM–MPM 热力耦合切削仿真加速 50 倍 →',
    softwareEyebrow: '软件',
    softwareTitle: '自研软件项目',
    softwareLede: '用CAE技术加速制造工艺改进',
    softwareAll: '软件总览 →',
    pubsEyebrow: 'Publications',
    pubsTitle: 'Publications',
    pubsAll: '全部论文 →',
    cv: 'CV（PDF）',
    cuttinglabCta: 'CUSPER CuttingLab 试用即将开启',
  },

  pub: {
    heading: '论文与专利',
    total: (n: number) => `共 ${n} 篇`,
    journal: (n: number) => `期刊 ${n}`,
    conference: (n: number) => `会议 ${n}`,
    preprint: (n: number) => `预印本 ${n}`,
    patent: (n: number) => `专利 ${n}`,
    groupCount: (n: number) => `${n} 篇`,
    copyBibtex: '复制 BibTeX',
    copied: '已复制 ✓',
    typeJournal: '期刊',
    typeConference: '会议',
    typePreprint: '预印本',
    typePatent: '专利',
    typePaper: '论文',
    demoNotice:
      '当前显示的是示例论文条目。把 src/data/publications.yml 换成你的真实论文，再把 src/data/profile.yml 里的 demo 改为 false，这条提示会自动消失。',
    askPre: '找不到想要的？直接',
    askLink: '发邮件',
    askPost: '索取预印本或算例细节。',
  },

  software: {
    /* ---------- 总览页 ---------- */
    overviewTitle: '求解器与软件',
    overviewLede:
      'CUSPIC 提供了高性能显式动力学求解器内核，而 CUSPER CuttingLab 把它包装为金属切削工艺研究能直接使用的流程。',
    cuspicHeading: 'CUSPIC —— 高性能显式动力学求解器',
    cuspicDetail: 'CUSPIC 详情 →',
    manualLink: (size: string) => `用户手册（PDF，${size}）`,
    capabilityCol: '能力',
    scopeCol: '范围',
    matrixNote: {
      pre: '用法与算例见',
      manual: '用户手册',
      mid: '，演示见',
      detail: '详情页',
      post: '。',
    },
    specCol: '规格',
    specNoteCol: '说明',
    cuttinglabHeading: 'CUSPER CuttingLab —— 金属切削加工仿真软件',
    register: '登记试用 →',
    cuttinglabDetail: 'CuttingLab 详情 →',
    compareTitle: '两者怎么分工',
    compareLede: '同一个内核，两种使用方式：做研究时直接对求解器下手，做工艺时用软件把流程走完。',
    compareCol: '维度',
    compare: [
      { k: '定位', a: '求解器内核', b: '图形化仿真软件' },
      { k: '使用者', a: '研究 / 算法开发', b: '工艺研究、工程试算' },
      { k: '操作方式', a: '.cusp 输入文件', b: '界面操作，一键求解' },
      { k: '物理能力', a: 'FEM–MPM · 热力耦合 · 接触', b: '2D 正交切削全流程（3D 钻削开发中）' },
      { k: '并行', a: 'OpenMP 多线程 + GPU（Linux 版）', b: '继承 CUSPIC 的求解设置' },
      { k: '输出', a: 'VTU 场数据 + 日志', b: '实时云图 / 切削力时程曲线' },
      { k: '获取', a: '随CUSPER CuttingLab提供', b: '试用即将开启（邮件登记）' },
    ],
    getStartedTitle: '尝试CUSPER CuttingLab',
    getStartedText:
      '对CUSPER CuttingLab感兴趣？通过邮件联系我们，登记 CUSPER CuttingLab 试用账号。我们在试用开放后将及时通知你',
    getStartedCta: '登记 CUSPER CuttingLab 试用 →',

    /* ---------- 详情页 ---------- */
    crumbHome: '首页',
    crumbSoftware: '软件',
    overview: '概述',
    manualNote: {
      pre: '完整能力、关键字与算例见 ',
      link: (version: string) => `用户手册 ${version}`,
      post: (pages: number) => `（${pages}页）。`,
    },
    betaNote: '以试用版本为准，界面与输出仍在调整。',
    capabilities: '能做什么',
    cases: '案例',
    specsTitle: '技术规格',
    specsNote: {
      pre: '表格只列主干项，完整参数、关键字说明与算例见 ',
      link: '用户手册',
      post: '。',
    },
    specsBeta: '以试用版本为准，具体参数在试用开始时同步。',
    colItem: '项目',
    colDesc: '说明',
    workflowTitle: '五步走完一个算例',
    workflowLede: '以二维正交切削为例：从参数到曲线，一条不需要写代码的路径。',
    /** 工作流五步：写的是已经跑通的二维正交切削链路 */
    workflow: [
      {
        when: 'Step 1',
        what: '参数化建模',
        desc: '工件、刀具与刀尖几何参数化，材料本构与摩擦模型集中设置，改参数即可重建算例。',
      },
      {
        when: 'Step 2',
        what: '网格划分',
        desc: '自动布置背景网格与物质点，切削区局部加密；三维钻削的网格模块同样可用。',
      },
      {
        when: 'Step 3',
        what: '生成输入文件',
        desc: '输出 CUSPIC 可读的关键字输入文件，不用手写卡片，前处理脚本交给软件。',
      },
      {
        when: 'Step 4',
        what: '求解',
        desc: '在界面内调用 CUSPIC（FEM–MPM），时间步控制与任务调度由软件接管。',
      },
      {
        when: 'Step 5',
        what: '实时后处理',
        desc: '云图与切削力时程曲线随计算刷新，结果可导出图片与数据。',
      },
    ],
    roadmapTitle: '进度与路线图',
    roadmapLede: '二维正交切削已全流程打通；三维工况与后续功能按下面的节奏推进。',
    roadmapState: { done: '已打通', wip: '开发中', plan: '计划' },
    allSoftware: '软件总览',
  },

  cv: {
    education: '教育与经历',
    projects: '项目',
    publications: '论文与专利',
    skills: '工具与技能',
    patentTag: '专利',
    /** 学校 / 专业 / 学位之间的分隔符 */
    sep: '，',
    orcid: 'ORCID ↗',
    scholar: 'Scholar ↗',
    github: 'GitHub ↗',
    bilibili: 'Bilibili ↗',
    download: '下载简历（PDF）↓',
    homeLine: '查看我的个人主页，了解更多我的背景和CUSPIC求解器：',
    photoAlt: (name: string) => `${name}的照片`,
    links: {
      pubs: '论文列表 →',
      software: '软件 →',
      notes: '笔记 →',
    },
  },

  notes: {
    heading: '笔记',
    lede: '论文里写不进去的东西：为什么这么设计、试过哪些没成的方案、数字到底对不对。慢慢写，一篇一篇来。',
    published: (n: number) => `已发布 ${n} 篇`,
    inProgress: (n: number) => `在写 ${n} 篇`,
    pubsLink: '论文与专利 →',
    empty: '第一篇还在写。下面是正在整理的选题，写完一篇就会出现在这里。',
    inProgressEyebrow: 'In progress',
    inProgressTitle: '在写',
    inProgressLede: '选题来自手上正在做的算例与踩过的坑，不做泛泛的科普。',
    statusPrefix: (status: string) => `在写 · ${status}`,
    read: '阅读',
    /** 「在写」清单：写完一篇就把它挪进 src/content/notes/，这里删掉对应条目 */
    planned: [
      {
        title: '接触界面：嵌入拉格朗日表面，还是点–面罚函数？',
        text: '为什么在多体接触 + 极端畸变下选了嵌入表面，代价是什么，和罚函数法在算例上差在哪。',
        tags: ['MPM', '接触算法'],
        status: '大纲',
      },
      {
        title: '切屑分离到底发生在哪一步',
        text: '粒子失效、网格重连、材料分离准则：三种做法在 FEM–MPM 里的实际表现与误差来源。',
        tags: ['FEM–MPM', '切削'],
        status: '资料',
      },
      {
        title: '粒子循环搬上 GPU 之后撞到的三堵墙',
        text: '访存、原子冲突、显存：单算例从 8 小时到 40 分钟，每一段加速是从哪来的。',
        tags: ['GPU', '性能'],
        status: '大纲',
      },
      {
        title: '显式格式下的热力耦合时间步',
        text: '温度场会不会被算成假的：热–力时间步不一致时，误差怎么累积、怎么验证。',
        tags: ['热力耦合', '显式积分'],
        status: '计划',
      },
    ] as { title: string; text: string; tags: string[]; status: string }[],
  },

  /** 用户手册区块（ManualDocs：/software/cuspic 详情页） */
  manual: {
    eyebrow: 'Documentation',
    heading: '用户手册',
    lede: '输入文件的每一张卡片、错误码与两个完整算例都在这本册子里。下面每一条直接跳到对应章节，其余部分按需下载翻看。',
    meta: (pages: number) => `${pages} 页`,
    download: (size: string) => `下载 PDF（${size}）`,
    open: '在浏览器中打开 ↗',
    note: '章节链接带 #page= 片段，Chrome / Edge / Firefox 会直接翻到那一页；手册本身也带可点的目录。PDF 由同一套输入文件生成，改版后版本号会写进文件名。',
    colNo: '章',
    colTitle: '标题与内容',
    colPage: '页',
  },

  trial: {
    headingOpen: (product: string) => `申请 ${product} 试用`,
    headingSoon: (product: string) => `${product} 试用即将开启`,
    intro: '试用申请需要提供下面三项信息；点按钮会把模板填好，补齐冒号后面的内容即可。',
    apply: '发邮件申请',
    register: '发邮件登记',
    back: '返回软件总览',
    macHelp: '物理 MAC 怎么查：',
  },
};

/** 英文站文案：与 zh 一一对应，不做意译扩写 */
const en: typeof zh = {
  a11y: {
    skip: 'Skip to content',
    menu: 'Menu',
    primaryNav: 'Primary navigation',
    breadcrumb: 'Breadcrumb',
    lightbox: 'Enlarged figure',
    close: 'Close',
    zoom: 'Zoom ⤢',
    placeholder: 'Placeholder',
    placeholderFigure: 'Simulation result figure',
    placeholderVideo: 'Simulation clip (mp4, 720p, <3 MB)',
  },

  nav: {
    home: 'Home',
    software: 'Software',
    publications: 'Publications',
    notes: 'Notes',
    cv: 'CV',
    switchLabel: '中文',
  },

  footer: {
    navHeading: 'Navigate',
    contactHeading: 'Contact',
    email: 'Email',
    scholar: 'Google Scholar',
    orcid: 'ORCID',
    github: 'GitHub',
    bilibili: 'Bilibili',
    cv: 'CV (PDF)',
    copyright: (year: number) => `© ${year} · Text, figures and code © the author`,
    builtWith: 'Built with Astro · Static output, no tracking scripts',
  },

  common: {
    cardDetails: 'View details',
    mp4Suffix: ' (mp4)',
    home: 'Home',
    contact: 'Contact',
    software: 'Software',
  },

  home: {
    eyebrow: 'Thermo-mechanical coupling · High performance · Non-linear · CAE solvers',
    portraitAria: (name: string) => `CV of ${name}`,
    portraitAlt: (name: string) => `Portrait of ${name}`,
    introEyebrow: 'About',
    aboutLink: 'Full profile and CV →',
    caseEyebrow: 'Case',
    caseAlt: 'CUSPIC case: 3D micro-milling simulation (FEM–MPM, thermo-mechanical)',
    caseCaption: 'CUSPIC case: 3D micro-milling simulation (FEM–MPM, thermo-mechanical)',
    caseMeta: 'Simulation',
    casePlaceholder: 'Cutting simulation loop',
    caseLink:
      'Meet CUSPIC — the FEM–MPM solver that makes thermo-mechanical cutting simulation 50× faster on a consumer GPU →',
    softwareEyebrow: 'Software',
    softwareTitle: 'Software I build',
    softwareLede: 'Using CAE to shorten process-development cycles',
    softwareAll: 'All software →',
    pubsEyebrow: 'Publications',
    pubsTitle: 'Publications',
    pubsAll: 'All publications →',
    cv: 'CV (PDF)',
    cuttinglabCta: 'CUSPER CuttingLab — early access opening soon',
  },

  pub: {
    heading: 'Publications & patents',
    total: (n: number) => `${n} in total`,
    journal: (n: number) => `Journals ${n}`,
    conference: (n: number) => `Conference ${n}`,
    preprint: (n: number) => `Preprints ${n}`,
    patent: (n: number) => `Patents ${n}`,
    groupCount: (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`,
    copyBibtex: 'Copy BibTeX',
    copied: 'Copied ✓',
    typeJournal: 'Journal',
    typeConference: 'Conference',
    typePreprint: 'Preprint',
    typePatent: 'Patent',
    typePaper: 'Paper',
    demoNotice:
      'The entries below are sample data. Replace src/data/publications.yml with your own list and set demo to false in src/data/profile.yml — this notice disappears.',
    askPre: "Can't find what you need? ",
    askLink: 'Email me',
    askPost: ' for preprints or case details.',
  },

  software: {
    /* ---------- overview ---------- */
    overviewTitle: 'Solver and application',
    overviewLede:
      'CUSPIC provides the high-performance explicit-dynamics core; CUSPER CuttingLab turns it into a workflow that machining research can use directly.',
    cuspicHeading: 'CUSPIC — high-performance explicit dynamics solver',
    cuspicDetail: 'CUSPIC details →',
    manualLink: (size: string) => `User manual (PDF, ${size})`,
    capabilityCol: 'Capability',
    scopeCol: 'Scope',
    matrixNote: {
      pre: 'Usage and examples are in the ',
      manual: 'user manual',
      mid: '; demos are on the ',
      detail: 'details page',
      post: '.',
    },
    specCol: 'Specification',
    specNoteCol: 'Details',
    cuttinglabHeading: 'CUSPER CuttingLab — machining simulation application',
    register: 'Register interest →',
    cuttinglabDetail: 'CuttingLab details →',
    compareTitle: 'How the two divide the work',
    compareLede:
      'One core, two ways to use it: drive the solver directly for research, run the whole workflow for process work.',
    compareCol: 'Aspect',
    compare: [
      { k: 'Positioning', a: 'Solver core', b: 'Graphical simulation application' },
      { k: 'Users', a: 'Research and algorithm development', b: 'Process research, engineering trials' },
      { k: 'Interface', a: '.cusp input files', b: 'GUI-driven, one-click solve' },
      {
        k: 'Physics',
        a: 'FEM–MPM · thermo-mechanical coupling · contact',
        b: 'Full 2D orthogonal cutting chain (3D drilling in development)',
      },
      { k: 'Parallelism', a: 'OpenMP threads + GPU (Linux build)', b: 'Inherits the CUSPIC solver settings' },
      { k: 'Output', a: 'VTU field data + logs', b: 'Live contours / cutting-force history' },
      { k: 'Availability', a: 'Bundled with CUSPER CuttingLab', b: 'Early access via email registration' },
    ],
    getStartedTitle: 'Try CUSPER CuttingLab',
    getStartedText:
      'Interested in CUSPER CuttingLab? Email us to register for an early-access account — we will let you know as soon as the trial opens.',
    getStartedCta: 'Register for CUSPER CuttingLab →',

    /* ---------- detail ---------- */
    crumbHome: 'Home',
    crumbSoftware: 'Software',
    overview: 'Overview',
    manualNote: {
      pre: 'Full capabilities, keywords and examples: ',
      link: (version: string) => `user manual ${version}`,
      post: (pages: number) => ` (${pages} pages).`,
    },
    betaNote: 'Subject to the beta build; the interface and output are still changing.',
    capabilities: 'What it does',
    cases: 'Selected cases',
    specsTitle: 'Technical specifications',
    specsNote: {
      pre: 'The table lists the main items only; full parameters, keyword descriptions and examples are in the ',
      link: 'user manual',
      post: '.',
    },
    specsBeta: 'Subject to the beta build; parameters will be published when the trial opens.',
    colItem: 'Item',
    colDesc: 'Details',
    workflowTitle: 'Five steps to a finished case',
    workflowLede: 'On 2D orthogonal cutting: from parameters to curves, without writing code.',
    workflow: [
      {
        when: 'Step 1',
        what: 'Parametric modelling',
        desc: 'Workpiece, tool and tool-tip geometry are parameterised; material constitutive models and friction are set in one place, so a parameter change rebuilds the case.',
      },
      {
        when: 'Step 2',
        what: 'Meshing',
        desc: 'Background grid and material points are generated automatically, with local refinement in the cutting zone; the 3D drilling mesher reuses the same module.',
      },
      {
        when: 'Step 3',
        what: 'Input file generation',
        desc: 'Writes the keyword input file CUSPIC reads — no hand-written cards, no pre-processing scripts.',
      },
      {
        when: 'Step 4',
        what: 'Solve',
        desc: 'Calls CUSPIC (FEM–MPM) from inside the application; time-step control and job scheduling are handled for you.',
      },
      {
        when: 'Step 5',
        what: 'Live post-processing',
        desc: 'Contours and the cutting-force history refresh as the run proceeds; results export as images and data.',
      },
    ],
    roadmapTitle: 'Progress and roadmap',
    roadmapLede:
      'The full 2D orthogonal cutting chain is in place; 3D process types and further features follow the schedule below.',
    roadmapState: { done: 'available', wip: 'in development', plan: 'planned' },
    allSoftware: 'All software',
  },

  cv: {
    education: 'Education and experience',
    projects: 'Projects',
    publications: 'Publications and patents',
    skills: 'Skills and tools',
    patentTag: 'Patent',
    sep: ', ',
    orcid: 'ORCID ↗',
    scholar: 'Scholar ↗',
    github: 'GitHub ↗',
    bilibili: 'Bilibili ↗',
    download: 'Download CV (PDF) ↓',
    homeLine: 'More about my background and the CUSPIC solver:',
    photoAlt: (name: string) => `Portrait of ${name}`,
    links: {
      pubs: 'Publications →',
      software: 'Software →',
      notes: 'Notes →',
    },
  },

  notes: {
    heading: 'Notes',
    lede: 'What never fits into a paper: why it is designed this way, which approaches failed, whether the numbers actually hold. Written slowly, one at a time.',
    published: (n: number) => `${n} published`,
    inProgress: (n: number) => `${n} in progress`,
    pubsLink: 'Publications & patents →',
    empty: 'The first post is still being written. Draft topics are listed below; each appears here once finished.',
    inProgressEyebrow: 'In progress',
    inProgressTitle: 'In progress',
    inProgressLede: 'Topics come from the cases I am running and the problems I run into — no generic explainers.',
    statusPrefix: (status: string) => `In progress · ${status}`,
    read: 'Read',
    planned: [
      {
        title: 'Contact interfaces: embedded Lagrangian surfaces or node-to-surface penalty?',
        text: 'Multi-body contact under extreme distortion in MPM: why embedded surfaces were chosen, what they cost, and how they compare with penalty contact on real cases.',
        tags: ['MPM', 'Contact'],
        status: 'Outline',
      },
      {
        title: 'Where chip separation actually happens',
        text: 'Particle failure, mesh reconnect, material separation criteria: how the three approaches behave in FEM–MPM, and where the error comes from.',
        tags: ['FEM–MPM', 'Cutting'],
        status: 'Material',
      },
      {
        title: 'Three walls hit when the particle loop moved to the GPU',
        text: 'Memory access, atomic conflicts, VRAM: how one case went from 8 hours to 40 minutes, and where each part of the speed-up came from.',
        tags: ['GPU', 'Performance'],
        status: 'Outline',
      },
      {
        title: 'The thermo-mechanical time step in explicit integration',
        text: 'Can the temperature field be approximated away? How error accumulates when the thermal and mechanical time steps differ, and how to verify it.',
        tags: ['Thermo-mechanical', 'Explicit'],
        status: 'Planned',
      },
    ],
  },

  manual: {
    eyebrow: 'Documentation',
    heading: 'User manual',
    lede: 'Every card of the input file, the error codes and two complete worked examples are in this book. Each row below jumps straight to its chapter; the rest is there to download and browse.',
    meta: (pages: number) => `${pages} pages`,
    download: (size: string) => `Download PDF (${size})`,
    open: 'Open in browser ↗',
    note: 'Chapter links carry a #page= fragment, so Chrome / Edge / Firefox jump straight to that page; the manual also has a clickable contents. It is generated from the same input files, and the version number goes into the file name on each revision.',
    colNo: 'Ch.',
    colTitle: 'Title and content',
    colPage: 'Page',
  },

  trial: {
    headingOpen: (product: string) => `Apply for a ${product} trial`,
    headingSoon: (product: string) => `${product} trial opening soon`,
    intro:
      'The trial request needs the three items below; the button pre-fills an email template — just complete what follows each colon.',
    apply: 'Email application',
    register: 'Email to register',
    back: 'Back to all software',
    macHelp: 'How to find the physical MAC address:',
  },
};

/** 按语言取文案 */
export const ui: Record<Lang, typeof zh> = { zh, en };

/**
 * 404 是中英双语同页（静态托管只有一个 404.html），所以两组文案与当前语言无关。
 */
export const notFoundCopy = {
  zh: {
    eyebrow: 'Error 404',
    title: '这条路径没有解',
    text: '页面可能被移动、改名，或者从来没存在过。要不换个初始条件重新算一次？',
    home: '回到首页',
    notes: '笔记',
    publications: '论文',
  },
  en: {
    eyebrow: 'Error 404',
    title: 'No solution on this path.',
    text: 'This page may have moved, been renamed, or never existed. Try a different initial condition?',
    home: 'Back to home',
    software: 'Software',
    publications: 'Publications',
  },
};
