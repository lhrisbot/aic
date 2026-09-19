/**
 * 作品数据 Mock。
 * 使用内存数组模拟后端库：预置 4 篇文章类作品（文旅推文 / 直播话术 / 文创包装）
 * 与 2 个视频作品，支持分页、关键词、类型筛选、时间排序与增删改。
 * 创建时间按「相对当前时间」计算，保证演示时列表里显示的是「几小时前 / 几天前」。
 */
import { ALL } from '@/types/common'
import type { PageResult } from '@/types/common'
import type { Work, WorkQuery } from '@/types/work'
import type { HeritageCategory, Source } from '@/types/heritage'
import { HERITAGE_DATABASE } from '@/mock/heritage'
import { buildStoryboards } from '@/mock/storyboards'
import { mockDelay } from '@/mock/utils'
import { getStorage, setStorage } from '@/utils/storage'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/** 取某个非遗项目的参考资料作为作品的来源标注 */
function sourcesOf(heritageId: string): Source[] {
  return HERITAGE_DATABASE.find((item) => item.id === heritageId)?.sources ?? []
}

function heritageName(heritageId: string): string {
  return HERITAGE_DATABASE.find((item) => item.id === heritageId)?.name ?? '非遗项目'
}

/** 非遗类别：随项目 id 派生，保证作品卡片与非遗卡片使用同一套封面配色 */
function heritageCategory(heritageId: string): HeritageCategory {
  return HERITAGE_DATABASE.find((item) => item.id === heritageId)?.category ?? '传统技艺'
}

