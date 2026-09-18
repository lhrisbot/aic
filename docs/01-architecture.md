# 遗韵智创 · 第一阶段：架构设计

> 依据 `deepseek_frontend_prompt.md` 第一 ~ 十九节制定。
> 本阶段**不写业务代码**，只固化结构、模型、接口契约与视觉规范，待确认后进入第二阶段。

## 0. 环境确认

| 项 | 结果 |
| --- | --- |
| Node | v24.19.0 ✅（满足 Vite 8 要求） |
| npm | 11.17.0 ✅（PowerShell 下 `npm.ps1` 被执行策略拦截，统一使用 `npm.cmd`） |
| npm registry | https://registry.npmjs.org/ 可达 |
| 工作区 | `D:\Users\26877\Desktop\aic主题赛` |
| pnpm | 未安装（本阶段用 npm，不额外引入包管理器） |

**实际安装的技术栈版本（第二阶段落地）**

Vue 3.5.43 · Vite 8.3.0 · TypeScript 5.9.3 · Vue Router 5.3.1 · Pinia 4.0.3 · Axios 1.20 ·
Element Plus 2.14.5 · ECharts 6.1 · markdown-it 15.0.2 · @element-plus/icons-vue 2.3.2 · sass 1.104

版本相关结论（第二阶段实测）：

1. **TypeScript 固定在 5.x**：仓库默认解析到 TypeScript 7.0.2（原生编译器），
   而当前最新的 `vue-tsc` 3.3.11 依赖 `typescript/lib/tsc`，在 TS 7 下会报
   `ERR_PACKAGE_PATH_NOT_EXPORTED`，因此显式安装 `typescript@5.9.3`；
2. **Vite 8 已移除 `scss.api` 配置项**，Sass 默认走现代 API，配置中不再声明；
3. **Vite 8 的 `rollupOptions.output.manualChunks` 不再接受对象写法**，
   故不手工分包，交由 Vite 默认策略处理，仅放宽 chunk 体积告警阈值；
4. `markdown-it@15` 自带类型声明，无需 `@types/markdown-it`。

---

## 1. 完整页面结构

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 产品官网式首页（非后台 Dashboard） |
| `/heritage` | 非遗探索 | 搜索 + 分类 / 地区筛选 + 响应式卡片墙 |
| `/heritage/:id` | 非遗详情 | 皮影戏等详情，含 `SourceCard` 参考资料与 AI 创作 CTA |
| `/creation` | AI 创作 | **最高优先级页**，三栏：创作参数 / 生成结果 / 参考知识 |
| `/video` | 视频创作 | 步骤条 + 分镜卡片 + 视频生成状态机 |
| `/works` | 我的作品 | 筛选 + 搜索 + 排序 + Grid 卡片（文章 / 视频两类卡） |
| `/works/:id` | 作品详情 | 文章正文渲染 / 视频播放 + 脚本 |
| `/login` | 登录 | 独立布局（左文化 Banner + 右登录卡） |
| `/register` | 注册 | 同上 |
| `/:pathMatch(.*)*` | 404 | 兜底页 |

### 1.1 首页分区（自上而下）

1. **Hero 第一屏**：主标题「让千年非遗，被今天的人看见」+ 副标题 + 简介 + 双按钮（开始创作 / 探索非遗）；右侧 AI × 非遗视觉区（渐变卡片 + 极淡纹样 + 粒子/光晕，纯 CSS/SVG 实现，不依赖外网图）。
2. **场景能力**：「一个非遗项目，多种传播方式」四张卡片 —— 文旅推文 / 短视频脚本 / 直播话术 / 文创包装，各含图标、标题、一句描述、Hover 动效。
3. **产品工作流**：寻找非遗 → 选择场景 → AI 智能创作 → 人工优化 → 视频生成（横向流程 + 极克制的流动虚线动效）。
4. **核心技术特色**：可信知识 / 场景化创作 / 多模态生成 三卡。
5. **热门非遗推荐**：皮影戏、昆曲、苏绣、剪纸、景泰蓝、川剧变脸 六卡，点击进入 `/heritage/:id`。
6. **底部 CTA + Footer**：引导进入创作页。

### 1.2 AI 创作页分区（三栏）

| 栏 | 宽度 | 内容 |
| --- | --- | --- |
| 左 · 创作设置 | 280px | 非遗项目可搜索下拉、创作场景切换、**场景参数动态表单**、底部主按钮「AI 开始创作」 |
| 中 · AI 生成结果 | 自适应 | Empty State → Loading/Skeleton → 标题+正文（markdown-it 渲染）→ 操作区（重新生成 / 编辑 / 复制 / 保存作品）；顶部提示条「AI 已基于 X 条非遗资料完成创作」 |
| 右 · 参考知识 | 300px | 「AI 参考资料」：非遗名称 + 知识条数 + 每条资料的标题/片段/来源/相关度百分比 + 可信知识库说明 |

