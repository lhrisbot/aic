# 遗韵智创 —— AI 非遗多模态内容创作平台

面向文旅宣传、文化馆与新媒体的非遗内容生产平台：**可信非遗知识库 + AI 场景化内容生成 + AI 视频生成**。
用户流程：查非遗 → 选择宣传场景 → AI 生成内容 → 编辑 → 保存作品 → 进一步生成视频。

本项目为软件工程课程设计，同时用于 AI 智能文化类比赛演示。**当前阶段只做前端**，所有接口用 Mock 数据模拟，
代码结构已按 FastAPI 后端与 Coze Workflow 的真实接口预留。

---

## 目录结构

```
.
├── docs/                            文档（三人都要看）
│   ├── 01-architecture.md           架构设计：页面结构 / 路由 / 组件 / 数据模型 / 接口契约 / 视觉规范
│   ├── 02-final-check.md            前端最终检查报告（55 个渲染检查点 + 主流程回归）
│   ├── 03-handoff-backend.md        ★ 后端对接说明：15 个端点的请求/响应示例与约定
│   ├── 04-handoff-workflow.md       ★ Workflow 对接说明：需要哪些工作流、输入输出契约与验收清单
│   └── 05-deploy-github-pages.md    ★ 部署说明：GitHub Pages（自动/手动）/ Cloudflare / Vercel + 常见问题
├── web/                             前端工程（Vue 3 + Vite + TypeScript + Element Plus）
│   ├── src/
│   │   ├── api/                     接口层（Mock 与真实请求在这里切换）
│   │   ├── mock/                    Mock 数据与模拟接口
│   │   ├── stores/                  Pinia：user / creation / video / work
│   │   ├── views/                   10 个页面
│   │   ├── components/              20 个公共组件
│   │   ├── config/                  常量与场景参数配置（创作页表单由它驱动）
│   │   └── styles/                  设计令牌（CSS Variables）与全局样式
│   └── README.md                    前端启动、技术栈、分层约定与验证脚本说明
└── deepseek_frontend_prompt.md      最初的前端开发提示词（需求原件）
```

---

## 快速开始（前端）

要求 **Node.js ≥ 20.19**（本项目在 Node 24.19 上开发）。

```bash
cd web
npm install
npm run dev          # http://127.0.0.1:5173/
```

> Windows PowerShell 若报「无法加载文件 npm.ps1，因为在此系统上禁止运行脚本」，
> 请改用 `npm.cmd`（例如 `npm.cmd run dev`），或执行
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 后重开终端。

其他命令：

```bash
npm run type-check   # vue-tsc 类型检查
npm run build        # 类型检查 + 生产构建
npm run preview      # 预览 dist 产物
```

**演示账号**：用户名 `非遗创作者`，密码 `yiyun2026`（登录页有一键填入按钮）。

**演示路径**（比赛演示按这条走）：首页 → 非遗探索（筛选） → 非遗详情 → 点「使用该非遗进行 AI 创作」→
登录拦截 → 登录 → AI 创作（生成并保存）→ 视频创作（生成分镜与视频）→ 我的作品（查看/删除）。

---

## 三人分工与各自入口

| 角色 | 主要工作 | 先看什么 |
| --- | --- | --- |
| 前端（已完成） | 10 个页面、20 个公共组件、接口层与 Mock | `web/README.md`、`docs/02-final-check.md` |
| 后端 | FastAPI 实现 15 个端点，把 Coze 工作流包成 REST | **`docs/03-handoff-backend.md`** |
| Workflow | Coze 工作流：知识库检索 + 场景化生成 + 分镜 + 视频 | **`docs/04-handoff-workflow.md`** |

**联调方式**：前端通过 `web/.env.development` 的 `VITE_USE_MOCK` 切换数据来源。

```env
VITE_USE_MOCK=true       # 使用 src/mock 的模拟数据（默认，可离线演示）
VITE_USE_MOCK=false      # 走真实接口，请求 /api/* 由 Vite 代理转发到 http://127.0.0.1:8000
```

开发期前端已配置代理（`web/vite.config.ts` 的 `server.proxy`），因此**后端只需监听 8000 端口，不需要处理 CORS**。

---

## 10 条路由

| 路由 | 页面 |
| --- | --- |
| `/` | 首页（产品官网式：Hero、场景能力、工作流、核心特色、热门非遗） |
| `/heritage` | 非遗探索（搜索 + 分类 + 地区筛选 + 分页） |
| `/heritage/:id` | 非遗详情（七大板块 + 参考资料 + 创作入口） |
| `/creation` | AI 创作（三栏：创作参数 / 生成结果 / 参考知识） |
| `/video` | 视频创作（步骤条 + 分镜编辑 + 生成状态机） |
| `/works` | 我的作品（筛选 / 搜索 / 排序，文章与视频双形态卡片） |
| `/works/:id` | 作品详情（文章正文 + 参考资料，或视频与分镜脚本） |
| `/login`、`/register` | 登录 / 注册（左侧文化 Banner + 右侧表单） |
| 其他 | 404 页 |

`/creation`、`/video`、`/works`、`/works/:id` 需要登录，未登录会跳登录页并在登录后回到原地址。

---

## 当前状态

- 前端十个开发阶段全部完成，`vue-tsc` 与 `vite build` 均通过，静态审计零死代码。
- 数据全部来自 Mock：非遗资料 12 项、作品库与账号库持久化在浏览器 `localStorage`、视频任务为内存态。
- **非遗资料与参考资料均为示例数据，不代表官方认定结论**；正式参赛前需替换为可核验来源。
- 视频播放区为占位（接入真实视频生成后替换 `videoUrl` 即可）；下载按钮有明确提示，不是无响应的假按钮。
- 页面中不含学校名称、Logo 与指导教师信息。
