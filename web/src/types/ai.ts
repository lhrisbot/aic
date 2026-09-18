import type { Source } from './heritage'
import type { Storyboard } from './video'

/** 创作场景：文旅推文 / 短视频 / 直播话术 / 文创包装 */
export type SceneType = 'article' | 'video' | 'live' | 'package'

/**
 * AI 创作请求。
 * 前 6 个字段为各场景通用的参数槽位；无法归入通用槽位的场景专属字段
 * （如文创「产品类型」）放入 extra，由 config/sceneSchema.ts 统一声明。
 */
export interface CreationRequest {
  heritageId: string
  scene: SceneType
  /** 传播平台 / 直播平台 / 发布平台 */
  platform?: string
  /** 目标人群 */
  audience?: string
  /** 内容风格 / 视频风格 / 语气 / 包装风格 */
  style?: string
  /** 内容长度 / 视频时长 / 直播时长 */
  length?: string
  /** 重点内容 / 传播目标 / 直播场景 / 宣传重点 */
  focus?: string
  /** 场景专属字段 */
  extra?: Record<string, string>
}

/** 创作表单模型（比请求多一个可编辑的 heritageName 便于回显） */
export interface CreationFormModel {
  heritageId: string
  scene: SceneType
  platform: string
  audience: string
  style: string
  length: string
  focus: string
  extra: Record<string, string>
}

/** 视频脚本（短视频场景由文案进一步生成） */
export interface VideoScript {
  id: string
  title: string
  /** 时长（秒） */
  duration: number
  shots: Storyboard[]
}

/** AI 创作结果 */
export interface CreationResult {
  id: string
  title: string
  /** Markdown 正文 */
  content: string
  /** 本次生成所依据的参考资料 */
  sources: Source[]
  createdAt: string
  heritageId?: string
  scene?: SceneType
  /** 短视频场景附带的分镜脚本 */
  videoScript?: VideoScript
}
