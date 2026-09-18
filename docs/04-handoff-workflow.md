# Workflow（Coze）对接说明

> 面向：负责 Coze Workflow / AI 能力的队友
> 本文说明前端需要哪些工作流、每条工作流的**输入字段与必须返回的结构**，以及验收要点。
> 后端队友按 `docs/03-handoff-backend.md` 把这几个工作流包成 REST 端点，前端即可直接用真实结果替换 Mock。

---

## 1. 分工与数据流

```
前端 (web/)  ──►  FastAPI (后端队友)  ──►  Coze Workflow（你）
   │                     │                      │
   │  POST /api/ai/generate                     │
   └────────────► 取参数 + 拼 prompt ──────────► 检索 + 生成
                                                  │
   ◄──── Markdown 正文 + sources ◄──────── 返回结构化 JSON
```

- 前端**不直接调 Coze**，所有 AI 调用都走后端端点（这样令牌不暴露在浏览器里）。
- 你交付的成果是**工作流本身 + 其输入输出契约**；联调时可以让后端先把端点做成"透传"（收到请求→调 Coze→按约定返回 JSON）。

---

## 2. 需要的工作流（4 条必需 + 2 条建议）

| # | 工作流 | 对应端点 | 必需性 |
| --- | --- | --- | --- |
| W1 | 非遗知识库检索（RAG） | 被 W2/W3 内部调用 | 必需 |
| W2 | 场景化内容生成（推文 / 直播话术 / 文创包装） | `POST /api/ai/generate` | 必需 |
| W3 | 短视频脚本 + 分镜生成 | `POST /api/ai/generate`（`scene=video`）与 `POST /api/ai/video-script` | 必需 |
| W4 | 单镜重新生成 | `POST /api/ai/video-script/shot` | 必需 |
| W5 | 视频生成（分镜 → 视频文件） | `POST /api/video/generate` + `GET /api/video/:id/status` | 建议（可先返回占位成功） |
| W6 | 内容事实校验（生成后自检） | 无独立端点，可作为 W2/W3 内部的一步 | 建议（比赛加分项） |

---

## 3. W1 非遗知识库检索

**输入**：`{ heritageId, heritageName, scene, query?, topK }`

**输出**（数组，2~3 条）：

```json
[
  {
    "id": "src-puppet-1",
    "title": "国家级非物质文化遗产代表性项目名录·皮影戏",
    "content": "资料片段（100~200 字，用于展示与引用）",
    "source": "中国非物质文化遗产网",
    "similarity": 0.96,
    "type": "official",
    "year": "2021"
  }
]
```

要求：

- `similarity` 必须是 **0~1 的小数**（前端按百分比展示，0.96 → 96%）；如果你的检索得分是 0~100，请在返回前除以 100。
- `type` 取值：`book`（志书）\| `journal`（学术期刊）\| `museum`（博物馆）\| `official`（官方网站）\| `news`（媒体报道），用于来源徽标。
- `content` 是**资料片段**而不是全文，控制在 100~200 字，右栏卡片直接展示。
- 知识库建议：把 `web/src/mock/heritage.ts` 里 12 个非遗项目的 `history` / `features` / `technique` / `cultureValue` / `sources` 文本导入作为知识库文档（正式版本再替换为可核验来源）。

---

## 4. W2 场景化内容生成

**输入**（由后端从 `CreationRequest` 转过来）：

```json
{
  "heritageId": "cloisonne",
  "heritageName": "景泰蓝",
  "region": "北京",
  "category": "传统技艺",
  "scene": "article",
  "platform": "公众号",
  "audience": "年轻游客",
  "style": "国潮年轻",
  "length": "500 字",
  "focus": "突出掐丝工序与烧制次数",
  "extra": { "productType": "文创摆件" },
  "knowledge": [ /* W1 的检索结果，直接作为事实依据 */ ]
}
```

**输出**：

```json
{
  "title": "景泰蓝也能很潮：北京正在重新讲述它",
  "content": "## 一、先说结论\n\n……\n\n## 二、它凭什么被称为「传统技艺」\n\n……[1][2]\n"
}
```

硬性要求：

