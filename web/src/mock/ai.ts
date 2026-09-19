/**
 * AI 创作 Mock。
 *
 * 设计要点：
 * 1. 生成结果与「非遗知识库」强绑定：正文由该项目的 history / features / technique /
 *    cultureValue 等字段组织而成，并返回 2~3 条来源，模拟检索增强（RAG）的效果；
 * 2. 不同场景返回完全不同的内容结构（推文 / 脚本 / 话术 / 包装文案），
 *    且受 platform、audience、style、length、focus 等参数影响，验证参数确实生效；
 * 3. 生成耗时按提示词要求模拟为 1~2 秒；短视频场景额外返回 videoScript（分镜脚本）。
 */
import type { CreationRequest, CreationResult, VideoScript } from '@/types/ai'
import type { Heritage } from '@/types/heritage'
import { HERITAGE_DATABASE } from '@/mock/heritage'
import { buildStoryboards } from '@/mock/storyboards'
import { mockDelay, randomBetween } from '@/mock/utils'

/** 标题模板：同一场景下风格不同，标题也不同 */
function buildTitle(heritage: Heritage, request: CreationRequest): string {
  const { scene, style = '', focus = '', extra = {} } = request

  switch (scene) {
    case 'article':
      switch (style) {
        case '专业文化':
          return `${heritage.name}：一项${heritage.category}类非遗的完整看点`
        case '故事化':
          return `一灯一幕一双手：${heritage.name}背后的手艺人`
        case '轻松活泼':
          return `${heritage.name}到底好看在哪？看完这篇就够了`
        default:
          return `${heritage.name}也能很潮：${heritage.region}正在重新讲述它`
      }
    case 'video':
      return `${heritage.name} · ${style || '国潮'}非遗宣传短片`
    case 'live':
      return `${heritage.name}直播话术 · ${focus || '非遗介绍'}`
    default:
      // 例：景泰蓝文创摆件包装文案
      return `${heritage.name}${extra.productType ?? ''}包装文案`
  }
}

/** 按内容长度参数决定正文包含几个板块 */
function sectionCountByLength(length?: string): number {
  if (!length) {
    return 4
  }
  if (length.includes('300')) {
    return 3
  }
  if (length.includes('800')) {
    return 5
  }
  return 4
}

/** 文旅推文 */
function buildArticle(heritage: Heritage, request: CreationRequest): string {
  const audience = request.audience ?? '年轻游客'
  const platform = request.platform ?? '公众号'
  const focusLine = request.focus
    ? `\n本次内容重点围绕：**${request.focus}**。`
    : ''

  const sections: string[] = [
    `## 一、先说结论

如果你只有半天时间了解${heritage.region}的一项非遗，${heritage.name}是很合适的选择：**${heritage.summary}** 它看得见、听得懂，也经得起细看。[1]${focusLine}`,
    `## 二、它凭什么被称为「${heritage.category}」

${heritage.features}

这些特点决定了它在现场"好看"：不需要背景知识，也能一眼看出门道。[1][2]`,
    `## 三、手艺是怎么练出来的

${heritage.technique}

这部分往往是最打动${audience}的地方——**看得见的成品背后，是看不见的重复练习**。[2]`,
    `## 四、到${heritage.region}怎么看

- **看什么**：优先选择有现场演示或常态演出的场馆，比静态展陈更有感染力。
- **看多久**：完整看一场大约 40-60 分钟，建议预留一点时间在演出后停留。
- **带什么**：可以准备几个具体问题，现场提问往往能得到展陈文字之外的信息。
- **适合谁**：家庭游客可以把重点放在"动手体验"，文化爱好者可以关注技艺细节。`,
    `## 五、为什么今天还值得讲

${heritage.cultureValue}

这也是我们把${heritage.name}放进这次内容的理由：**它不是被封存的标本，而是一种仍在被讲述、被再设计的表达方式**。${platform}上的读者如果对这类内容感兴趣，可以继续关注这个系列。`,
  ]

  return sections.slice(0, sectionCountByLength(request.length)).join('\n\n')
}

