import type { CreationFormModel, CreationResult } from '@/types/ai'

/**
 * AI 创作 → 视频创作的前端草稿桥。
 *
 * 这不是后端作品保存接口，只用于在同一浏览器内把当前生成结果
 * 交给视频页继续加工；接入真实后端后可替换为后端 draftId。
 */
export interface CreationDraft {
  id: string
  heritageId: string
  heritageName: string
  form: CreationFormModel
  result: CreationResult
  createdAt: string
}

const DRAFT_PREFIX = 'yiyun:creation-draft:'

function getStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage
}

export function saveCreationDraft(input: Omit<CreationDraft, 'id' | 'createdAt'>): string {
  const id = `draft_${Date.now().toString(36)}`
  const draft: CreationDraft = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
  }
  getStorage()?.setItem(`${DRAFT_PREFIX}${id}`, JSON.stringify(draft))
  return id
}

export function readCreationDraft(id: string): CreationDraft | null {
  if (!id) {
    return null
  }

  const raw = getStorage()?.getItem(`${DRAFT_PREFIX}${id}`)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as CreationDraft
  } catch {
    return null
  }
}