短视频场景额外在结果区显示：「生成视频脚本」「进入视频创作」→ 跳转 `/video`。

### 1.3 视频创作页分区

步骤条（宣传文案 → 视频脚本 → 分镜设计 → AI 视频生成）+ 视频信息条（标题 / 时长 / 目标平台 / 风格）+ `StoryboardCard` 列表（镜头编号、时间、画面、旁白、AI Video Prompt、编辑 / 删除 / 重新生成）+ 底部「根据当前分镜生成视频」+ 状态区（pending / generating / success / failed，进度条与占位播放器、保存 / 重新生成 / 下载）。

---

## 2. Vue Router 结构

- 全部路由**懒加载**（`() => import(...)`），`createWebHistory`。
- 布局：`MainLayout`（AppHeader + `<router-view>` + AppFooter）包裹常规页；`AuthLayout` 承载登录/注册。
- `meta` 字段：`title`（写入 `document.title`）、`requiresAuth`、`activeMenu`（顶栏高亮键，保证 `/heritage/:id` 也高亮「非遗探索」）、`breadcrumb`（详情页可选）。

```ts
// router/index.ts 结构示意
const routes: RouteRecordRaw[] = [
  { path: '/', component: MainLayout, children: [
    { path: '', name: 'Home', component: () => import('@/views/Home/index.vue'), meta: { title: '首页', activeMenu: 'home' } },
    { path: 'heritage', name: 'HeritageList', meta: { title: '非遗探索', activeMenu: 'heritage' }, component: () => import('@/views/Heritage/index.vue') },
    { path: 'heritage/:id', name: 'HeritageDetail', meta: { title: '非遗详情', activeMenu: 'heritage' }, component: () => import('@/views/Heritage/Detail.vue') },
    { path: 'creation', name: 'Creation', meta: { title: 'AI 创作', activeMenu: 'creation' }, component: () => import('@/views/Creation/index.vue') },
    { path: 'video', name: 'Video', meta: { title: '视频创作', activeMenu: 'video' }, component: () => import('@/views/Video/index.vue') },
    { path: 'works', name: 'Works', meta: { title: '我的作品', activeMenu: 'works', requiresAuth: true }, component: () => import('@/views/Works/index.vue') },
    { path: 'works/:id', name: 'WorkDetail', meta: { title: '作品详情', activeMenu: 'works', requiresAuth: true }, component: () => import('@/views/Works/Detail.vue') },
  ]},
  { path: '/', component: AuthLayout, children: [
    { path: 'login', name: 'Login', component: () => import('@/views/Login/index.vue') },
    { path: 'register', name: 'Register', component: () => import('@/views/Register/index.vue') },
  ]},
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound/index.vue') },
]
```

**跳转约定**

- 详情页 CTA → `/creation?heritageId=xxx`（创作页 `watch` query 预选非遗）。
- 创作页短视频 → `/video?heritageId=xxx&workId=xxx`（携带已生成脚本）。
- 401 / 未登录 → `/login?redirect=<当前完整路径>`，登录成功回跳。

**守卫**：全局 `beforeEach` 处理 `meta.title`、`requiresAuth`（读 Pinia `user.token`，未登录则 `ElMessage.warning` + 带 `redirect` 跳登录）；`afterEach` 维护 `document.title`。

**登录保护范围（已确认）**：`/creation`、`/video`、`/works`、`/works/:id` 需要登录；
`/`、`/heritage`、`/heritage/:id`、`/login`、`/register` 公开。
未登录用户从非遗详情页点击「使用该非遗进行 AI 创作」时，先跳到登录页并在登录成功后回到
`/creation?heritageId=xxx`（由 `redirect` 参数保证参数不丢失）。

---

## 3. 组件拆分

### 3.1 全局 / 公共组件（`src/components/`）