/** 短视频脚本 */
function buildVideoScript(
  heritage: Heritage,
  request: CreationRequest,
  duration: number,
): { markdown: string; script: VideoScript } {
  const storyboards = buildStoryboards(
    { name: heritage.name, region: heritage.region, category: heritage.category },
    duration,
  )
  const platform = request.platform ?? '抖音'
  const goal = request.focus ?? '文化科普'
  const topic = request.extra?.topic?.trim()
  const topicLine = topic ? `\n\n**切入角度**：${topic}` : ''

  const shots = storyboards
    .map(
      (shot) => `### 镜头 ${String(shot.index).padStart(2, '0')}（${shot.start}-${shot.end} 秒）

- **画面**：${shot.scene}
- **旁白**：${shot.narration}
- **AI Video Prompt**：\`${shot.prompt}\``,
    )
    .join('\n\n')

  const markdown = `## 视频信息

| 项目 | 内容 |
| --- | --- |
| 发布平台 | ${platform} |
| 视频时长 | ${duration} 秒 |
| 视频风格 | ${request.style ?? '国潮'} |
| 传播目标 | ${goal} |

## 内容主线

用"**细节特写 → 手艺动作 → 观众反应 → 片名落板**"的结构完成一次文化科普：前 3 秒用光影或工具特写抓住注意力，中段给出手艺的关键动作，结尾回到${heritage.region}的地域标识。[1]${topicLine}

## 分镜脚本

${shots}

## 拍摄与剪辑提示

- 前 3 秒不要放片头字幕，用画面细节直接留住观众；
- 旁白语速控制在每秒 3-4 字，留出画面呼吸感；
- 全片保留一种主色（建议取${heritage.name}本身的材质色），避免画面过花；
- 结尾字幕带一句行动指引，例如"来${heritage.region}看一场${heritage.name}"。`

  const script: VideoScript = {
    id: `vs_${Date.now().toString(36)}`,
    title: `${heritage.name} · ${request.style ?? '国潮'}非遗宣传短片`,
    duration,
    shots: storyboards,
  }

  return { markdown, script }
}

/** 直播话术 */
function buildLive(heritage: Heritage, request: CreationRequest): string {
  const platform = request.platform ?? '抖音'
  const scene = request.focus ?? '非遗介绍'
  const tone = request.style ?? '热情'
  const totalMinutes = request.length?.includes('5') ? 5 : request.length?.includes('1') ? 1 : 3
  const perSection = Math.max(1, Math.round(totalMinutes / 5))
  const interaction = request.extra?.interaction?.trim()
  const interactionLine = interaction
    ? `\n\n**本场互动设计**：${interaction}`
    : '\n\n建议每 1 分钟设置一次提问，把观众的具体问题接进讲解里。'

  return `## 直播信息

| 项目 | 内容 |
| --- | --- |
| 直播平台 | ${platform} |
| 直播场景 | ${scene} |
| 语气 | ${tone} |
| 计划时长 | ${totalMinutes} 分钟 |

## 话术脚本

### 一、开场（0-${perSection} 分钟）

"欢迎来到直播间。今天要讲的是一项${heritage.category}类非遗——${heritage.name}。**${heritage.summary}** 先不急着看产品，我用两分钟把它讲明白。"[1]

### 二、核心讲解（${perSection}-${perSection * 2} 分钟）

${heritage.features}

讲解时用一件实物做"锚点"，边展示边讲，避免长时间空讲。[1][2]

### 三、互动（${perSection * 2}-${perSection * 3} 分钟）

"想先听哪一部分？打在公屏上。"${interactionLine}

### 四、转化（${perSection * 3}-${perSection * 4} 分钟）

"今天上的是入门款，适合第一次接触${heritage.name}的朋友。**它不只是一件商品，也是一段可以慢慢了解的手艺。**"

### 五、收尾（${perSection * 4}-${totalMinutes} 分钟）

"今天就到这里。没抢到的朋友可以关注，下期我们讲${heritage.technique.split('。')[0] ?? '制作工序'}。"[2]

## 直播提示

- 讲工序时给出具体数字（多少道工序、多长时间），比形容词更有说服力；
- 每讲 1 分钟回看一次公屏，及时回应高频问题；
- 涉及价格的环节放在最后 ${perSection} 分钟，前段只做文化铺垫。`
}

