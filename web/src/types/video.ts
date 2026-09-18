/** 视频创作相关类型 */

/** 视频任务状态机：等待 → 生成中 → 成功 / 失败 */
export type VideoTaskStatus = 'pending' | 'generating' | 'success' | 'failed'

/** 分镜 */
export interface Storyboard {
  id: string
  /** 镜头编号，展示为 01 / 02 ... */
  index: number
  /** 起始秒 */
  start: number
  /** 结束秒 */
  end: number
  /** 画面描述 */
  scene: string
  /** 旁白 */
  narration: string
  /** AI Video Prompt */
  prompt: string
  /** 分镜缩略占位图 */
  cover?: string
}

/** 视频任务 */
export interface VideoTask {  id: string
  /** 例：皮影戏 · 国潮非遗宣传短片 */
  title: string
  heritageId: string
  heritageName: string
  /** 视频时长（秒） */
  duration: number
  /** 目标平台：抖音 / 视频号 / B站 */
  platform: string
  /** 视频风格：国潮 / 纪录片 / 年轻化 / 故事感 */
  style: string
  status: VideoTaskStatus
  /** 生成进度 0~100 */
  progress: number
  storyboards: Storyboard[]
  cover?: string
  videoUrl?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

/** 创建视频任务的入参 */
export interface VideoCreateRequest {
  heritageId: string
  /** 关联的作品 ID（从创作页带过来的文案 / 脚本） */
  workId?: string
  title?: string
  platform?: string
  style?: string
  duration?: number
  storyboards: Storyboard[]
  /**
   * 仅 Mock 阶段使用：指定本次任务的最终结果，用于演示「生成失败」形态。
   * 真实后端接入后该字段会被忽略（默认按成功处理），因此不随机失败，保证演示稳定。
   */
  simulate?: 'success' | 'failed'
}