| 组件 | 职责 | 来源 |
| --- | --- | --- |
| `AppHeader.vue` | 顶部导航：Logo、五个主入口、登录态区（未登录：登录/注册；已登录：头像+用户名下拉：个人中心/退出） | md 指定 |
| `AppFooter.vue` | 页脚：平台简介、功能导航、备案/版权占位（**不含学校信息**） | md 指定 |
| `HeritageCard.vue` | 非遗卡片：封面、名称、地区、类别、简介、标签 | md 指定 |
| `WorkCard.vue` | 作品卡片：文章型 / 视频型两种 variant | md 指定 |
| `SourceCard.vue` | 参考资料卡：标题、片段、来源、相关度进度条 | md 指定 |
| `SceneSelector.vue` | 创作场景四选一（分段控件 + 图标） | md 指定 |
| `GenerationResult.vue` | 生成结果展示 + 操作区（重新生成/编辑/复制/保存） | md 指定 |
| `StoryboardCard.vue` | 分镜卡：编号、时间、画面、旁白、Prompt、三操作 | md 指定 |
| `SectionTitle.vue` | 首页/列表页统一小节标题（主标题 + 副标题 + 可选右侧动作） | 新增建议 |
| `SceneAbilityCard.vue` | 首页四种传播方式卡 | 新增建议 |
| `FeatureCard.vue` | 核心技术特色卡 | 新增建议 |
| `WorkflowSteps.vue` | 首页五步工作流可视化 | 新增建议 |
| `MarkdownRenderer.vue` | markdown-it 渲染 + 代码/引用样式 + 安全配置（`html: false`） | 新增建议 |
| `EmptyState.vue` | 统一空状态（图标 + 文案 + 可选动作） | 新增建议 |
| `SkeletonBlock.vue` | 统一骨架屏（文本行 / 卡片 / 三栏变体） | 新增建议 |
| `CopyButton.vue` | 复制到剪贴板 + 成功 Toast（带降级方案） | 新增建议 |
| `PatternBackdrop.vue` | 极淡传统纹样背景（inline SVG，`opacity: .04`） | 新增建议 |

### 3.2 页面级组件

```text
views/Home/components/       HeroSection / SceneAbilitySection / WorkflowSection / TechFeatureSection / HotHeritageSection
views/Heritage/              index.vue（列表页）+ Detail.vue + components/{HeritageSearchBar, HeritageFilterBar, HeritageDetailHero, HeritageSection, HeritageTagList}
views/Creation/              index.vue + components/{CreationPanel, SceneParamForm, GenerationPanel, ResultToolbar, KnowledgePanel, KnowledgeItem, SceneVideoActions}
views/Video/                 index.vue + components/{VideoStepBar, VideoMetaBar, StoryboardList, VideoTaskStatus, VideoPlayerPanel}
views/Works/                 index.vue（列表）+ Detail.vue + components/{WorkFilterBar, WorkArticleCard, WorkVideoCard, WorkPreviewDialog}
views/Login/                 index.vue + components/AuthBanner
views/Register/              index.vue
views/NotFound/              index.vue
```

**拆分红线**（对应 md 第十七节）：单文件不超过 ~300 行；页面只做编排与状态订阅，不写 HTTP 细节；所有可复用视觉单元必须独立成组件。

---

## 4. 数据模型设计（`src/types/`）