1. **`content` 是 Markdown**，不要输出 HTML 标签（前端已关闭 HTML 解析，标签会被转义成可见文本）。
   Markdown 支持：`##` 标题、`-` 列表、`**加粗**`、`>` 引用、表格、`` `代码` ``。
2. **标题单独返回**（`title`），不要把它写进 `content` 的第一行。
3. **只用 `knowledge` 里的事实**：不要编造年代、数字、名录级别；资料没写的内容宁可不写。
4. 正文可用 `[1]`、`[2]` 标注引用，序号与 `knowledge` 数组顺序一致（前端按纯文本展示）。
5. **参数必须真实生效**（这是比赛演示的重点，评委通常现场改参数看差异）：

| 场景 | 参数生效的验收点 |
| --- | --- |
| 文旅推文 | 「300 字 / 500 字 / 800 字」三段正文长度要有明显差异（实测：3 / 4 / 5 个板块）；平台影响排版与语气；人群与风格影响措辞 |
| 短视频脚本 | 时长决定镜头数（见 W3）；`focus`（传播目标）影响内容重心 |
| 直播话术 | 时长决定分段节奏（1 / 3 / 5 分钟）；`focus`（直播场景）决定讲解重点；`extra.interaction` 要体现在互动环节 |
| 文创包装 | `extra.productType` 体现在产品命名与文案里；风格影响用语；人群影响场景描述 |

各场景的内容结构建议（与前端展示习惯一致）：

- **文旅推文**：分节小标题 + 可扫读的要点列表 + 到访建议 + 收尾
- **短视频脚本**：视频信息表（平台/时长/风格/传播目标）+ 内容主线 + 分镜脚本 + 拍摄提示
- **直播话术**：直播信息表 + 按时间分段的话术（开场/讲解/互动/转化/收尾）+ 直播提示
- **文创包装**：主标语 + 产品与人群表 + 文化释义 + 包装正/背面文案 + 场景与礼赠

---

## 5. W3 短视频脚本 + 分镜

两种触发方式需要同一份产出：

- 创作页把场景选为「短视频脚本」→ `POST /api/ai/generate`（`scene: "video"`）→ 除 `title`/`content` 外**额外返回 `videoScript`**
- 创作页或视频页点「生成视频脚本」→ `POST /api/ai/video-script`

**输入**：`{ heritageId, heritageName, region, category, duration, style, focus?, extra? }`

**输出**：

```json
{
  "id": "vs_3k9",
  "title": "皮影戏 · 国潮非遗宣传短片",
  "duration": 30,
  "shots": [
    {
      "id": "shot-1-a1b2",
      "index": 1,
      "start": 0,
      "end": 6,
      "scene": "昏暗的幕布逐渐亮起，一道人物剪影出现，环境声先入。",
      "narration": "一灯、一幕、一双手，讲述跨越千年的故事。",
      "prompt": "traditional Chinese shadow puppetry, warm lantern light, cinematic, 4k",
      "cover": ""
    }
  ]
}
```

硬性要求：

| 项 | 约定 |
| --- | --- |
| 镜头数 | `≤15 秒 → 3 镜`、`≤30 秒 → 5 镜`、`>30 秒 → 6 镜`（前端分镜预览与视频页按此时长展示） |
| 时间轴 | `start`/`end` 为整数秒，`start` 从 0 开始，逐镜首尾相接，最后一镜 `end = duration` |
| `index` | 从 1 开始连续编号（前端展示为「镜头 01」） |
| `scene` | 画面描述（中文，1~2 句，含机位/景别/光线更好） |
| `narration` | 旁白（中文，口语化，语速按每秒 3~4 字控制） |
| `prompt` | **英文**，给视频生成模型用：主体 + 风格 + 光线 + 镜头运动 + `4k / cinematic` |
| `id` | 唯一字符串，前端用它做增删改的键 |

分镜内容建议遵循「细节特写 → 手艺动作 → 观众反应 → 片名落板」的叙事结构（与前端示例一致）。

---

## 6. W4 单镜重新生成

**输入**：`{ heritageId, shot: { id, index, start, end, scene, narration, prompt } }`

