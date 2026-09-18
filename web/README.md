# 遗韵智创 · 前端工程

AI 非遗多模态内容创作平台前端，Vue 3 + Vite + TypeScript。

## 快速开始

```bash
npm install
npm run dev      # 开发服务，默认 http://127.0.0.1:5173/
```

> Windows PowerShell 若提示「无法加载文件 npm.ps1，因为在此系统上禁止运行脚本」，
> 请改用 `npm.cmd`（例如 `npm.cmd run dev`），或执行
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 后重开终端。

其他命令：

```bash
npm run type-check   # vue-tsc 类型检查
npm run build        # 类型检查 + 生产构建
npm run build:only   # 仅生产构建
npm run build:pages  # GitHub Pages 专用构建（自动带仓库名前缀 + 404 回退 + .nojekyll）
npm run preview      # 预览 dist 产物
```

> **部署上线**：GitHub Pages / Cloudflare Pages / Vercel 的完整步骤与常见问题见
> `../docs/05-deploy-github-pages.md`。
> **让队友在局域网内直接打开**：`npm run preview -- --host 0.0.0.0 --port 4173`，
> 然后把 `http://<你的局域网IP>:4173/` 发给他们（需放行该端口）。

## 技术栈

| 领域 | 选型 |
| --- | --- |
| 框架 | Vue 3（全部使用 `<script setup lang="ts">`） |
| 构建 | Vite 8 |
| 语言 | TypeScript 5.9（严格模式） |
| 路由 | Vue Router 5 |
| 状态 | Pinia 4 |
| 请求 | Axios（统一封装于 `src/utils/request.ts`） |
| UI | Element Plus 2 + `@element-plus/icons-vue` |
| 样式 | SCSS + CSS Variables 设计令牌 |
| 后续使用 | ECharts（数据统计）、markdown-it（AI 结果渲染） |

> 说明：TypeScript 固定在 5.x。若升级到 TS 7（原生编译器），当前版本的
> `vue-tsc` 会因 `typescript/lib/tsc` 不再导出而无法运行。

## 目录结构

```text
src/
├── api/          # 接口层（Mock 与真实请求在这里切换，页面不直接发请求）
├── assets/       # 静态资源（图标、非遗封面 SVG）
├── components/   # 全局公共组件（AppHeader / AppFooter / 卡片类组件等）
├── config/       # 常量与场景参数配置（sceneSchema 驱动创作页动态表单）
├── layouts/      # MainLayout（顶栏 + 页脚）/ AuthLayout（登录注册）
├── mock/         # Mock 数据与模拟接口
├── router/       # 路由表与全局守卫
├── stores/       # Pinia：user / creation / work
├── styles/       # 设计令牌、基础排版、纹样、Element Plus 主题对齐
├── types/        # 业务类型定义
├── utils/        # request / storage / format 等工具
└── views/        # 页面（含页面级子组件）
```

## 设计约定

- **颜色、字号、间距、圆角、阴影**一律使用 `src/styles/variables.scss` 中的 CSS Variables，
  不在组件里写死数值；组件通过 `var(--color-primary)` 这类令牌取值。
- **场景参数数据驱动**：创作页四个场景的参数字段全部声明在 `src/config/sceneSchema.ts`，
  新增场景只需加一份配置，无需改动表单组件。
- **Mock 与真实接口同签名**：`src/api/*` 内的函数通过 `VITE_USE_MOCK` 决定走
  `src/mock/*` 还是 `http.get/post`，两者返回类型完全一致，页面与 store 无需感知。
- **分层边界（第九阶段审计结论）**：页面与组件 → `src/stores/*` → `src/api/*` →（`src/mock/*` 或 axios）；
  全项目只有 `src/api/*` 引用 `src/mock/*`，只有 `src/utils/request.ts` 引用 axios，无越层引用。
  唯一例外是 `FeedbackDialog.vue`：反馈没有跨页面共享状态，由组件直接调用 `src/api/feedback.ts`
  （仍不触碰 mock，也不在组件里写请求地址），已在组件注释中说明。