```ts
// types/common.ts
export interface ApiResponse<T> { code: number; message: string; data: T }
export interface PageResult<T> { list: T[]; total: number; page: number; pageSize: number }
export interface PageQuery { page?: number; pageSize?: number }

// types/heritage.ts
export type HeritageCategory =
  | '传统戏剧' | '传统美术' | '传统技艺' | '传统音乐' | '传统舞蹈' | '民俗'
export type HeritageRegion = '北京' | '江苏' | '浙江' | '四川' | '陕西' | '广东' | '其他'

/** md 指定字段：id,title,content,source,similarity */
export interface Source {
  id: string
  title: string        // 资料标题
  content: string      // 资料片段
  source: string       // 来源（志书 / 期刊 / 博物馆 / 官方网站）
  similarity: number   // 相关度 0~1，展示为百分比
  type?: 'book' | 'journal' | 'museum' | 'official' | 'news'
  year?: string
}

export interface HeritageStory { title: string; content: string }

/** md 指定字段：id,name,category,region,cover,summary,history,features,technique,cultureValue,sources,tags */
export interface Heritage {
  id: string
  name: string
  category: HeritageCategory
  region: HeritageRegion
  cover: string                 // 本地生成 SVG 封面（见 §8）
  summary: string               // 一句简介
  history: string               // 历史渊源
  features: string              // 艺术特色
  technique: string             // 制作 / 表演技艺
  cultureValue: string          // 文化价值
  sources: Source[]             // 参考资料
  tags: string[]
  // 以下为详情页「相关故事」与检索增强所需，均为可选扩展
  stories?: HeritageStory[]
  level?: string                // 国家级 / 省级（可选展示）
  views?: number                // 热度（首页热门推荐排序用）
  createdAt?: string
}

export interface HeritageQuery extends PageQuery {
  keyword?: string
  category?: HeritageCategory | '全部'
  region?: HeritageRegion | '全部'
}

// types/ai.ts
export type SceneType = 'article' | 'video' | 'live' | 'package'   // 文旅推文/短视频/直播话术/文创包装

/** md 指定字段：heritageId,scene,platform,audience,style,length,focus */
export interface CreationRequest {
  heritageId: string
  scene: SceneType
  platform?: string
  audience?: string
  style?: string
  length?: string
  focus?: string
  /** 场景专属字段（如文创「产品类型」、直播「直播场景」）—— 由 sceneSchema 驱动 */
  extra?: Record<string, string>
}

/** md 指定字段：id,title,content,sources,createdAt */
export interface CreationResult {
  id: string
  title: string
  content: string            // Markdown 正文
  sources: Source[]
  createdAt: string
  heritageId?: string
  scene?: SceneType
  videoScript?: VideoScript  // 短视频场景附带
}

export interface VideoScript {
  id: string
  title: string
  duration: number           // 秒
  shots: Storyboard[]
}

// types/video.ts
export type VideoTaskStatus = 'pending' | 'generating' | 'success' | 'failed'

/** 分镜 */
export interface Storyboard {
  id: string
  index: number              // 镜头编号，展示为 01/02...
  start: number              // 起始秒
  end: number                // 结束秒
  scene: string              // 画面描述
  narration: string          // 旁白
  prompt: string             // AI Video Prompt
  cover?: string             // 分镜缩略占位
}

export interface VideoTask {
  id: string
  title: string              // 例：皮影戏 · 国潮非遗宣传短片
  heritageId: string
  heritageName: string
  duration: number
  platform: string           // 抖音 / 视频号 / B站
  style: string              // 国潮 / 纪录片 / 年轻化 / 故事感
  status: VideoTaskStatus
  progress: number           // 0~100
  storyboards: Storyboard[]
  cover?: string
  videoUrl?: string          // Mock 阶段为占位
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

// types/work.ts
/**
 * 作品类型：`video` 是「短视频脚本」这一内容场景，视频作品用独立的 `videoWork`，
 * 两者必须区分，否则短视频脚本会被误标为视频作品，也无法支持两个独立筛选项。
 */
export type WorkType = SceneType | 'videoWork'

export interface Work {
  id: string
  title: string
  type: WorkType
  heritageId: string
  heritageName: string
  summary: string
  content?: string           // 文章型正文（Markdown）
  sources?: Source[]
  cover?: string
  duration?: number          // 视频型
  style?: string
  videoTaskId?: string
  storyboards?: Storyboard[]
  createdAt: string
  updatedAt: string
}

export interface WorkQuery extends PageQuery {
  keyword?: string
  type?: WorkType | '全部'
  sort?: 'latest' | 'oldest'
}

// types/user.ts
export interface UserInfo { id: string; username: string; email?: string; avatar?: string; bio?: string }
export interface LoginPayload { username: string; password: string }
export interface RegisterPayload { username: string; email: string; password: string; confirmPassword: string }
export interface LoginResult { token: string; user: UserInfo }
```

**场景参数配置化**（`src/config/sceneSchema.ts`）—— 让「不同场景动态显示不同参数」由数据驱动，而不是四段 if：

```ts
export interface SceneFieldOption { label: string; value: string }
export interface SceneField {
  key: string                                   // 对应 CreationRequest 的字段名
  label: string
  type: 'select' | 'chips' | 'textarea'
  options?: SceneFieldOption[]
  placeholder?: string
  defaultValue?: string
  required?: boolean
}
export interface SceneConfig {
  type: SceneType; label: string; icon: string; desc: string
  fields: SceneField[]
}
export const SCENE_CONFIGS: Record<SceneType, SceneConfig>
```

字段映射（严格按 md 第八节）：

| 场景 | platform | audience | style | length | 其他 |
| --- | --- | --- | --- | --- | --- |
| 文旅推文 | 公众号/小红书/微博 | 年轻游客/家庭游客/文化爱好者 | 专业文化/国潮年轻/故事化/轻松活泼 | 300/500/800 字 | `focus` 重点内容（自由输入） |
| 短视频 | 抖音/视频号/B站 | — | 国潮/纪录片/年轻化/故事感 | 15/30/60 秒 | `focus` 传播目标（文化科普/旅游引流/品牌宣传） |
| 直播话术 | 抖音/视频号/淘宝直播 | — | 专业/热情/年轻（语气） | 1/3/5 分钟 | `focus` 直播场景（非遗介绍/文创带货/景区宣传） |
| 文创包装 | — | 目标人群 | 包装风格 | — | `extra.productType` 产品类型、`focus` 宣传重点 |

