# 遗韵智创前端—后端交接说明

更新时间：2026-09-19

## 1. 交接范围

前端当前负责：

- 页面展示、表单校验、加载态、错误态、空状态
- Pinia 状态管理
- API 请求封装与 Mock / 真实接口切换
- AI 创作结果到视频创作页的前端草稿衔接
- 视频任务轮询与分镜编辑

后端负责：

- 用户、非遗项目、作品、反馈数据持久化
- JWT 或其他登录态校验
- Coze Workflow / RAG / AI 视频服务调用
- 视频任务异步执行与状态持久化

前端不会依赖后端返回页面专用字段。请优先保持下面的业务字段稳定。

## 2. 统一响应格式

真实接口建议统一返回：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

前端 `src/utils/request.ts` 会自动取出 `data`。因此页面和 Store 收到的是 `data` 内部对象，不需要再次访问 `response.data.data`。

约定：

- `code = 0` 表示成功
- 非 0 code 由前端转成错误提示
- HTTP 401 表示登录态失效，前端会清理 Token 并跳转登录页
- HTTP 4xx / 5xx 需要返回可直接展示的 `message`

## 3. 鉴权

### `POST /api/auth/login`

请求：

```json
{
  "username": "demo",
  "password": "123456"
}
```

响应：

```json
{
  "token": "jwt-token",
  "user": {
    "id": "u_001",
    "username": "非遗创作者",
    "email": "demo@example.com",
    "avatar": "",
    "bio": "",
    "createdAt": "2026-09-19T00:00:00.000Z"
  }
}
```

前端会自动发送：

```text
Authorization: Bearer <token>
```

### `POST /api/auth/register`

请求字段：

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

当前前端注册成功后直接使用返回的 `token` 和 `user` 登录。

## 4. 非遗接口

### `GET /api/heritages`

查询参数：

```text
keyword?: string
category?: 传统戏剧 | 传统美术 | 传统技艺 | 传统音乐 | 传统舞蹈 | 民俗
region?: 北京 | 江苏 | 浙江 | 四川 | 陕西 | 广东 | 其他
page?: number
pageSize?: number
hot?: boolean
limit?: number
```

普通分页响应：

```json
{
  "list": [],
  "total": 12,
  "page": 1,
  "pageSize": 9
}
```

当带有 `hot=true` 时，前端当前按 `Heritage[]` 读取热门列表。

### `GET /api/heritages/:id`

返回完整 `Heritage`：

```json
{
  "id": "shadow-puppetry",
  "name": "皮影戏",
  "category": "传统戏剧",
  "region": "陕西",
  "cover": "https://...",
  "summary": "...",
  "history": "...",
  "features": "...",
  "technique": "...",
  "cultureValue": "...",
  "level": "国家级",
  "tags": ["灯影", "雕刻"],
  "sources": [
    {
      "id": "source-001",
      "title": "资料标题",
      "content": "可用于生成的资料片段",
      "source": "来源机构或书名",
      "similarity": 0.95,
      "type": "official",
      "year": "2024"
    }
  ]
}
```

`Source` 中的 `id` 必须稳定，因为前端会使用它展示引用关系。
建议同时返回 `url`（可核验原始资料链接）和 `locator`（页码、段落或馆藏编号）。
正文中的 `[1]` 会定位到本次结果 `sources[0]`；请保持引用序号与数组顺序一致。

## 5. AI 创作接口

### `POST /api/ai/generate`

请求：

```json
{
  "heritageId": "shadow-puppetry",
  "scene": "article",
  "platform": "公众号",
  "audience": "年轻游客",
  "style": "国潮年轻",
  "length": "500 字",
  "focus": "突出技艺传承和旅行体验",
  "extra": {}
}
```

`scene` 当前只有四种：

- `article`：文旅推文
- `video`：短视频脚本
- `live`：直播话术
- `package`：文创包装

响应：

```json
{
  "id": "creation-001",
  "title": "生成标题",
  "content": "Markdown 正文",
  "sources": [],
  "createdAt": "2026-09-19T00:00:00.000Z",
  "heritageId": "shadow-puppetry",
  "scene": "article"
}
```

如果 `scene = video`，可以额外返回 `videoScript`，但当前前端也支持稍后单独请求视频脚本。

## 6. 视频脚本接口

### `POST /api/ai/video-script`

请求：

```json
{
  "heritageId": "shadow-puppetry",
  "duration": 30,
  "style": "国潮",
  "content": "用户确认或编辑后的宣传主题与文案，可选"
}
```

响应：

```json
{
  "id": "script-001",
  "title": "皮影戏 · 国潮非遗宣传短片",
  "duration": 30,
  "shots": [
    {
      "id": "shot-001",
      "index": 1,
      "start": 0,
      "end": 5,
      "scene": "画面描述",
      "narration": "旁白文本",
      "prompt": "AI video prompt",
      "cover": "https://..."
    }
  ]
}
```

