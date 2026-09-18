# 后端对接说明（FastAPI）

> 面向：负责后端的队友
> 前端已按本文契约完成全部实现，**后端只需按此实现端点**，前端把 `VITE_USE_MOCK` 置为 `false` 即可整体联调。
> 契约的权威来源是 `web/src/types/*.ts`（类型定义）与 `web/src/api/*.ts`（调用方式），本文是它们的展开说明。

---

## 1. 怎么联调

```bash
cd web
# 1) 让前端走真实接口
#    编辑 web/.env.development，把 VITE_USE_MOCK 改成 false
# 2) 启动后端，监听 127.0.0.1:8000
# 3) 启动前端
npm.cmd run dev          # http://127.0.0.1:5173/
```

- 开发期前端通过 **Vite 代理**把 `/api` 转发到 `http://127.0.0.1:8000`（见 `web/vite.config.ts` 的 `server.proxy`），
  因此**后端只需监听 8000 端口，不必自己处理 CORS**。
- 若后端端口不同，改 `web/vite.config.ts` 里的 `target` 即可。
- 生产部署建议同源（前端静态文件与 `/api` 由同一个 Nginx 提供），同样不需要 CORS。

快速自检（后端起来后）：

```bash
curl http://127.0.0.1:8000/api/heritages?page=1&pageSize=9
```

---

## 2. 统一响应包与错误约定

**所有**端点（含失败）都用统一响应包：

```json
{ "code": 0, "message": "ok", "data": { } }
```

| 约定 | 说明 |
| --- | --- |
| 成功 | `code` 为 `0` 或 `200`；前端取 `data` 作为业务数据 |
| 失败 | `code` 非 0/200；前端**直接把 `message` 弹给用户**（ElMessage），因此 `message` 必须是可直接展示的中文，例如「该用户名已被注册，换一个试试」 |
| 分页 | `data` 形如 `{ "list": [], "total": 0, "page": 1, "pageSize": 9 }` |
| 鉴权失败 | 返回 HTTP **401**；前端会清除本地令牌并跳转 `/login?redirect=<当前地址>` |
| 其他 HTTP 错误 | 前端按状态码给出兜底文案（400/403/404/5xx 各有默认提示），若响应体里有 `message` 则优先用它 |
| 超时 | 前端默认 15s；`/ai/generate`、`/ai/video-script`、`/ai/video-script/shot`、`/video/generate` 放宽到 **60s** |

---

## 3. 端点清单（共 15 个）

| # | 方法 | 路径 | 用途 | 前端调用位置 |
| --- | --- | --- | --- | --- |
| 1 | POST | `/api/auth/login` | 登录 | `api/auth.ts` |
| 2 | POST | `/api/auth/register` | 注册 | `api/auth.ts` |
| 3 | GET | `/api/heritages` | 非遗列表（关键词/分类/地区筛选 + 分页；`hot=true&limit=N` 取首页热门） | `api/heritage.ts` |
| 4 | GET | `/api/heritages/:id` | 非遗详情 | `api/heritage.ts` |
| 5 | POST | `/api/ai/generate` | 场景化内容生成 | `api/ai.ts` |
| 6 | POST | `/api/ai/video-script` | 由文案生成分镜脚本 | `api/ai.ts` |
| 7 | POST | `/api/ai/video-script/shot` | 重新生成单个分镜 | `api/video.ts` |
| 8 | POST | `/api/video/generate` | 创建视频生成任务 | `api/video.ts` |
| 9 | GET | `/api/video/:id/status` | 查询视频任务状态 | `api/video.ts` |
| 10 | GET | `/api/works` | 作品列表（筛选 + 排序 + 分页） | `api/work.ts` |
| 11 | GET | `/api/works/:id` | 作品详情 | `api/work.ts` |
| 12 | POST | `/api/works` | 新建作品 | `api/work.ts` |
| 13 | PUT | `/api/works/:id` | 更新作品 | `api/work.ts` |
| 14 | DELETE | `/api/works/:id` | 删除作品 | `api/work.ts` |
| 15 | POST | `/api/feedback` | 意见反馈 | `api/feedback.ts` |

> 6、7 是提示词清单之外、为支撑界面上的「生成视频脚本」与分镜「重新生成」按钮而新增的两个端点；
> 3 的 `hot=true` 是复用列表端点支持首页热门推荐，不单独开端点。

**鉴权**：除 1、2、15 外，其余端点前端都会带上 `Authorization: Bearer <token>`。
令牌由登录/注册返回，前端存在 `localStorage` 的 `yiyun:token`（注意：值本身是 JSON 字符串，读出来就是 token 原文）。

---

## 4. 各端点请求 / 响应示例