**输出**：同一个分镜的**新版本**，`id` / `index` / `start` / `end` **必须保持原值**，只换 `scene` / `narration` / `prompt` 的措辞（例如换机位、换语气、加环境声）。

这样前端点击「重新生成」时，卡片位置与时间轴不会跳动。

---

## 7. W5 视频生成（建议）

**输入**：`{ heritageId, title, duration, platform, style, storyboards: [...] }`

**流程**：创建任务返回 `pending` → 前端每 1.2 秒轮询（最多 40 次，约 48 秒）→ 期间返回 `generating` + `progress`（0~100）→ 完成返回 `success` + `videoUrl`，或失败返回 `failed` + `errorMessage`。

约定：

- `errorMessage` 会**原样展示给用户**，写清是哪个镜头、什么问题（如「分镜 03 的画面生成未通过内容校验」）。
- 若 Coze 侧出片时间超过 48 秒，请与前端一起把轮询上限调大（`web/src/stores/video.ts` 的 `POLL_MAX_ATTEMPTS`）。
- 比赛演示阶段可以先返回**占位结果**（`success` + 空 `videoUrl`），前端已有"占位播放区"与明确提示，不会露馅成假按钮。

---

## 8. W6 内容事实校验（建议，加分项）

在 W2/W3 之后加一步自检：把生成的正文与 `knowledge` 逐条比对，输出 `{ passed: boolean, issues: string[] }`。
若 `passed = false`，让工作流**重新生成一次**或删掉无依据的句子。比赛中可以把它作为"可信知识库"卖点的一部分来讲：**检索 → 生成 → 自检** 三步，而不是单次生成。

---

## 9. 失败与超时

| 项 | 约定 |
| --- | --- |
| 超时 | 前端对 AI 类端点放宽到 **60 秒**；Coze 侧建议把工作流超时控制在 50 秒内 |
| 失败返回 | 让后端返回非 0 `code` + **可直接展示的中文 message**（如「知识库检索失败，请稍后重试」），前端会直接弹这句 |
| 检索为空 | 不要返回空 `sources`：至少回退到该非遗项目在知识库中的默认资料，否则右栏会空掉、也会削弱"可信知识"的说服力 |
| 部分失败 | 分镜生成失败时，可以让 `videoScript` 为空数组，前端会显示「点击生成视频脚本」的引导态 |

---

## 10. 联调方式

1. **你在 Coze 控制台调试**：直接按 §4 / §5 的输入输出结构测，重点关注「参数变了结果是否真的变」。
2. **接后端**：后端把工作流包成 `POST /api/ai/generate` 等端点（见 `docs/03-handoff-backend.md` §4.5~4.7 的完整请求/响应示例）。
3. **接前端**：把 `web/.env.development` 的 `VITE_USE_MOCK` 改为 `false`，刷新即可看到真实结果；创作页的「参考资料」栏会展示你返回的 `sources`（含来源与相关度），结果顶部会显示「AI 已基于 N 条非遗资料完成创作」。
4. **参考样例**：`web/src/mock/ai.ts` 是前端 Mock 的四场景产出，可当作"看起来对"的参考；`web/src/mock/storyboards.ts` 是分镜生成的规则实现。

---

## 11. 验收清单（建议你们俩一起过一遍）

- [ ] 文旅推文：300 / 500 / 800 字三档，正文字数与板块数有明显差异
- [ ] 四种场景各自的产出结构不同，不是同一套模板换词
- [ ] 短视频：15 / 30 / 60 秒 → 3 / 5 / 6 镜，时间轴首尾相接
- [ ] 单镜重新生成：内容变了，`index` / `start` / `end` 没变
- [ ] `sources` 稳定返回 2~3 条，`similarity` 在 0~1 之间
- [ ] 正文里出现的年代、名录级别、工序数字都能在 `sources` 里找到依据
- [ ] 直播场景填了「互动设计」、短视频填了「切入角度」、文创选了「产品类型」后，产出里能看出对应内容
- [ ] 视频任务状态能走完 `pending → generating → success`，失败时 `errorMessage` 是用户看得懂的中文