const PRESET_WORKS: Work[] = [
  {
    id: 'w_1001',
    title: '一灯一幕一双手：皮影戏的当代表达',
    type: 'article',
    heritageId: 'shadow-puppetry',
    heritageName: '皮影戏',
    summary:
      '从一张牛皮到一台戏，皮影戏的看点不只是光影，还有雕刻、唱腔与操纵三者合一的现场感。',
    content: `## 一盏灯，演了千年

在陕西关中的农村，一块幕布、一盏灯、几件影人，就能撑起一整晚的热闹。皮影戏的影人贴幕而动，观众看到的是灯光透过的剪影，因此造型讲究轮廓清晰、头身比例夸张。

## 看点在哪里

- **雕刻**：影人取牛皮或驴皮，经泡制、刮薄、描样、雕镂、染色、熨平、缀结等工序制成，一件影人要刻上数千刀。
- **操纵**：影人由头、上身、下身、四肢等多节组成，靠竹签操纵，捻、转、翻、抖都有讲究。
- **唱腔**：操影与唱腔通常由不同的人担任，配合锣鼓与弦乐完成。

## 到访建议

如果计划到陕西看皮影，建议优先选择庙会或文化馆的常态演出，演出后一般可以与艺人近距离看看影人实物；带孩子的家庭可以留意是否有体验环节。

## 写在最后

皮影戏把雕刻、绘画、戏曲与光影技术合为一体。它并不只是"老物件"，而是一套仍然可以被讲述、被记录、被重新设计的表达方式。`,
    sources: sourcesOf('shadow-puppetry'),
    createdAt: new Date(Date.now() - 2 * HOUR).toISOString(),
    updatedAt: new Date(Date.now() - 2 * HOUR).toISOString(),
  },
  {
    id: 'w_1002',
    title: '六百年的水磨腔，为什么值得年轻人听一次',
    type: 'article',
    heritageId: 'kunqu-opera',
    heritageName: '昆曲',
    summary:
      '昆曲的慢，是一种信息密度很高的慢：一句唱词里藏着字、腔、气与身段的配合。',
    content: `## 从"听不懂"到"想再听一遍"

很多人第一次听昆曲的障碍是"听不懂"。但昆曲的唱腔本身带着提示：吐字讲究、腔调婉转，配上笛子，一句话会被拉得很长，情绪也在其中被放大。

## 三个可以留意的细节

1. **笛子为主的伴奏**：讲究"笛随人走"，笛声跟着演员的气口走。
2. **身段与眼神**：手眼身法步是程式，也是叙事的语言，水袖的一次翻卷往往对应情绪的转折。
3. **文辞**：《牡丹亭》《长生殿》《桃花扇》等作品，本身就是可以单独阅读的文学文本。

## 入门建议

先看折子戏，从一个完整的小段落开始，比如《牡丹亭·游园》。看第二遍时把注意力放在笛子与演员的呼吸上，会更容易进入。`,
    sources: sourcesOf('kunqu-opera'),
    createdAt: new Date(Date.now() - 8 * HOUR).toISOString(),
    updatedAt: new Date(Date.now() - 8 * HOUR).toISOString(),
  },
  {
    id: 'w_1003',
    title: '苏绣直播间：从一根丝线讲起',
    type: 'live',
    heritageId: 'su-embroidery',
    heritageName: '苏绣',
    summary: '3 分钟直播话术：以"劈丝"这一动作开场，用可视化的细节建立信任，再落到产品。',
    content: `## 开场（0:00-0:30）

"欢迎来到直播间。先不急着看产品，大家看我这根线——这是一根普通的丝线，我现在把它劈成两股、四股、八股。**线越细，画面越柔**。苏绣的功夫，一半都在这里。"

## 讲解（0:30-1:40）

- 展示绣面细节，说明"平、齐、细、密、匀、顺、和、光"八个字的含义
- 对比机绣与手工绣在光泽与层次上的差别
- 讲一件双面绣的特点：正反两面皆成画面，且不露线头

## 互动（1:40-2:20）

"想看哪种图案？打在公屏上，我下一轮专门讲。" 每 1 分钟设置一次提问，引导观众留言参与。

## 转化（2:20-3:00）

"今天上的是小幅作品，适合第一次接触苏绣的朋友。**它不只是一件装饰品，也是一种可以慢慢看的手艺**。想要的家人扣 1。"`,
    sources: sourcesOf('su-embroidery'),
    createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
    updatedAt: new Date(Date.now() - 1 * DAY).toISOString(),
  },
  {
    id: 'w_1004',
    title: '掐丝珐琅茶器礼盒包装文案',
    type: 'package',
    heritageId: 'cloisonne',
    heritageName: '景泰蓝',
    summary: '为景泰蓝文创茶器设计的礼盒文案：主标语、文化释义与背标说明三段式。',
    content: `## 主标语

**一寸铜丝，一寸光阴。**

## 文化释义（礼盒内页）

景泰蓝，正式名称为铜胎掐丝珐琅。工匠以细铜丝掐出纹样，填入珐琅釉料，再经多次入炉烧制、反复打磨而成。

这件茶器的纹样取缠枝莲，寓意绵延不断。釉色经火烧而成，**每一件的光泽都不完全相同**。

## 背标说明

- 工艺：铜胎掐丝珐琅（手工点蓝、多次烧制）
- 纹样：缠枝莲
- 保养：避免与硬物磕碰，宜用软布擦拭
- 提示：手工制品存在细微色差与手工痕迹，属正常现象

## 使用场景

自用：一杯一盏，日常里的一点讲究。
送礼：附赠文化释义卡，让礼物有可讲述的内容。`,
    sources: sourcesOf('cloisonne'),
    createdAt: new Date(Date.now() - 2 * DAY).toISOString(),
    updatedAt: new Date(Date.now() - 2 * DAY).toISOString(),
  },
  {
    id: 'w_1005',
    title: '皮影戏 · 国潮非遗宣传短片',
    type: 'videoWork',
    heritageId: 'shadow-puppetry',
    heritageName: '皮影戏',
    content: '走进陕西皮影戏的幕后：从雕刻牛皮影人到操纵光影，让年轻观众亲手体验。',
    summary: '30 秒国潮风格短片：从幕布亮起到年轻观众围拢，5 个镜头完成一次"老手艺的新表达"。',
    cover: '',
    duration: 30,
    style: '国潮',
    videoTaskId: 'vt_2001',
    storyboards: buildStoryboards(
      { name: '皮影戏', region: '陕西', category: '传统戏剧' },
      30,
    ),
    createdAt: new Date(Date.now() - 3 * DAY).toISOString(),
    updatedAt: new Date(Date.now() - 3 * DAY).toISOString(),
  },
  {
    id: 'w_1006',
    title: '川剧变脸 · 15 秒高光短片',
    type: 'videoWork',
    heritageId: 'sichuan-opera-face-changing',
    heritageName: '川剧变脸',
    content: '用 15 秒捕捉川剧变脸的瞬间：从脸谱亮相到观众惊叹，让传统特技进入今天的信息流。',
    summary: '15 秒快节奏短片：以变脸瞬间的节奏感为主，适合短视频平台的信息流投放。',
    cover: '',
    duration: 15,
    style: '年轻化',
    videoTaskId: 'vt_2002',
    storyboards: buildStoryboards(
      { name: '川剧变脸', region: '四川', category: '传统戏剧' },
      15,
    ),
    createdAt: new Date(Date.now() - 5 * DAY).toISOString(),
    updatedAt: new Date(Date.now() - 5 * DAY).toISOString(),
  },
]