### 4.1 登录

```http
POST /api/auth/login
Content-Type: application/json

{ "username": "非遗创作者", "password": "yiyun2026" }
```

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "u_1001",
      "username": "非遗创作者",
      "email": "creator@example.com",
      "avatar": "",
      "bio": "文旅宣传工作者，关注非遗的当代表达",
      "createdAt": "2026-01-08T01:30:00.000Z"
    }
  }
}
```

失败示例（前端会直接弹这句）：`{ "code": 40101, "message": "密码不正确，请重新输入", "data": null }`

### 4.2 注册

```http
POST /api/auth/register
{ "username": "测试用户", "email": "tester@example.com", "password": "abc123456", "confirmPassword": "abc123456" }
```

返回与登录一致（`LoginResult`）；前端注册成功后**直接进入登录态**（不再要求重新登录）。

建议后端校验：用户名 2–20 字符且唯一、邮箱格式与唯一、密码 ≥ 6 位、两次密码一致。

### 4.3 非遗列表

```http
GET /api/heritages?keyword=皮影&category=传统戏剧&region=陕西&page=1&pageSize=9
GET /api/heritages?hot=true&limit=6          # 首页热门推荐
```

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "id": "shadow-puppetry",
        "name": "皮影戏",
        "category": "传统戏剧",
        "region": "陕西",
        "cover": "",
        "summary": "用兽皮雕刻影人、借灯光投映于幕布的民间戏剧，一人可操影、多人可配唱。",
        "history": "……",
        "features": "……",
        "technique": "……",
        "cultureValue": "……",
        "tags": ["灯影", "影人雕刻", "碗碗腔", "牛皮影"],
        "level": "国家级",
        "views": 12800,
        "stories": [{ "title": "一张牛皮唱尽千古", "content": "……" }],
        "sources": [
          {
            "id": "src-puppet-1",
            "title": "国家级非物质文化遗产代表性项目名录·皮影戏",
            "content": "资料片段……",
            "source": "中国非物质文化遗产网",
            "similarity": 0.96,
            "type": "official",
            "year": "2021"
          }
        ]
      }
    ],
    "total": 12,
    "page": 1,
    "pageSize": 9
  }
}
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `category` | 枚举 | `传统戏剧 \| 传统美术 \| 传统技艺 \| 传统音乐 \| 传统舞蹈 \| 民俗` |
| `region` | 枚举 | `北京 \| 江苏 \| 浙江 \| 四川 \| 陕西 \| 广东 \| 其他` |
| `cover` | string | 图片地址；**为空时前端会绘制程序化 SVG 封面**（离线可用），填真实图片即可自动生效 |
| `sources[].similarity` | number | **0~1 的小数**，前端按百分比展示（0.96 → 96%） |
| `sources[].type` | 枚举（可选） | `book \| journal \| museum \| official \| news`，用于来源徽标 |
| `stories` / `level` / `views` | 可选 | 详情页「相关故事」、保护级别徽标、热度 |

- `hot=true` 时返回 `data` 为**数组**（不是分页对象），顺序即首页展示顺序（前端期望皮影戏、昆曲、苏绣、剪纸、景泰蓝、川剧变脸在前）。
- 筛选参数 `category` / `region` 传「全部」时前端**不会发这个参数**，后端可按缺省处理。

### 4.4 非遗详情

`GET /api/heritages/shadow-puppetry` → `data` 为单个 `Heritage`；未找到返回非 0 的 `code` 与「未找到该非遗项目」，前端会展示「没有找到这个非遗项目」兜底页。

### 4.5 场景化内容生成（核心）

```http
POST /api/ai/generate
{
  "heritageId": "cloisonne",
  "scene": "article",
  "platform": "公众号",
  "audience": "年轻游客",
  "style": "国潮年轻",
  "length": "500 字",
  "focus": "突出掐丝工序与烧制次数"
}
```

| 参数 | 取值 |
| --- | --- |
| `scene` | `article`（文旅推文）\| `video`（短视频脚本）\| `live`（直播话术）\| `package`（文创包装） |
| `platform` | 推文：公众号/小红书/微博；短视频：抖音/视频号/B站；直播：抖音/视频号/淘宝直播 |
| `audience` | 推文：年轻游客/家庭游客/文化爱好者；文创：年轻消费者/文化爱好者/礼品采购/企业客户 |
| `style` | 推文：专业文化/国潮年轻/故事化/轻松活泼；短视频：国潮/纪录片/年轻化/故事感；直播（语气）：专业/热情/年轻；文创（包装风格）：国潮雅致/简约现代/复古手作/高端礼品 |
| `length` | 推文：`300 字`/`500 字`/`800 字`；短视频：`15 秒`/`30 秒`/`60 秒`；直播：`1 分钟`/`3 分钟`/`5 分钟` |
| `focus` | 推文=重点内容、短视频=传播目标、直播=直播场景、文创=宣传重点 |
| `extra` | 场景专属字段：短视频 `{ "topic": "切入角度" }`、直播 `{ "interaction": "互动设计" }`、文创 `{ "productType": "文创摆件" }` |

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "cr_8f2k1",
    "title": "景泰蓝也能很潮：北京正在重新讲述它",
    "content": "## 一、先说结论\n\n……（**Markdown 正文**）……\n\n## 二、它凭什么被称为「传统技艺」\n\n……[1]\n",
    "sources": [
      { "id": "src-cloisonne-1", "title": "国家级非物质文化遗产代表性项目名录·景泰蓝制作技艺", "content": "……", "source": "中国非物质文化遗产网", "similarity": 0.94, "type": "official" },
      { "id": "src-cloisonne-2", "title": "院藏珐琅器公开资料：器型与纹样", "content": "……", "source": "故宫博物院公开资料", "similarity": 0.9, "type": "museum" }
    ],
    "createdAt": "2026-09-19T13:20:00.000Z",
    "heritageId": "cloisonne",
    "scene": "article",
    "videoScript": null
  }
}
```

