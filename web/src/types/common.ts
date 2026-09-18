/** 通用接口与分页契约 */

/** 后端统一响应包（真实接口约定；Mock 层直接返回 data 部分） */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 分页查询基类 */
export interface PageQuery {
  page?: number
  pageSize?: number
}

/** 「全部」筛选项统一取值 */
export const ALL = '全部' as const
export type AllOption = typeof ALL
