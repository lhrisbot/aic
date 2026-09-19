import type { SceneType } from './ai'
import type { HeritageCategory, Source } from './heritage'
import type { Storyboard } from './video'

/**
 * 作品类型。
 * 注意：`video` 是「短视频脚本」这一内容场景，而生成完成的视频作品用独立的
 * `videoWork` 表示——两者必须区分，否则短视频脚本会被误标为视频作品，
 * 也无法支持「短视频」与「视频作品」两个独立筛选项。
 */
export type WorkType = SceneType | 'videoWork'

/** 作品 */
export interface Work {
  id: string
  title: string
  type: WorkType
  heritageId: string
  heritageName: string
  /** 非遗类别（随 heritageId 派生，用于视频作品封面与筛选展示） */
  heritageCategory?: HeritageCategory
  /** 内容摘要（列表卡片展示） */
  summary: string
  /** 文章型正文（Markdown） */
  content?: string
  /** 生成时依据的参考资料 */
  sources?: Source[]
  /** 视频型：封面 */
  cover?: string
  /** 视频型：时长（秒） */
  duration?: number
  /** 视频型：风格 */
  style?: string
  /** 视频型：关联的视频任务 */
  videoTaskId?: string
  /** 视频型：最终可播放的视频地址 */
  videoUrl?: string
  /** 视频型：分镜脚本 */
  storyboards?: Storyboard[]
  createdAt: string
  updatedAt: string
}

/** 作品列表查询参数 */
export interface WorkQuery {
  keyword?: string
  /** '全部' 或具体类型 */
  type?: WorkType | '全部'
  /** 时间排序 */
  sort?: WorkSort
  page?: number
  pageSize?: number
}

export type WorkSort = 'latest' | 'oldest'
