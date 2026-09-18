/** 意见反馈 */

export type FeedbackType = 'suggestion' | 'bug' | 'content' | 'other'

export interface FeedbackPayload {
  type: FeedbackType
  /** 反馈内容 */
  content: string
  /** 联系方式（可选） */
  contact?: string
  /** 提交时所处页面（便于定位问题） */
  page?: string
}

export interface FeedbackResult {
  success: boolean
  id: string
  createdAt: string
}