要求：

- `content` 必须是 **Markdown**（前端用 markdown-it 渲染，`html` 解析已关闭，请不要返回原始 HTML 标签）；表格、标题、列表、引用都支持。
- `sources` 返回 **2~3 条**，条数会显示在结果顶部「AI 已基于 **N** 条非遗资料完成创作」，同时渲染到右侧「AI 参考资料」栏。
- 正文里可用 `[1]`、`[2]` 角标，与 `sources` 顺序对应（前端目前按纯文本展示，不做点击联动）。
- `scene = "video"` 时额外返回 `videoScript`（见下），前端会展示分镜预览并出现「进入视频创作」按钮。

### 4.6 分镜脚本

```http
POST /api/ai/video-script
{ "heritageId": "shadow-puppetry", "duration": 30, "style": "国潮" }
```

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "vs_3k9",
    "title": "皮影戏 · 国潮非遗宣传短片",
    "duration": 30,
    "shots": [
      {
        "id": "shot-1-a1b2",
        "index": 1,
        "start": 0,
        "end": 6,
        "scene": "昏暗的幕布逐渐亮起，一道人物剪影出现。",
        "narration": "一灯、一幕、一双手，讲述跨越千年的故事。",
        "prompt": "traditional Chinese shadow puppetry, warm lantern light, cinematic, 4k",
        "cover": ""
      }
    ]
  }
}
```

- **镜头数约定**（前端按此时长选择展示，后端也建议一致）：`≤15 秒 → 3 镜`、`≤30 秒 → 5 镜`、`>30 秒 → 6 镜`。
- `start` / `end` 为**秒**（整数），需覆盖 `0 ~ duration` 且首尾相接。
- `prompt` 建议英文（后续直接喂视频生成模型）；`scene` 与 `narration` 用中文。

### 4.7 重新生成单个分镜

```http
POST /api/ai/video-script/shot
{ "heritageId": "shadow-puppetry", "shot": { "id": "shot-2-b2c3", "index": 2, "start": 6, "end": 12, "scene": "……", "narration": "……", "prompt": "……" } }
```

返回**同一个分镜的新版本**（`data` 为单个 `Storyboard`，`id`/`index`/`start`/`end` 保持原值，`scene`/`narration`/`prompt` 换一版措辞）。

### 4.8 视频任务

```http
POST /api/video/generate
{
  "heritageId": "shadow-puppetry",
  "workId": "w_1005",
  "title": "皮影戏 · 国潮非遗宣传短片",
  "platform": "抖音",
  "style": "国潮",
  "duration": 30,
  "storyboards": [ /* 与 4.6 的 shots 结构相同 */ ]
}
```

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "vt_8k2",
    "title": "皮影戏 · 国潮非遗宣传短片",
    "heritageId": "shadow-puppetry",
    "heritageName": "皮影戏",
    "duration": 30,
    "platform": "抖音",
    "style": "国潮",
    "status": "pending",
    "progress": 0,
    "storyboards": [],
    "cover": "",
    "videoUrl": "",
    "createdAt": "2026-09-19T13:22:00.000Z",
    "updatedAt": "2026-09-19T13:22:00.000Z"
  }
}
```

```http
GET /api/video/vt_8k2/status
```

