/**
 * 意见反馈接口。
 * 对应提示词端点清单中的 POST /api/feedback。
 */
import { USE_MOCK, http } from '@/utils/request'
import type { FeedbackPayload, FeedbackResult } from '@/types/feedback'
import { mockSubmitFeedback } from '@/mock/feedback'

/** POST /api/feedback */
export function submitFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  if (USE_MOCK) {
    return mockSubmitFeedback(payload)
  }
  return http.post<FeedbackResult>('/feedback', payload)
}