要求：

- `start`、`end` 使用秒
- `end` 必须大于 `start`
- 所有镜头不能超出 `duration`
- `index` 从 1 开始
- `id` 在一次脚本中稳定唯一
- `content` 非空时，脚本必须以它为内容依据；留空时才由非遗资料直接生成

### `POST /api/ai/video-script/shot`

用于单个分镜重新生成。当前前端发送：

```json
{
  "heritageId": "shadow-puppetry",
  "shot": {
    "id": "shot-001",
    "index": 1,
    "start": 0,
    "end": 5,
    "scene": "画面描述",
    "narration": "旁白文本",
    "prompt": "AI video prompt"
  }
}
```

返回一个新的 `Storyboard` 对象即可。前端会保留原来的 `id`、编号和时间范围。

## 7. 作品接口

### `GET /api/works`

查询参数：

```text
keyword?: string
type?: article | video | live | package | videoWork | 全部
sort?: latest | oldest
page?: number
pageSize?: number
```

其中：

- `video` 表示短视频脚本作品
- `videoWork` 表示已经提交视频任务并完成的视频作品

请不要合并这两个类型。

### `GET /api/works/:id`

返回完整 `Work` 对象。视频作品需要带上：

```json
{
  "type": "videoWork",
  "content": "用户确认后的宣传主题或脚本文案",
  "duration": 30,
  "style": "国潮",
  "videoTaskId": "task-001",
  "videoUrl": "https://...",
  "cover": "https://...",
  "storyboards": []
}
```

前端 `Work` 类型已经声明 `videoUrl`，返回真实 `http/https` 地址后，作品详情页会自动切换为原生播放器；Mock 的 `mock-video://` 地址仍显示演示占位区。

### `POST /api/works`

用于保存 AI 文案、短视频脚本或视频作品。

前端目前会提交：

- `title`
- `type`
- `heritageId`
- `heritageName`
- `summary`
- `content`
- `sources`
- 视频相关的 `duration`、`style`、`videoTaskId`、`videoUrl`、`storyboards`

其中视频作品的 `content` 用于保存用户确认后的宣传主题 / 脚本文案，前端从「我的作品」继续进入视频创作时会回填到脚本编辑区；不能只保存分镜而丢掉这段上下文。

### `PUT /api/works/:id`

用于编辑标题、正文或摘要。

### `DELETE /api/works/:id`

成功返回：

```json
{ "success": true }
```

所有作品接口必须按当前登录用户隔离数据。
演示版使用浏览器 Mock 作品库，未按用户隔离；真实后端不能沿用这一行为。

## 8. 视频任务接口

### `POST /api/video/generate`

请求：

```json
{
  "heritageId": "shadow-puppetry",
  "workId": "work-001",
  "title": "皮影戏宣传短片",
  "platform": "抖音",
  "style": "国潮",
  "duration": 30,
  "storyboards": []
}
```

注意：`simulate` 只用于前端 Mock 演示，真实接口不会收到该字段。

响应必须返回 `VideoTask`：

```json
{
  "id": "task-001",
  "title": "皮影戏宣传短片",
  "heritageId": "shadow-puppetry",
  "heritageName": "皮影戏",
  "duration": 30,
  "platform": "抖音",
  "style": "国潮",
  "status": "pending",
  "progress": 0,
  "storyboards": [],
  "videoUrl": "",
  "cover": "",
  "createdAt": "2026-09-19T00:00:00.000Z",
  "updatedAt": "2026-09-19T00:00:00.000Z"
}
```

### `GET /api/video/:id/status`

状态只使用：

- `pending`
- `generating`
- `success`
- `failed`

`success` 时必须返回可访问的 `videoUrl`。前端会轮询，成功或失败后停止轮询。

`failed` 时请返回：

```json
{
  "status": "failed",
  "progress": 100,
  "errorMessage": "可直接展示给用户的失败原因"
}
```

## 9. 反馈接口

### `POST /api/feedback`

当前前端反馈表单字段以 `src/types/feedback.ts` 为准，后端只需要返回：

```json
{
  "success": true,
  "message": "反馈已提交"
}
```

## 10. 前后端联调检查清单

- [ ] 所有成功响应都包在 `data` 中
- [ ] 401 能正常触发重新登录
- [ ] 非遗列表分页字段完整
- [ ] Source ID 稳定且来源真实可追溯
- [ ] AI 结果 `content` 支持 Markdown
- [ ] 视频脚本时间轴不重叠、不超时长
- [ ] 作品按用户隔离
- [ ] 视频任务支持轮询恢复
- [ ] 视频成功后 `videoUrl` 可直接播放
- [ ] 删除和更新接口返回明确结果
