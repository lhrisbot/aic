import { hashString } from '@/utils/hash'
import type { HeritageCategory } from '@/types/heritage'
import type { Storyboard } from '@/types/video'

/** 分镜生成所需的非遗最小信息 */
export interface StoryboardSeed {
  name: string
  region: string
  category: HeritageCategory
}

/**
 * 按类别给出的镜头语言素材。
 * AI 视频 Prompt 使用英文，方便后续直接对接视频生成模型。
 */
const CATEGORY_HINTS: Record<
  HeritageCategory,
  { closeup: string; action: string; craft: string; prompt: string }
> = {
  传统戏剧: {
    closeup: '手部与面部的特写，妆面与头饰的细节逐渐清晰',
    action: '表演者的身段展开，一个转身带出整片光影',
    craft: '后台准备的过程：勒头、上妆、检场',
    prompt: 'traditional Chinese opera performance, dramatic stage lighting, red and gold tones, cinematic',
  },
  传统美术: {
    closeup: '手指与工具的极近特写，材料在指尖逐渐成形',
    action: '作品被轻轻展开，纹样在光下显出层次',
    craft: '从选料到成品的工序片段',
    prompt: 'close-up of traditional Chinese folk art craftsmanship, natural light, warm paper texture, cinematic',
  },
  传统技艺: {
    closeup: '工序特写：工具与材料接触的瞬间',
    action: '匠人的动作连贯流畅，器物在手中转动',
    craft: '窑火、锻打或织造的完整工序',
    prompt: 'artisan hands working on traditional Chinese craft, workshop ambience, soft directional light, cinematic',
  },
  传统音乐: {
    closeup: '琴弦与指尖的特写，弦振动的细微动态',
    action: '演奏者闭目抚弦，气息与节奏落在一处',
    craft: '乐器的选材与制作过程',
    prompt: 'traditional Chinese instrument performance, low key lighting, dust particles in light beam, cinematic',
  },
  传统舞蹈: {
    closeup: '道具与服饰细节的特写，鼓点渐起',
    action: '舞者腾跃、转身，动作刚健有力',
    craft: '道具与服饰的制作过程',
    prompt: 'traditional Chinese lion dance, energetic movement, drum rhythm, street festival, cinematic',
  },
  民俗: {
    closeup: '节令器物的特写，人手在忙碌地准备',
    action: '人群聚拢，仪式与欢庆的场面展开',
    craft: '节令物品的制作过程',
    prompt: 'Chinese folk festival scene, crowd and lanterns, warm nostalgic tones, cinematic',
  },
}

/**
 * 生成分镜脚本。
 * 镜头数量与时间轴随视频时长变化（15 秒 3 镜 / 30 秒 5 镜 / 60 秒 6 镜），
 * 每个镜头包含画面描述、旁白与 AI Video Prompt。
 */
export function buildStoryboards(seed: StoryboardSeed, duration: number): Storyboard[] {
  const hints = CATEGORY_HINTS[seed.category] ?? CATEGORY_HINTS['传统技艺']
  const total = duration > 0 ? duration : 30
  const shotCount = total <= 15 ? 3 : total <= 30 ? 5 : 6
  const step = total / shotCount

  const drafts: Array<{ scene: string; narration: string }> = [
    {
      scene: `昏暗的幕布/工作台逐渐亮起，一道剪影或器物的轮廓出现，环境声先入。`,
      narration: `一件${seed.name}，一段跨越千年的手艺。`,
    },
    {
      scene: `${hints.closeup}。`,
      narration: `在${seed.region}，这门手艺被一代代人反复打磨。`,
    },
    {
      scene: `${hints.action}。`,
      narration: `慢一点，才看得清其中的讲究。`,
    },
    {
      scene: `${hints.craft}，画面在工序之间流畅切换。`,
      narration: `每一道工序，都是时间换来的熟练。`,
    },
    {
      scene: `年轻观众围拢过来，举起手机记录，画面从传统过渡到当下。`,
      narration: `今天，它被新的方式讲述，也被更多人看见。`,
    },
    {
      scene: `画面定格在${seed.name}最具代表性的瞬间，字幕与片名浮现。`,
      narration: `来${seed.region}，走近${seed.name}。`,
    },
  ]

  return drafts.slice(0, shotCount).map((draft, index) => {
    const start = Math.round(index * step)
    const end = Math.round((index + 1) * step)
    return {
      id: `shot-${index + 1}-${hashString(`${seed.name}-${index}`).toString(36).slice(0, 4)}`,
      index: index + 1,
      start,
      end,
      scene: draft.scene,
      narration: draft.narration,
      prompt: `${hints.prompt}, ${seed.name} theme, 4k, shallow depth of field, shot ${index + 1}`,
    }
  })
}