/** 文创包装 */
function buildPackage(heritage: Heritage, request: CreationRequest): string {
  const productType = request.extra?.productType ?? '文创摆件'
  const audience = request.audience ?? '文化爱好者'
  const style = request.style ?? '国潮雅致'
  const focus = request.focus ?? '强调手工技艺的独特性与文化寓意'

  return `## 主标语

**${heritage.name}，把${heritage.region}的手艺带回家。**

## 产品与人群

| 项目 | 内容 |
| --- | --- |
| 产品类型 | ${productType} |
| 包装风格 | ${style} |
| 目标人群 | ${audience} |
| 宣传重点 | ${focus} |

## 文化释义（内页卡）

${heritage.name}属于${heritage.category}类非遗，主要流布于${heritage.region}。${heritage.summary}

${heritage.cultureValue}[1]

## 包装正面文案

- 主视觉：${heritage.name}代表性纹样，单色压印
- 主标语：${heritage.name}，把${heritage.region}的手艺带回家
- 副标：${heritage.category} · ${heritage.region}

## 包装背面说明

- 工艺：${heritage.technique.split('。')[0] ?? '手工制作'}
- 材质与保养：避免与硬物磕碰，宜用软布擦拭
- 说明：手工制品存在细微差异，属正常现象

## 场景与礼赠

- **自用**：${audience}的日常使用场景，包装上保留一句"慢慢用"的提示；
- **送礼**：附赠文化释义卡，让礼物有可讲述的内容；
- **陈列**：礼盒可立式摆放，正面文案即展陈说明。[2]`
}

/** 从请求的时长参数解析秒数 */
function parseDuration(length?: string): number {
  if (!length) {
    return 30
  }
  const matched = length.match(/(\d+)/)
  const value = matched ? Number(matched[1]) : 30
  return Number.isFinite(value) && value > 0 ? value : 30
}

function findHeritage(heritageId: string): Heritage {
  const heritage = HERITAGE_DATABASE.find((item) => item.id === heritageId)
  if (!heritage) {
    throw new Error('未找到该非遗项目，请重新选择')
  }
  return heritage
}

/** POST /ai/generate 的 Mock 实现 */
export function mockGenerateCreation(request: CreationRequest): Promise<CreationResult> {
  let result: CreationResult

  try {
    const heritage = findHeritage(request.heritageId)
    const title = buildTitle(heritage, request)
    let content = ''
    let videoScript: VideoScript | undefined

    if (request.scene === 'video') {
      const built = buildVideoScript(heritage, request, parseDuration(request.length))
      content = built.markdown
      videoScript = built.script
    } else if (request.scene === 'live') {
      content = buildLive(heritage, request)
    } else if (request.scene === 'package') {
      content = buildPackage(heritage, request)
    } else {
      content = buildArticle(heritage, request)
    }

    result = {
      id: `cr_${Date.now().toString(36)}`,
      title,
      content,
      // 返回 2~3 条来源，模拟知识库检索命中的资料
      sources: heritage.sources.slice(0, heritage.sources.length >= 3 ? 3 : heritage.sources.length),
      createdAt: new Date().toISOString(),
      heritageId: heritage.id,
      scene: request.scene,
      videoScript,
    }
  } catch (error) {
    return Promise.reject(error instanceof Error ? error : new Error('生成失败，请稍后重试'))
  }

  // 提示词要求：Mock 模拟 1~2 秒返回
  return mockDelay(result, randomBetween(1000, 2000))
}

/** POST /ai/video-script 的 Mock 实现：由文案进一步生成分镜脚本 */
export function mockGenerateVideoScript(payload: {
  heritageId: string
  duration: number
  style?: string
  content?: string
}): Promise<VideoScript> {
  let script: VideoScript
  try {
    const heritage = findHeritage(payload.heritageId)
    const storyboards = buildStoryboards(
      { name: heritage.name, region: heritage.region, category: heritage.category },
      payload.duration,
    )
    const confirmedCopy = payload.content
      ?.split(/\n+/)
      .map((line) => line.replace(/[#>*`_\[\]()]/g, ' ').trim())
      .find((line) => line.length > 18 && !line.startsWith('|') && !line.startsWith('-'))
    if (confirmedCopy && storyboards[0]) {
      storyboards[0].narration = confirmedCopy.slice(0, 28)
    }
    script = {
      id: `vs_${Date.now().toString(36)}`,
      title: `${heritage.name} · ${payload.style ?? '国潮'}非遗宣传短片`,
      duration: payload.duration,
      shots: storyboards,
    }
  } catch (error) {
    return Promise.reject(error instanceof Error ? error : new Error('脚本生成失败'))
  }

  return mockDelay(script, randomBetween(900, 1600))
}
