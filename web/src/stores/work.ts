import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { deleteWork, fetchWorks, updateWork } from '@/api/work'
import { ALL, type AllOption } from '@/types/common'
import type { Work, WorkQuery, WorkSort, WorkType } from '@/types/work'
import { markdownToSummary } from '@/utils/format'

/** 每页作品数（3 列 × 3 行） */
export const WORK_PAGE_SIZE = 9

/**
 * 作品列表状态。
 * 筛选条件以 URL query 为准（与非遗探索页保持一致），本 store 只负责取数与增删改。
 */
export const useWorkStore = defineStore('work', () => {
  const list = ref<Work[]>([])
  const total = ref(0)
  const loading = ref(true)
  const failed = ref(false)

  /** 当前筛选条件（由页面从路由写入） */
  const query = ref<WorkQuery>({ keyword: '', type: ALL, sort: 'latest', page: 1 })

  const isEmpty = computed(() => !loading.value && !failed.value && list.value.length === 0)

  async function load(next?: Partial<WorkQuery>): Promise<void> {
    if (next) {
      query.value = { ...query.value, ...next }
    }

    loading.value = true
    failed.value = false
    try {
      const result = await fetchWorks({
        ...query.value,
        pageSize: WORK_PAGE_SIZE,
      })
      list.value = result.list
      total.value = result.total
    } catch {
      failed.value = true
      list.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  /** 更新作品；成功后同步列表中的对应项 */
  async function save(id: string, patch: Partial<Work>): Promise<Work | null> {
    const payload: Partial<Work> = { ...patch }
    if (payload.content !== undefined) {
      payload.summary = markdownToSummary(payload.content, 96)
    }

    try {
      const updated = await updateWork(id, payload)
      list.value = list.value.map((work) => (work.id === id ? updated : work))
      ElMessage.success('作品已更新')
      return updated
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '更新失败，请稍后重试')
      return null
    }
  }

  /** 删除作品（二次确认由调用方负责） */
  async function remove(id: string): Promise<boolean> {
    try {
      await deleteWork(id)
      // 删除后如果当前页已空且不是第一页，回退一页
      const restTotal = Math.max(0, total.value - 1)
      const maxPage = Math.max(1, Math.ceil(restTotal / WORK_PAGE_SIZE))
      const nextPage = Math.min(query.value.page ?? 1, maxPage)
      await load({ page: nextPage })
      ElMessage.success('作品已删除')
      return true
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '删除失败，请稍后重试')
      return false
    }
  }

  return {
    list,
    total,
    loading,
    failed,
    query,
    isEmpty,
    load,
    save,
    remove,
  }
})

/** 供页面复用：把路由 query 解析成作品查询条件 */
export function parseWorkQuery(query: Record<string, unknown>): {
  keyword: string
  type: WorkType | AllOption
  sort: WorkSort
  page: number
} {
  const keyword = typeof query.keyword === 'string' ? query.keyword : ''
  const type = typeof query.type === 'string' && query.type !== ALL ? (query.type as WorkType) : ALL
  const sort: WorkSort = query.sort === 'oldest' ? 'oldest' : 'latest'
  const rawPage = Number(typeof query.page === 'string' ? query.page : 1)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1
  return { keyword, type, sort, page }
}