| 字段 | 说明 |
| --- | --- |
| `status` | `pending` → `generating` → `success` \| `failed` |
| `progress` | 0~100 整数，前端用进度条展示；`generating` 期间递增 |
| `errorMessage` | 仅 `failed` 时给，会原样展示在失败卡片里，建议写清是哪个镜头出了问题 |
| `videoUrl` | `success` 时给可访问的视频地址（前端播放区目前是占位，接入后即可播放/下载） |

**轮询节奏（前端固定）**：每 **1.2 秒**请求一次 `/api/video/:id/status`，**最多 40 次**（约 48 秒）后超时判定失败。
因此建议后端在 30 秒内出结果；若确实更久，请与前端一起调整这个上限（在 `web/src/stores/video.ts` 的 `POLL_MAX_ATTEMPTS`）。

> 请求体里前端**不会**发 `simulate` 字段（那是 Mock 阶段用于演示失败态的开关，只在本地 Mock 生效）。

### 4.9 作品

```http
GET /api/works?keyword=昆曲&type=article&sort=latest&page=1&pageSize=9
```

| 参数 | 取值 |
| --- | --- |
| `type` | `article`（文旅推文）\| `video`（短视频脚本）\| `live`（直播话术）\| `package`（文创包装）\| `videoWork`（视频作品）；不传=全部 |
| `sort` | `latest`（默认，创建时间倒序）\| `oldest` |
| `keyword` | 匹配标题、摘要、非遗名称 |

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "id": "w_1006",
        "title": "一灯一幕一双手：皮影戏的当代表达",
        "type": "article",
        "heritageId": "shadow-puppetry",
        "heritageName": "皮影戏",
        "heritageCategory": "传统戏剧",
        "summary": "从一张牛皮到一台戏……",
        "content": "## 一盏灯，演了千年\n\n……",
        "sources": [ /* 同 Source */ ],
        "cover": "",
        "duration": null,
        "style": null,
        "videoTaskId": null,
        "storyboards": null,
        "createdAt": "2026-09-19T11:00:00.000Z",
        "updatedAt": "2026-09-19T11:00:00.000Z"
      }
    ],
    "total": 7, "page": 1, "pageSize": 9
  }
}
```

- `POST /api/works` 入参是 `Work` 的子集（前端会带 `title`、`type`、`heritageId`、`heritageName`、`summary`、`content`，视频作品额外带 `duration`、`style`、`storyboards`、`videoTaskId`），返回完整 `Work`。
- `PUT /api/works/:id` 只传要改的字段（编辑弹窗会传 `title` 与 `content`，或 `title` 与 `summary`），返回更新后的 `Work`。
- `DELETE /api/works/:id` 返回 `{ "success": true }`。
- **`type` 的语义要注意**：`video` 指「短视频脚本」（文案类作品），`videoWork` 指「生成好的视频作品」，两者在「我的作品」里是两个独立筛选项，不能混用。

### 4.10 意见反馈

```http
POST /api/feedback
{ "type": "suggestion", "content": "建议在创作页增加历史记录对比", "contact": "me@example.com", "page": "/creation" }
```

`type` 取值：`suggestion`（功能建议）\| `bug`（问题反馈）\| `content`（资料纠错）\| `other`。
返回 `{ "success": true, "id": "fb_1", "createdAt": "..." }`；内容少于 5 个字时请返回非 0 `code` 与提示文案。

---

## 5. 建议的实现顺序

1. `GET /api/heritages` + `GET /api/heritages/:id`（前端首页、探索、详情页立刻可用）
2. `POST /api/auth/login` + `register`（打通登录态）
3. `POST /api/ai/generate`（创作页主干）
4. `GET/POST/PUT/DELETE /api/works`（作品库）
5. `POST /api/ai/video-script`、`POST /api/video/generate`、`GET /api/video/:id/status`（视频链路）
6. `POST /api/ai/video-script/shot`、`POST /api/feedback`（细节功能）

每完成一个端点，把 `web/.env.development` 的 `VITE_USE_MOCK` 改为 `false`，刷新页面即可看到真实数据；某个端点还没做时会显示失败态与「重新加载」按钮，不影响其他页面。

---

## 6. 交接素材

| 内容 | 位置 |
| --- | --- |
| 类型定义（字段的权威来源） | `web/src/types/*.ts` |
| 前端调用方式（路径、参数、超时） | `web/src/api/*.ts` |
| Mock 实现（可作为返回结构的参考样例） | `web/src/mock/*.ts`，其中非遗数据在 `mock/heritage.ts` |
| 架构与端点总表 | `docs/01-architecture.md` §5 |
| 前端自检脚本 | `web/.verify/probe-apilayer.mjs`（`PROBE_MODE=realapi` 可验证真实接口模式下的页面表现） |