> 说明：`focus` 统一承载各场景的「重点 / 目标 / 场景」槽位，无法归入通用槽位的字段（文创「产品类型」）进入 `extra`。若你希望每个场景都用完全独立的参数字段，我在确认时改。

---

## 5. API 设计

### 5.1 端点契约（前端先按此实现 Mock）

| 方法 | 路径 | 入参 | 返回 |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | `LoginPayload` | `LoginResult` |
| POST | `/api/auth/register` | `RegisterPayload` | `LoginResult` |
| GET | `/api/heritages` | `HeritageQuery` | `PageResult<Heritage>` |
| GET | `/api/heritages/:id` | — | `Heritage` |
| POST | `/api/ai/generate` | `CreationRequest` | `CreationResult`（Mock 延迟 1~2s，返回 2~3 条 `sources`） |
| POST | `/api/video/generate` | `{ workId?, heritageId, storyboards }` | `VideoTask`（初始 `pending`） |
| GET | `/api/video/:id/status` | — | `VideoTask`（轮询推进状态） |
| GET | `/api/works` | `WorkQuery` | `PageResult<Work>` |
| GET | `/api/works/:id` | — | `Work` |
| POST | `/api/works` | `Partial<Work>` | `Work` |
| PUT | `/api/works/:id` | `Partial<Work>` | `Work` |
| DELETE | `/api/works/:id` | — | `{ success: boolean }` |
| POST | `/api/feedback` | `FeedbackPayload` | `FeedbackResult` |

**与提示词清单的差异（第九阶段整理时确认，接入后端需按此实现）**

| 差异 | 说明 |
| --- | --- |
| ➕ `POST /api/ai/video-script` | 支撑创作页「生成视频脚本」：由文案进一步拆出分镜。提示词未列出，但不新增端点就得把脚本混在 `/ai/generate` 的返回值里，语义更差 |
| ➕ `POST /api/ai/video-script/shot` | 支撑分镜卡片的「重新生成单个镜头」，入参为 `{ heritageId, shot }` |
| 🔁 `GET /api/heritages?hot=true&limit=N` | 首页热门推荐**复用列表端点**，不新增 `/heritages/hot`，保持端点数量最小 |
| ➖ `/api/video/:id/status` 返回体 | 在提示词的 `VideoTask` 基础上扩展了 `progress`（生成进度）与 `errorMessage`（失败原因） |

> 所有端点均已在 `src/api/` 中实现，Mock 与真实实现同签名；
> 第九阶段实测：把 `VITE_USE_MOCK` 置为 `false` 后，后端未启动时前端会给出
> 「服务暂时不可用」提示并展示失败态与重试入口，不出现白屏或未捕获异常。

### 5.2 `utils/request.ts` 统一封装

- `baseURL = import.meta.env.VITE_API_BASE_URL`（默认 `/api`）、`timeout = 15000`（AI 与视频类接口单独放宽到 60000）。
- **请求拦截器**：注入 `Authorization: Bearer <token>`（token 从 localStorage 读，避免 store 与 request 互相依赖）。
- **响应拦截器**：解包 `ApiResponse<T>`（`code === 0 | 200` 返回 `data`，否则 `ElMessage.error(message)` + reject）；HTTP 层 401 → 清 token、跳登录；超时/网络错误统一文案。
- **错误提示只弹一次**：拦截器弹出提示后会给错误对象打上 `__notified` 标记，业务层通过 `isNotifiedError(error)` 判断，避免 store 与拦截器重复提示。
- **返回约定**：api 层函数直接返回**已解包**的业务数据，因此 Mock 实现与真实实现签名完全一致（`Promise<T>`），切换零改动。
- **Mock 开关**：`.env` 中 `VITE_USE_MOCK=true`；每个 api 函数内 `if (USE_MOCK) return mockXxx(...) else return http.get(...)`。**页面与 store 永不感知 Mock**（对应 md 第十三节「不要直接在 Vue 页面里写死」）。

### 5.3 Mock 层设计（`src/mock/`）

