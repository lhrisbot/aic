/**
 * 意见反馈 Mock。
 * 记录保存在内存中（用于开发期核对提交内容），真实实现由后端落库。
 */
import type { FeedbackPayload, FeedbackResult } from '@/types/feedback'
import { mockDelay, randomBetween } from '@/mock/utils'

/** 开发期留存最近提交的反馈，便于在控制台或调试时核对提交内容 */
const feedbackRecords: FeedbackPayload[] = []

/** POST /feedback */
export function mockSubmitFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  const content = payload.content.trim()
  if (content.length < 5) {
    return Promise.reject(new Error('反馈内容至少 5 个字，方便我们定位问题'))
  }

  feedbackRecords.push({ ...payload, content })

  return mockDelay<FeedbackResult>(
    {
      success: true,
      id: `fb_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    },
    randomBetween(420, 820),
  )
}
