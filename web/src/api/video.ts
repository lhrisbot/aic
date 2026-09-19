/**
 * 视频创作接口。
 * Mock 与真实实现同签名；状态查询由页面按固定间隔轮询。
 */
import { USE_MOCK, http } from '@/utils/request'
import type { Storyboard, VideoCreateRequest, VideoTask } from '@/types/video'
import {
  mockCreateVideoTask,
  mockGetVideoTaskStatus,
  mockRegenerateStoryboard,
} from '@/mock/video'

/** POST /api/video/generate */
export function createVideoTask(payload: VideoCreateRequest): Promise<VideoTask> {
  if (USE_MOCK) {
    return mockCreateVideoTask(payload)
  }
  // simulate 只服务于 Mock 演示，真实后端不接收该字段。
  const request = { ...payload }
  delete request.simulate
  return http.post<VideoTask>('/video/generate', request, { timeout: 60000 })
}

/** GET /api/video/:id/status */
export function fetchVideoTaskStatus(id: string): Promise<VideoTask> {
  if (USE_MOCK) {
    return mockGetVideoTaskStatus(id)
  }
  return http.get<VideoTask>(`/video/${id}/status`)
}

/**
 * 重新生成单个分镜。
 * 说明：属于提示词给定端点之外的新增端点，用于支撑分镜卡片上的「重新生成」，
 * 接入后端时可复用 `/api/ai/video-script` 并带上分镜编号。
 */
export function regenerateStoryboard(payload: {
  heritageId: string
  shot: Storyboard
}): Promise<Storyboard> {
  if (USE_MOCK) {
    return mockRegenerateStoryboard(payload)
  }
  return http.post<Storyboard>('/ai/video-script/shot', payload, { timeout: 60000 })
}