| 文件 | 内容 |
| --- | --- |
| `utils.ts` | `mockDelay<T>(data, ms?)`、`randomBetween`、`clone`（兼容响应式代理的深拷贝） |
| `heritage.ts` | 12 条非遗数据 + 检索/筛选/分页 + 首页热门固定顺序 |
| `storyboards.ts` | 分镜生成：按非遗类别取镜头语言，按时长决定镜头（15s/3 镜、30s/5 镜、60s/6 镜）与时间轴 |
| `ai.ts` | 四场景生成模板（推文/脚本/话术/包装），1~2s 延迟，返回 2~3 条来源；短视频场景附带 `videoScript` |
| `video.ts` | 任务表按「距创建时刻的经过时间」推导 `pending → generating（进度递增）→ success / failed`；单镜重新生成 |
| `works.ts` | 内存作品库（4 篇文章 + 2 个视频作品），分页/关键词/类型/排序/增删改；按 `heritageId` 派生非遗名称与类别 |
| `auth.ts` | 账号库（localStorage 持久化）+ 演示账号 + 登录/注册校验 + 模拟令牌 |
| `feedback.ts` | 意见反馈提交（内存记录，供开发期核对） |

**视频状态机**（对应 md 第九节）：`pending`（0~0.6s）→ `generating`（进度 0→96%，约 4s，`GET /video/:id/status` 每 1.2s 轮询、最多 40 次）→ `success`（`videoUrl` 为 `mock-video://` 占位）。失败态由页面上的显式开关触发（默认按成功生成），保证比赛演示稳定可控。

---

## 6. 项目目录

```text
aic主题赛/
├── deepseek_frontend_prompt.md     # 提示词原件
├── docs/
│   ├── 01-architecture.md          ← 本文档
│   └── 02-...(后续阶段文档)
└── web/                            # 前端工程根目录（npm 命令在此执行）
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/
    │   │   ├── auth.ts   heritage.ts   ai.ts   video.ts   work.ts
    │   ├── assets/
    │   │   ├── icons/                  # 本地 SVG 图标（场景图标、特色图标）
    │   │   └── covers/                 # 非遗 SVG 封面
    │   ├── components/                 # §3.1 全部公共组件
    │   ├── config/
    │   │   ├── sceneSchema.ts          # 场景参数配置（数据驱动表单）
    │   │   └── constants.ts            # 分类/地区/平台等枚举与选项
    │   ├── layouts/
    │   │   ├── MainLayout.vue
    │   │   └── AuthLayout.vue
    │   ├── views/                      # §3.2 页面与页面级组件
    │   ├── router/
    │   │   ├── index.ts
    │   │   └── guards.ts
    │   ├── stores/
    │   │   ├── user.ts                 # token/user/登录登出/持久化
    │   │   ├── creation.ts             # 创作参数 + 生成结果 + 参考资料 + 加载态
    │   │   └── work.ts                 # 作品列表缓存、增删改
    │   ├── types/
    │   │   ├── common.ts  heritage.ts  ai.ts  video.ts  work.ts  user.ts  router.d.ts
    │   ├── utils/
    │   │   ├── request.ts              # axios 实例 + 拦截器
    │   │   ├── storage.ts              # localStorage 封装
    │   │   ├── format.ts               # 时间/时长/百分比格式化
    │   │   └── clipboard.ts            # 复制（含降级）
    │   ├── styles/
    │   │   ├── variables.scss          # 设计令牌（CSS Variables）
    │   │   ├── base.scss               # reset + 全局排版
    │   │   ├── mixins.scss             # 断点与公共 mixin
    │   │   ├── patterns.scss           # 传统纹样背景
    │   │   ├── element-override.scss   # Element Plus 主题对齐
    │   │   ├── auth-card.scss          # 登录注册卡片共用样式
    │   │   └── index.scss              # 汇总入口
    │   ├── mock/                       # §5.3
    │   ├── env.d.ts
    │   ├── App.vue
    │   └── main.ts
    ├── .env  .env.development  .env.production
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── README.md
```

> 与 md 建议结构一致，仅**新增** 3 处并已标注理由：`config/`（场景参数数据驱动）、`stores/work.ts`（作品数据跨页复用）、`styles/`（设计令牌集中维护）、`layouts/AuthLayout.vue`（登录注册独立布局）。

---

## 7. UI 风格规范

### 7.1 色板（CSS Variables，`styles/variables.scss`）

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--color-primary` | `#C0503C` 朱红（低饱和，非大红） | 主按钮、选中态、强调数字 |
| `--color-primary-hover` | `#A8402E` | Hover / Active |
| `--color-primary-soft` | `rgba(192,80,60,.08)` | 选中底、标签底 |
| `--color-ai` | `#3F6B73` 石青 | AI 相关标识、可信知识徽标 |
| `--color-ai-soft` | `rgba(63,107,115,.10)` | AI 徽标底 |
| `--bg-page` | `#FAF7F2` 米白 | 页面背景 |
| `--bg-card` | `#FFFFFF` | 卡片 |
| `--bg-subtle` | `#F3EFE8` | 次级区块 / 输入底 |
| `--text-primary` | `#1F1E1C` 深墨 | 标题正文 |
| `--text-secondary` | `#6B665E` | 次要说明 |
| `--text-tertiary` | `#9C968B` | 占位 / 元信息 |
| `--border-color` | `#E8E2D8` | 描边、分割线 |
| `--color-success / warning / danger` | `#4C7A5E` / `#C08A2E` / `#B4453A` | 状态（与主色同族低饱和） |