/**
 * 补齐派生字段：heritageName 与 heritageCategory 均由 heritageId 派生，
 * 预置数据、新建作品与将来从后端取回的数据都能保证字段一致。
 */
function normalizeWork(work: Work): Work {
  return {
    ...work,
    heritageName: work.heritageName || heritageName(work.heritageId),
    heritageCategory: work.heritageCategory ?? heritageCategory(work.heritageId),
  }
}

/**
 * 作品库持久化到 localStorage。
 * 若只放内存，页面一刷新刚保存的作品就消失，演示体验很差；
 * 持久化后「保存作品 → 刷新 → 我的作品」依然可见，行为更接近真实后端。
 */
const WORKS_KEY = 'mock-works'

function loadWorks(): Work[] {
  const stored = getStorage<Work[] | null>(WORKS_KEY, null)
  if (!Array.isArray(stored)) {
    return PRESET_WORKS.map(normalizeWork)
  }
  return stored.map(normalizeWork)
}

function persist(): void {
  setStorage(WORKS_KEY, workStore)
}

/** 内存「数据库」 */
let workStore: Work[] = loadWorks()
/** 自增序号从已存在的 id 继续，避免与持久化数据冲突 */
let idSeq = workStore.reduce((max, work) => {
  const numeric = Number(String(work.id).replace(/\D/g, ''))
  return Number.isFinite(numeric) && numeric > max ? numeric : max
}, 1006)

function sortWorks(list: Work[], sort: WorkQuery['sort']): Work[] {
  const sorted = [...list]
  sorted.sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return sort === 'oldest' ? -diff : diff
  })
  return sorted
}

/** GET /works */
export function mockFetchWorks(query: WorkQuery = {}): Promise<PageResult<Work>> {
  const page = query.page && query.page > 0 ? query.page : 1
  const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 12
  const keyword = (query.keyword ?? '').trim().toLowerCase()
  const type = query.type && query.type !== ALL ? query.type : undefined

  const filtered = workStore.filter((work) => {
    if (type && work.type !== type) {
      return false
    }
    if (!keyword) {
      return true
    }
    return [work.title, work.summary, work.heritageName]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
  })

  const sorted = sortWorks(filtered, query.sort)
  const start = (page - 1) * pageSize

  return mockDelay({
    list: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
  })
}

/** GET /works/:id */
export function mockFetchWorkById(id: string): Promise<Work> {
  const found = workStore.find((work) => work.id === id)
  if (!found) {
    return Promise.reject(new Error('未找到该作品'))
  }
  return mockDelay(found)
}

/** POST /works */
export function mockCreateWork(payload: Partial<Work>): Promise<Work> {
  idSeq += 1
  const now = new Date().toISOString()
  const heritageId = payload.heritageId ?? HERITAGE_DATABASE[0]?.id ?? ''

  const work: Work = {
    id: `w_${idSeq}`,
    title: payload.title?.trim() || '未命名作品',
    type: payload.type ?? 'article',
    heritageId,
    heritageName: payload.heritageName ?? heritageName(heritageId),
    heritageCategory: payload.heritageCategory ?? heritageCategory(heritageId),
    summary: payload.summary ?? '',
    content: payload.content,
    sources: payload.sources ?? [],
    cover: payload.cover ?? '',
    duration: payload.duration,
    style: payload.style,
    videoTaskId: payload.videoTaskId,
    videoUrl: payload.videoUrl,
    storyboards: payload.storyboards,
    createdAt: now,
    updatedAt: now,
  }

  workStore = [work, ...workStore]
  persist()
  return mockDelay(work, 420)
}

/** PUT /works/:id */
export function mockUpdateWork(id: string, patch: Partial<Work>): Promise<Work> {
  const index = workStore.findIndex((work) => work.id === id)
  if (index < 0) {
    return Promise.reject(new Error('未找到该作品'))
  }

  const merged: Work = {
    ...workStore[index]!,
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  }
  workStore = workStore.map((work) => (work.id === id ? merged : work))
  persist()
  return mockDelay(merged, 380)
}

/** DELETE /works/:id */
export function mockDeleteWork(id: string): Promise<{ success: boolean }> {
  const exists = workStore.some((work) => work.id === id)
  if (!exists) {
    return Promise.reject(new Error('未找到该作品'))
  }
  workStore = workStore.filter((work) => work.id !== id)
  persist()
  return mockDelay({ success: true }, 360)
}
