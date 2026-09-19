import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { fetchHeritageById, fetchHeritages } from '@/api/heritage'
import { generateCreation, generateVideoScript } from '@/api/ai'
import { createWork } from '@/api/work'
import {
  applySceneDefaults,
  buildCreationRequest,
  createDefaultForm,
  getSceneLabel,
  readFieldValue,
  validateCreationForm,
  writeFieldValue,
  type SceneField,
} from '@/config/sceneSchema'
import type { CreationFormModel, CreationResult, SceneType } from '@/types/ai'
import type { Heritage } from '@/types/heritage'
import type { Work } from '@/types/work'
import { saveCreationDraft } from '@/utils/creation-draft'
import { markdownToSummary } from '@/utils/format'

/**
 * AI 创作页状态：非遗选项 / 当前项目 / 创作参数 / 生成结果 / 参考资料 / 各类加载态。
 *
 * 页面与组件只调用本 store 的动作，不直接发起请求；
 * 生成结果与右侧参考资料都来自同一份 `result`，保证「正文引用的资料」与
 * 「右侧展示的资料」天然一致。
 */
export const useCreationStore = defineStore('creation', () => {
  /* ---------------- 非遗选项与当前项目 ---------------- */
  const options = ref<Heritage[]>([])
  const optionsLoading = ref(false)
  const optionsFailed = ref(false)

  const heritage = ref<Heritage | null>(null)
  const heritageLoading = ref(false)
  const heritageFailed = ref(false)
  /** 用于丢弃过期请求（连续切换项目时避免旧响应覆盖新选择） */
  let heritageSeq = 0
  let generationSeq = 0

  /* ---------------- 创作参数 ---------------- */
  const form = ref<CreationFormModel>(createDefaultForm())

  /* ---------------- 生成结果 ---------------- */
  const result = ref<CreationResult | null>(null)
  const generating = ref(false)
  const scriptLoading = ref(false)
  const saving = ref(false)
  const errorMessage = ref('')
  const savedWorkId = ref('')

  /* ---------------- 派生状态 ---------------- */
  const sceneLabel = computed(() => getSceneLabel(form.value.scene))
  const hasResult = computed(() => Boolean(result.value))
  const heritageName = computed(() => heritage.value?.name ?? '')

  /** 右侧参考资料：有生成结果时展示"本次引用"的资料，否则展示该项目在知识库中的资料 */
  const sources = computed(() => result.value?.sources ?? heritage.value?.sources ?? [])
  const sourcesFromResult = computed(() => Boolean(result.value))

  /** 视频时长（秒），由场景参数中的「15 秒 / 30 秒 / 60 秒」解析而来 */
  const durationSeconds = computed(() => {
    const matched = form.value.length.match(/(\d+)/)
    const value = matched ? Number(matched[1]) : 30
    return Number.isFinite(value) && value > 0 ? value : 30
  })

  const canGenerate = computed(() => Boolean(form.value.heritageId) && !generating.value)

  /* ---------------- 动作 ---------------- */
  /** 载入非遗下拉选项 */
  async function loadOptions(): Promise<void> {
    if (options.value.length > 0 || optionsLoading.value) {
      return
    }
    optionsLoading.value = true
    optionsFailed.value = false
    try {
      const page = await fetchHeritages({ page: 1, pageSize: 100 })
      options.value = page.list
    } catch {
      optionsFailed.value = true
    } finally {
      optionsLoading.value = false
    }
  }

  /** 选择非遗项目：同时拉取详情（右侧参考资料需要完整 sources） */
  async function selectHeritage(id: string): Promise<void> {
    form.value.heritageId = id
    heritageSeq += 1
    generationSeq += 1
    result.value = null
    savedWorkId.value = ''
    errorMessage.value = ''
    heritage.value = null
    const seq = heritageSeq

    if (!id) {
      heritage.value = null
      heritageFailed.value = false
      return
    }

    heritageLoading.value = true
    heritageFailed.value = false
    try {
      const data = await fetchHeritageById(id)
      if (seq !== heritageSeq) {
        return
      }
      heritage.value = data
      if (!result.value) {
        errorMessage.value = ''
      }
    } catch {
      if (seq !== heritageSeq) {
        return
      }
      heritage.value = null
      heritageFailed.value = true
      ElMessage.error('非遗资料加载失败，请重新选择')
    } finally {
      if (seq === heritageSeq) {
        heritageLoading.value = false
      }
    }
  }

  /** 切换场景：保留非遗项目，参数回到该场景默认值，并清空上一次结果 */
  function setScene(scene: SceneType): void {
    if (scene === form.value.scene) {
      return
    }
    form.value = applySceneDefaults(form.value, scene)
    generationSeq += 1
    result.value = null
    savedWorkId.value = ''
    errorMessage.value = ''
  }

  /** 更新单个参数（由 sceneSchema 驱动的动态表单调用） */
  function setField(field: SceneField, value: string): void {
    writeFieldValue(form.value, field, value)
    generationSeq += 1
    result.value = null
    savedWorkId.value = ''
    errorMessage.value = ''
  }

  /** 读取单个参数值（表单组件用） */
  function getFieldValue(field: SceneField): string {
    return readFieldValue(form.value, field)
  }

  /** 生成内容 */
  async function generate(): Promise<CreationResult | null> {
    const invalid = validateCreationForm(form.value)
    if (invalid) {
      ElMessage.warning(invalid)
      return null
    }

    generating.value = true
    const seq = ++generationSeq
    errorMessage.value = ''
    savedWorkId.value = ''

    try {
      const data = await generateCreation(buildCreationRequest(form.value))
      if (seq !== generationSeq) return null
      result.value = data
      return data
    } catch (error) {
      if (seq !== generationSeq) return null
      result.value = null
      errorMessage.value = error instanceof Error ? error.message : '生成失败，请稍后重试'
      ElMessage.error(errorMessage.value)
      return null
    } finally {
      generating.value = false
    }
  }

  /** 重新生成（与首次生成同一路径，便于统一处理加载与错误） */
  async function regenerate(): Promise<CreationResult | null> {
    return generate()
  }

  /** 编辑结果正文 */
  function updateContent(content: string): void {
    if (!result.value) {
      return
    }
    // 文案一旦修改，旧分镜不再对应当前内容，必须重新拆分。
    result.value = { ...result.value, content, videoScript: undefined }
    savedWorkId.value = ''
  }

  /**
   * 保存一份短期草稿，供「进入视频创作」继续使用当前结果。
   * 真实后端接入后可以把这里替换为 POST /drafts，不改变页面调用方式。
   */
  function createVideoDraft(): string | null {
    if (!result.value || !heritage.value) {
      return null
    }

    return saveCreationDraft({
      heritageId: heritage.value.id,
      heritageName: heritage.value.name,
      form: { ...form.value, extra: { ...form.value.extra } },
      result: {
        ...result.value,
        videoScript: result.value.videoScript
          ? {
              ...result.value.videoScript,
              shots: result.value.videoScript.shots.map((shot) => ({ ...shot })),
            }
          : undefined,
      },
    })
  }

  /** 短视频场景：由文案进一步生成分镜脚本 */
  async function generateScript(): Promise<boolean> {
    if (!heritage.value || !result.value) {
      ElMessage.warning('请先生成文案')
      return false
    }

    scriptLoading.value = true
    try {
      const script = await generateVideoScript({
        heritageId: heritage.value.id,
        duration: durationSeconds.value,
        style: form.value.style,
        content: result.value.content,
      })
      result.value = { ...result.value, videoScript: script }
      ElMessage.success('分镜脚本已生成')
      return true
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '脚本生成失败')
      return false
    } finally {
      scriptLoading.value = false
    }
  }

  /** 保存为作品 */
  async function saveWork(): Promise<Work | null> {
    if (!result.value || !heritage.value) {
      ElMessage.warning('请先生成内容')
      return null
    }

    saving.value = true
    try {
      const payload: Partial<Work> = {
        title: result.value.title,
        type: form.value.scene,
        heritageId: heritage.value.id,
        heritageName: heritage.value.name,
        summary: markdownToSummary(result.value.content, 96),
        content: result.value.content,
        sources: result.value.sources,
      }

      if (form.value.scene === 'video') {
        payload.duration = durationSeconds.value
        payload.style = form.value.style
        payload.storyboards = result.value.videoScript?.shots
      }

      const work = await createWork(payload)
      savedWorkId.value = work.id
      ElMessage.success('作品已保存，可在「我的作品」中查看')
      return work
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '保存失败，请稍后重试')
      return null
    } finally {
      saving.value = false
    }
  }

  /** 清空生成结果（保留创作参数，便于快速再试） */
  function resetResult(): void {
    result.value = null
    errorMessage.value = ''
    savedWorkId.value = ''
  }

  /** 从路由 query 初始化（支持 /creation?heritageId=xxx&scene=video） */
  async function initWithQuery(query: {
    heritageId?: unknown
    scene?: unknown
  }): Promise<void> {
    await loadOptions()

    const scene = typeof query.scene === 'string' ? (query.scene as SceneType) : undefined
    if (scene && scene !== form.value.scene) {
      form.value = applySceneDefaults(form.value, scene)
      result.value = null
    }

    const heritageId = typeof query.heritageId === 'string' ? query.heritageId : ''
    if (heritageId && heritageId !== form.value.heritageId) {
      await selectHeritage(heritageId)
    }
  }

  return {
    // 选项与项目
    options,
    optionsLoading,
    optionsFailed,
    heritage,
    heritageLoading,
    heritageFailed,
    // 参数
    form,
    // 结果
    result,
    generating,
    scriptLoading,
    saving,
    errorMessage,
    savedWorkId,
    // 派生
    sceneLabel,
    heritageName,
    hasResult,
    sources,
    sourcesFromResult,
    durationSeconds,
    canGenerate,
    // 动作
    loadOptions,
    selectHeritage,
    setScene,
    setField,
    getFieldValue,
    generate,
    regenerate,
    updateContent,
    createVideoDraft,
    generateScript,
    saveWork,
    resetResult,
    initWithQuery,
  }
})