禁令执行：不使用大红色、金黄色、龙纹、祥云堆砌、毛笔字体、复杂传统边框；传统元素只以 `opacity: .04~.06` 的极淡纹样出现。

### 7.2 字体

- 标题：`"Noto Serif SC", "Source Han Serif SC", "Songti SC", "SimSun", serif`（宋体气质，非毛笔体）
- 正文/UI：`-apple-system, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif`
- 数字/代码：`"JetBrains Mono", "SFMono-Regular", Consolas, monospace`
- 不引入外网 Web Font（离线演示安全），全部走系统字体栈。
- 字号阶：12 / 13 / 14 / 16 / 18 / 20 / 24 / 32 / 44（Hero 主标题）；行高：正文 1.75，标题 1.25。

### 7.3 间距 / 圆角 / 阴影

- 间距阶（4 的倍数）：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
- 圆角：`--radius-sm: 8px`、`--radius: 12px`、`--radius-lg: 16px`（卡片）、`--radius-xl: 24px`（大面板 / Hero 视觉区）、`--radius-pill: 999px`
- 阴影：`--shadow-sm: 0 1px 3px rgba(31,30,28,.04)`、`--shadow: 0 6px 20px rgba(31,30,28,.06)`、`--shadow-lg: 0 16px 44px rgba(31,30,28,.10)`（悬停）

### 7.4 布局与响应式

- 内容最大宽 `1280px`（md 建议 1200~1440 区间取中），两侧安全边距 24px（≥1440 时 40px）。
- Header 高 68px，`position: sticky` + 半透明毛玻璃（`backdrop-filter: blur(12px)`，不支持的浏览器退化为纯色）。
- 断点：`1920+ / 1440 / 1280 / 1024 / 768 / 480`。
  - 创作页三栏：< 1400px 右栏收窄至 260px；< 1200px 右栏折叠为抽屉（右侧按钮展开）；< 1024px 左栏折叠为顶部可折叠面板，中栏占满。
  - 卡片墙：4 列（≥1440）/ 3 列（≥1024）/ 2 列（≥768）/ 1 列（移动端）。
- 保证 1920×1080、1440×900 与常见笔记本（1366×768）下无横向滚动、无内容溢出。

### 7.5 动效

- 统一时长 200ms（微交互）/ 320ms（区块入场），缓动 `cubic-bezier(.4,0,.2,1)`。
- 卡片 Hover：上移 `translateY(-4px)` + 阴影升级 + 封面轻微 `scale(1.03)`。
- 生成中：骨架屏 shimmer（`--bg-subtle` 渐变扫光）；思考态文案轮换（如「正在检索非遗知识库…」→「正在生成场景化文案…」）。
- 遵守 `prefers-reduced-motion: reduce` 关闭位移/扫光动效。避免过度动画。

### 7.6 Element Plus 主题对齐

- 通过 CSS 变量覆盖 `--el-color-primary` 等为主色系，`--el-border-radius-base` 对齐 12px，输入/按钮高度统一 40px。
- 用 `ElMessage` / `ElMessageBox` / `ElDialog` / `ElSkeleton` / `ElProgress` / `ElSteps` / `ElDrawer` / `ElTag` / `ElEmpty`，但**删除作品必须 `ElMessageBox.confirm` 二次确认**（md 第十六节）。
- 业务定制外观优先自研组件（卡片、标签、参数控件），Element Plus 只做基础交互与反馈，避免「后台模板感」。

### 7.7 视觉资产策略

- 全部封面/图标使用**本地 SVG**（渐变底 + 非遗元素线稿），不依赖外网图片，保证离线与断网演示不裂图；`Heritage.cover` 字段保留 URL 形态，后续替换为真实摄影图零改动。
- 纹样（回纹、冰裂纹、缠枝）统一封装为 `PatternBackdrop.vue` 与 SCSS mixin，透明度受控。

---

## 8. Mock 数据清单（12 个非遗项目）

