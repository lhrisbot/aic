# 遗韵智创前端—Coze Workflow 交接说明

更新时间：2026-09-19

## 1. Workflow 在产品中的位置

前端不是聊天机器人界面，而是一个任务型内容生产工作台：

```text
选择非遗项目
    ↓
检索非遗知识库
    ↓
按场景生成内容
    ↓
生成短视频脚本与分镜
    ↓
提交视频生成任务
    ↓
保存为作品
```

前端已经完成页面和状态流，Workflow 只需要稳定返回约定的数据结构。

## 2. 四个创作场景

前端传入的 `scene`：

| scene | 页面名称 | 主要用途 |
|---|---|---|
| `article` | 文旅推文 | 公众号、小红书、微博宣传内容 |
| `video` | 短视频 | 短视频文案、旁白、分镜 |
| `live` | 直播话术 | 非遗介绍、文创带货、景区宣传 |
| `package` | 文创包装 | 包装文案、文化释义、产品故事 |

通用字段：

```json
{
  "heritageId": "非遗项目 ID",
  "scene": "article",
  "platform": "公众号",
  "audience": "年轻游客",
  "style": "国潮年轻",
  "length": "500 字",
  "focus": "用户补充的重点",
  "extra": {}
}
```

场景专属字段放入 `extra`：

- 短视频：`extra.topic`
- 直播话术：`extra.interaction`
- 文创包装：`extra.productType`

具体字段声明在：

```text
web/src/config/sceneSchema.ts
```

## 3. RAG 输出要求

Workflow 需要让前端能够展示“这次生成依据了哪些资料”，不能只返回一段无来源文本。

每条资料至少需要：

```json
{
  "id": "source-001",
  "title": "资料标题",
  "content": "被检索到的原文片段或摘要",
  "source": "来源机构、书名或网站名称",
  "similarity": 0.95,
  "type": "official",
  "year": "2024"
}
```

推荐额外返回：

```json
{
  "url": "https://...",
  "author": "作者或机构",
  "verified": true,
  "retrievalReason": "与本次创作目标的匹配原因"
}
```

前端右侧知识面板会展示：

- 来源标题
- 资料片段
- 来源类型
- 年份
- 相关度
- 本次引用数量

如果没有足够可靠的资料，建议 Workflow 返回明确错误或低置信状态，不要强行生成确定性事实。

## 4. 内容生成输出

`POST /api/ai/generate` 返回：

```json
{
  "id": "creation-001",
  "title": "内容标题",
  "content": "Markdown 内容",
  "sources": [],
  "createdAt": "2026-09-19T00:00:00.000Z",
  "heritageId": "shadow-puppetry",
  "scene": "article"
}
```

前端支持 Markdown，因此 Workflow 可以使用：

- `##` 二级标题
- 列表
- 粗体
- 引用
- 简单表格

不建议返回带有未经确认的 HTML 或脚本。

如果引用资料，推荐在正文中保留引用编号：

```markdown
皮影戏以灯光、幕布和雕刻皮影构成独特的视觉语言。[1]
```

这样前端可以把正文引用和右侧来源卡片对应起来。

## 5. 短视频脚本 Workflow

接口：

```text
POST /api/ai/video-script
```

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
      "narration": "旁白",
      "prompt": "AI Video Prompt",
      "cover": "https://..."
    }
  ]
}
```

分镜设计建议：

`content` 非空时，Workflow 应根据文案的重点、叙事顺序和事实依据拆分镜头，避免只按非遗项目名称套模板；留空时才按非遗资料直接生成。

- 15 秒：3～4 个镜头
- 30 秒：5～6 个镜头
- 60 秒：8～10 个镜头

每个镜头最好包含清晰的：

- 景别
- 主体动作
- 场景环境
- 光线和色彩
- 镜头运动
- 旁白节奏

## 6. 单镜头重新生成

接口：

```text
POST /api/ai/video-script/shot
```

输入当前镜头和 `heritageId`，只替换：

- `scene`
- `narration`
- `prompt`

前端会保留：

- `id`
- `index`
- `start`
- `end`

因此 Workflow 不需要重新计算整个时间轴。

## 7. 视频生成任务

视频页不是直接等待 Workflow 返回视频，而是：

```text
提交任务 → pending → generating → success / failed
```

接口：

```text
POST /api/video/generate
GET  /api/video/:id/status
```

视频任务必须支持：

- 任务 ID
- 当前状态
- 进度 0～100
- 当前分镜快照
- 错误信息
- 最终视频地址
- 视频封面地址

成功响应必须带：

```json
{
  "status": "success",
  "progress": 100,
  "videoUrl": "https://.../video.mp4",
  "cover": "https://.../cover.jpg"
}
```

前端会直接把 `videoUrl` 交给播放器和下载按钮使用。

如果用户从 AI 创作页带着编辑后的文案进入视频页，前端会把该文案放在视频脚本编辑区，并在重新拆分分镜、提交视频任务时继续使用；保存为视频作品时也会写入 `Work.content`，便于后续从作品库继续加工。

## 8. Workflow 失败处理

失败时不要只返回空数据，建议返回：

```json
{
  "code": 4001,
  "message": "知识库中没有足够可靠的资料支持本次生成",
  "data": null
}
```

或在视频任务中返回：

```json
{
  "status": "failed",
  "progress": 100,
  "errorMessage": "镜头 03 的画面描述无法生成，请调整后重试"
}
```

前端会把 `message` 或 `errorMessage` 直接展示给用户，因此请避免返回内部堆栈、模型调用细节或不可读的英文错误。

## 9. 前端当前的 Mock 行为

当前 Mock 代码位于：

```text
web/src/mock/ai.ts
web/src/mock/video.ts
web/src/mock/heritage.ts
```

Mock 的作用是保证前端页面可以独立演示，不代表最终 Workflow 逻辑。

Workflow 接入时只要保持：

- 字段名称不变
- 字段类型不变
- 响应包结构不变
- 状态值不变

前端页面不需要重写。

## 10. 联调顺序

推荐按以下顺序联调：

1. `GET /heritages` 和 `GET /heritages/:id`
2. `POST /ai/generate` 的四种场景
3. `POST /ai/video-script`
4. `POST /ai/video-script/shot`
5. `POST /video/generate` 和状态轮询
6. `POST /works` 保存作品
7. `GET /works` 和 `GET /works/:id` 回显作品

每完成一个接口，先用 Mock 数据结构做字段对比，再切换 `VITE_USE_MOCK=false`。
