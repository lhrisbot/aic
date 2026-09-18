/**
 * 视频任务 Mock。
 *
 * 状态机（按提示词要求）：pending → generating → success / failed
 * 实现方式：任务创建后按「距创建时刻的经过时间」推导状态与进度，
 * 因此前端轮询 `/video/:id/status` 会看到进度稳定推进，且刷新页面后仍可续查。
 * 失败态由入参显式指定（simulate: 'failed'），不做随机失败，保证比赛演示可控。
 */
import { HERITAGE_DATABASE } from '@/mock/heritage'
import { buildStoryboards } from '@/mock/storyboards'
import { clone, mockDelay, randomBetween } from '@/mock/utils'
import type { Heritage } from '@/types/heritage'
import type { Storyboard, VideoCreateRequest, VideoTask } from '@/types/video'

interface TaskRecord {
  task: VideoTask
  createdAtMs: number
  simulate: 'success' | 'failed'
}

/** 内存任务表 */
const taskStore = new Map<string, TaskRecord>()

/** 排队时长与整体生成时长（毫秒），用于推导 pending / generating */
const PENDING_MS = 600
const TOTAL_MS = 4600

function findHeritage(id: string): Heritage {
  const heritage = HERITAGE_DATABASE.find((item) => item.id === id)
  if (!heritage) {
    throw new Error('未找到该非遗项目')
  }
  return heritage
}

/** 分镜重新生成时使用的镜头语言变体 */
const SHOT_VARIANTS: Array<{ prefix: string; narrationSuffix: string; promptSuffix: string }> = [
  { prefix: '低角度仰拍，', narrationSuffix: '（语气更肯定，节奏加快）', promptSuffix: 'low angle, dynamic' },
  { prefix: '手持跟拍，', narrationSuffix: '（语速放慢，留出更多留白）', promptSuffix: 'handheld, documentary feel' },
  { prefix: '固定机位长镜头，', narrationSuffix: '（加入现场环境声）', promptSuffix: 'static long take, ambience' },
]

/** POST /video/generate */
export function mockCreateVideoTask(payload: VideoCreateRequest): Promise<VideoTask> {
  let task: VideoTask

  try {
    const heritage = findHeritage(payload.heritageId)
    const duration = payload.duration && payload.duration > 0 ? payload.duration : 30
    const storyboards =
      payload.storyboards.length > 0
        ? payload.storyboards.map((shot) => ({ ...shot }))
        : buildStoryboards(
            { name: heritage.name, region: heritage.region, category: heritage.category },
            duration,
          )

    const now = new Date().toISOString()
    const id = `vt_${Date.now().toString(36)}`

    task = {
      id,
      title: payload.title?.trim() || `${heritage.name} · ${payload.style ?? '国潮'}非遗宣传短片`,
      heritageId: heritage.id,
      heritageName: heritage.name,
      duration,
      platform: payload.platform ?? '抖音',
      style: payload.style ?? '国潮',
      status: 'pending',
      progress: 0,
      storyboards,
      cover: '',
      videoUrl: '',
      createdAt: now,
      updatedAt: now,
    }

    taskStore.set(id, {
      task,
      createdAtMs: Date.now(),
      simulate: payload.simulate === 'failed' ? 'failed' : 'success',
    })
  } catch (error) {
    return Promise.reject(error instanceof Error ? error : new Error('视频任务创建失败'))
  }

  return mockDelay(clone(task), 420)
}

/** GET /video/:id/status —— 按经过时间推导状态与进度 */
export function mockGetVideoTaskStatus(id: string): Promise<VideoTask> {
  const record = taskStore.get(id)
  if (!record) {
    return Promise.reject(new Error('未找到该视频任务'))
  }

  const elapsed = Date.now() - record.createdAtMs
  let next: VideoTask

  if (elapsed < PENDING_MS) {
    next = { ...record.task, status: 'pending', progress: 0 }
  } else if (elapsed < TOTAL_MS) {
    const ratio = (elapsed - PENDING_MS) / (TOTAL_MS - PENDING_MS)
    next = {
      ...record.task,
      status: 'generating',
      // 留出最后一段给合成阶段，避免进度条提前到 100%
      progress: Math.min(96, Math.max(4, Math.round(ratio * 100))),
    }
  } else if (record.simulate === 'failed') {
    next = {
      ...record.task,
      status: 'failed',
      progress: 100,
      errorMessage: '分镜 03 的画面生成未通过内容校验，请调整画面描述或重新生成后重试',
    }
  } else {
    next = {
      ...record.task,
      status: 'success',
      progress: 100,
      // 占位地址：接入真实视频生成服务后替换为可访问的视频 URL
      videoUrl: `mock-video://${record.task.id}`,
      cover: '',
    }
  }

  record.task = { ...next, updatedAt: new Date().toISOString() }
  return mockDelay(clone(record.task), 240)
}

/** 重新生成单个分镜：换一种镜头语言与旁白语气 */
export function mockRegenerateStoryboard(payload: {
  heritageId: string
  shot: Storyboard
}): Promise<Storyboard> {
  let shot: Storyboard

  try {
    // 校验项目存在（不存在的项目直接抛错，由页面统一提示）
    findHeritage(payload.heritageId)

    const variant =
      SHOT_VARIANTS[Math.floor(Math.random() * SHOT_VARIANTS.length)] ?? SHOT_VARIANTS[0]!
    const current = payload.shot

    // 去掉上一次变体加的前缀，避免多次重新生成后前缀叠加
    const bareScene = SHOT_VARIANTS.reduce(
      (text, item) => (text.startsWith(item.prefix) ? text.slice(item.prefix.length) : text),
      current.scene,
    )
    const bareNarration = current.narration.replace(/（[^）]*）$/, '').trim()

    shot = {
      ...current,
      scene: `${variant.prefix}${bareScene}`,
      narration: `${bareNarration}${variant.narrationSuffix}`,
      prompt: `${current.prompt.replace(/, (low angle, dynamic|handheld, documentary feel|static long take, ambience)$/, '')}, ${variant.promptSuffix}`,
    }
  } catch (error) {
    return Promise.reject(error instanceof Error ? error : new Error('分镜重新生成失败'))
  }

  return mockDelay(shot, randomBetween(700, 1300))
}