| # | 名称 | 地区 | 类别 |
| --- | --- | --- | --- |
| 1 | 皮影戏 | 陕西 | 传统戏剧 |
| 2 | 昆曲 | 江苏 | 传统戏剧 |
| 3 | 苏绣 | 江苏 | 传统美术 |
| 4 | 剪纸 | 陕西 | 传统美术 |
| 5 | 景泰蓝 | 北京 | 传统技艺 |
| 6 | 川剧变脸 | 四川 | 传统戏剧 |
| 7 | 古琴 | 北京 | 传统音乐 |
| 8 | 龙泉青瓷 | 浙江 | 传统技艺 |
| 9 | 苗族银饰 | 其他 | 传统技艺 |
| 10 | 木版年画 | 其他 | 传统美术 |
| 11 | 南京云锦 | 江苏 | 传统技艺 |
| 12 | 广东醒狮 | 广东 | 传统舞蹈 |

md 指定 10 项全部包含（1~10），额外 2 项用于补足筛选维度覆盖（传统舞蹈、广东地区、其余类别）。每项提供：名称、地区、类型、简介、历史渊源、艺术特色、制作/表演技艺、文化价值、相关故事 2 则、标签 3~5 个、参考资料 2~3 条（含标题/片段/来源/相关度）。内容为**面向宣传场景的科普性描述**，措辞避免绝对化断言；参考资料标注为示例性来源，后续接入真实知识库时替换。

---

## 9. 已确认决策（第二阶段开工前确认）

| # | 事项 | 结论 |
| --- | --- | --- |
| 1 | 项目落盘位置 | **`web/` 子目录**；根目录保留提示词原件与 `docs/`，npm 命令在 `web/` 下执行 |
| 2 | 创作页参数字段方案 | **6 个通用槽位 + `extra`**：严格保留 `heritageId/scene/platform/audience/style/length/focus`，场景专属字段（文创「产品类型」、短视频「切入角度」、直播「互动设计」）通过 `scope: 'extra'` 进入 `CreationRequest.extra` |
| 3 | 登录保护范围 | **`/creation`、`/video`、`/works` 及作品详情需要登录**；首页与非遗探索公开 |
| 4 | 加分增强项（首页对比条、引用角标联动、ECharts 统计） | **暂不做**，按需在对应阶段追加 |

**仍待你决定的开放项**（不阻塞第三阶段）：

1. 页脚是否需要放团队名 / 联系方式等比赛展示信息（学校名称与指导教师信息一律不出现）；
2. 是否需要额外引入 ESLint + Prettier（当前未引入，仅使用 `vue-tsc` 做类型约束）；
3. 是否需要初始化 Git 仓库并分阶段提交。

---

## 10. 后续阶段计划（确认后执行）

| 阶段 | 交付 | 验收 |
| --- | --- | --- |
| 二 · 基础工程 | Vite+Vue3+TS 脚手架、Element Plus、Router、Pinia、Axios、MainLayout/AppHeader/AppFooter、全局样式与设计令牌 | `npm run dev` 起服务，顶栏五个入口可跳转，`vue-tsc` 无错误 |
| 三 · 首页 | 五个分区全部实现 | 与 md 第五节文案一致，1920/1440 无溢出 |
| 四 · 探索 + 详情 | 列表搜索筛选、详情七大内容块、`SourceCard`、CTA 跳转 | 12 条数据可筛选，CTA 正确带参跳创作页 |
| 五 · AI 创作页 | 三栏布局、场景动态参数、生成/编辑/复制/保存、参考资料 | 四场景参数切换正确，1~2s 骨架 → Markdown 结果，保存写入作品库 |
| 六 · 视频创作页 | 步骤条、分镜卡增删改、状态机与进度、成功/失败态 | pending→generating→success 可视，失败态可演示 |
| 七 · 我的作品 | 列表筛选/搜索/排序、文章+视频双卡、详情、删除二次确认 | 与创作页保存联动，删除有确认 |
| 八 · 登录注册 | 双布局、Mock 登录注册、Pinia + localStorage token、路由守卫 | 刷新保持登录态，退出清空并回跳 |
| 九 · API 与 Mock 整理 | api 层与 mock 层边界复核、`.env` 开关、真实接口预留 | 页面无直接 HTTP 调用，`VITE_USE_MOCK=false` 时走 axios |
| 十 · 全项目检查 | TS 错误、路由、UI 一致性、响应式、组件复用、运行报错 | `npm run build` 通过 + `vue-tsc --noEmit` 零错误 + 三档分辨率人工走查 |

每阶段结束我会汇报：新增文件、修改文件、已实现内容、下一阶段计划。
