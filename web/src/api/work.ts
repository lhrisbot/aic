/**
 * 作品接口。
 * Mock 与真实实现同签名，页面与 store 不感知数据来源。
 */
import { USE_MOCK, http } from '@/utils/request'
import type { PageResult } from '@/types/common'
import type { Work, WorkQuery } from '@/types/work'
import {
  mockCreateWork,
  mockDeleteWork,
  mockFetchWorkById,
  mockFetchWorks,
  mockUpdateWork,
} from '@/mock/works'

/** GET /api/works */
export function fetchWorks(query: WorkQuery = {}): Promise<PageResult<Work>> {
  if (USE_MOCK) {
    return mockFetchWorks(query)
  }
  return http.get<PageResult<Work>>('/works', query as Record<string, unknown>)
}

/** GET /api/works/:id */
export function fetchWorkById(id: string): Promise<Work> {
  if (USE_MOCK) {
    return mockFetchWorkById(id)
  }
  return http.get<Work>(`/works/${id}`)
}

/** POST /api/works */
export function createWork(payload: Partial<Work>): Promise<Work> {
  if (USE_MOCK) {
    return mockCreateWork(payload)
  }
  return http.post<Work>('/works', payload)
}

/** PUT /api/works/:id */
export function updateWork(id: string, patch: Partial<Work>): Promise<Work> {
  if (USE_MOCK) {
    return mockUpdateWork(id, patch)
  }
  return http.put<Work>(`/works/${id}`, patch)
}

/** DELETE /api/works/:id */
export function deleteWork(id: string): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    return mockDeleteWork(id)
  }
  return http.delete<{ success: boolean }>(`/works/${id}`)
}
