/**
 * 非遗相关接口。
 * Mock 与真实实现保持同一签名（Promise<T>），由 VITE_USE_MOCK 决定走哪一支，
 * 页面与 store 不需要感知数据来源。
 */
import { USE_MOCK, http } from '@/utils/request'
import type { PageResult } from '@/types/common'
import type { Heritage, HeritageQuery } from '@/types/heritage'
import {
  mockFetchHeritageById,
  mockFetchHeritageList,
  mockFetchHotHeritages,
} from '@/mock/heritage'

/** GET /api/heritages */
export function fetchHeritages(query: HeritageQuery = {}): Promise<PageResult<Heritage>> {
  if (USE_MOCK) {
    return mockFetchHeritageList(query)
  }
  return http.get<PageResult<Heritage>>('/heritages', query as Record<string, unknown>)
}

/** GET /api/heritages/:id */
export function fetchHeritageById(id: string): Promise<Heritage> {
  if (USE_MOCK) {
    return mockFetchHeritageById(id)
  }
  return http.get<Heritage>(`/heritages/${id}`)
}

/**
 * 首页热门推荐。
 * 复用列表接口（`hot=true`），不额外发明端点，后端接入时按同一约定实现即可。
 */
export function fetchHotHeritages(limit = 6): Promise<Heritage[]> {
  if (USE_MOCK) {
    return mockFetchHotHeritages(limit)
  }
  return http.get<Heritage[]>('/heritages', { hot: true, limit })
}
