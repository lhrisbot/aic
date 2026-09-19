/**
 * AI 创作接口。
 * Mock 与真实实现同签名；接入 Coze Workflow / FastAPI 时只改本文件。
 */
import { USE_MOCK, http } from '@/utils/request'
import type { CreationRequest, CreationResult, VideoScript } from '@/types/ai'
import { mockGenerateCreation, mockGenerateVideoScript } from '@/mock/ai'

/** POST /api/ai/generate —— 场景化内容生成 */
export function generateCreation(request: CreationRequest): Promise<CreationResult> {
  if (USE_MOCK) {
    return mockGenerateCreation(request)
  }
  return http.post<CreationResult>('/ai/generate', request, { timeout: 60000 })
}

/**
 * POST /api/ai/video-script —— 由文案进一步生成分镜脚本。
 * 说明：这是提示词给定端点之外新增的一个端点，用于支撑创作页的
 * 「生成视频脚本」动作（第六阶段的视频创作页复用同一份脚本）。
 */
export function generateVideoScript(payload: {
  heritageId: string
  duration: number
  style?: string
  /** 用户确认后的文案或主题稿，脚本应以此为内容依据 */
  content?: string
}): Promise<VideoScript> {
  if (USE_MOCK) {
    return mockGenerateVideoScript(payload)
  }
  return http.post<VideoScript>('/ai/video-script', payload, { timeout: 60000 })
}