- **响应式断点**：1440 / 1280 / 1024 / 768 / 480，见 `src/styles/mixins.scss`。
- **封面策略**：非遗封面不使用外网图片（保证离线演示与版权安全），
  由 `src/components/HeritageCover.vue` 按「类别配色 + 稳定纹样 + 项目首字」实时绘制 SVG；
  `Heritage.cover` 字段仍保留图片地址形态，填入真实摄影图后调用方改渲染 `<img>` 即可。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_API_BASE_URL` | 接口基础路径（默认 `/api`，由 Vite proxy 转发到 FastAPI） |
| `VITE_USE_MOCK` | `true` 使用 Mock；改为 `false` 即走真实后端 |

## 开发期自检（可选）

`.verify/` 下放了两个渲染验证脚本（不参与构建，已被 `.gitignore` 忽略）：

- `probe.mjs` — 以 `--remote-debugging-port=9333` 启动 headless Chrome 后执行
  `node .verify/probe.mjs`，在 1920 / 1440 / 1366 / 1024 / 390 五个视口下检查横向溢出、
  栅格列数、关键区块是否渲染，并收集控制台 error / warning；
  用 `PROBE_URL` 环境变量指定要检查的页面（默认首页）；
- `probe-flow.mjs` — 端到端流程验证：非遗详情 → 点击 AI 创作 CTA → 路由守卫拦截 →
  演示账号登录 → 回跳创作页 → 我的作品可访问；
- `audit.mjs` — 静态审计：未使用导出 / 组件、遗留调试代码、跨层引用违规；
- `probe-final.mjs` — 全路由 × 5 档分辨率的渲染矩阵（10 条路由，55 个检查点）；
- `probe-flow-final.mjs` — 主流程连续回归（非遗 → 登录 → 创作 → 视频 → 作品 → 删除 → 退出）；
- 其余 `probe-*.mjs` / `shot-*.mjs` 为各阶段的过程验证与截图脚本。

第十阶段的完整检查结论见 `../docs/02-final-check.md`。

另注：`vite.config.ts` 的 `server.watch.ignored` 已忽略临时目录与 `.verify/`，
避免编辑器原子写入或浏览器缓存文件被占用时打断 dev 服务。

## 开发阶段

| 阶段 | 内容 | 状态 |
| --- | --- | --- |
| 一 | 架构设计（页面 / 路由 / 组件 / 模型 / 接口 / 目录 / 视觉规范） | ✅ |
| 二 | 基础工程（脚手架、设计令牌、布局、顶栏页脚、路由守卫） | ✅ |
| 三 | 首页（Hero、场景能力、工作流、核心特色、热门非遗、底部 CTA） | ✅ |
| 四 | 非遗探索（搜索 / 分类 / 地区筛选 / 分页）与非遗详情（七大板块 + SourceCard + CTA） | ✅ |
| 五 | AI 创作页（三栏布局、场景参数动态表单、Markdown 结果、参考资料、保存作品） | ✅ |
| 六 | 视频创作页（步骤条、分镜增删改、pending→generating→success/failed 状态机） | ✅ |
| 七 | 我的作品（类型筛选 / 搜索 / 排序、文章与视频双卡、详情、删除二次确认） | ✅ |
| 八 | 登录注册（完整表单 + Mock 鉴权，含演示账号一键登录） | ✅ |
| 九 | Mock API 与 Axios API 层整理（端点对齐、分层审计、真机模式降级验证） | ✅ |
| 十 | 全项目检查（类型 / 路由 / UI 一致性 / 响应式 / 组件复用 / 运行错误） | ✅ |

> 十个阶段全部完成。检查报告见 `../docs/02-final-check.md`，
> 架构设计（页面结构、路由、组件拆分、数据模型、接口契约、视觉规范）见
> `../docs/01-architecture.md`。
