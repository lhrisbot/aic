import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { fetchHeritageById, fetchHeritages } from '@/api/heritage'
import { generateVideoScript } from '@/api/ai'
import {
  createVideoTask,
  fetchVideoTaskStatus,
  regenerateStoryboard,
} from '@/api/video'
import { createWork, fetchWorkById, fetchWorks } from '@/api/work'
import type { Heritage } from '@/types/heritage'
import type { Storyboard, VideoTask } from '@/types/video'
import type { Work } from '@/types/work'
import { readCreationDraft } from '@/utils/creation-draft'
import { markdownToSummary } from '@/utils/format'

/** 状态轮询间隔与最大次数（约 1.2s × 40 ≈ 48s，避免异常情况下无限轮询） */
const POLL_INTERVAL = 1200
const POLL_MAX_ATTEMPTS = 40

/**
 * 视频创作页状态。
 * 数据来源三种入口：从创作页带 workId 进入、带 heritageId 进入、直接进入后自行选择。
 * 分镜是页面唯一的可变数据源，生成任务时以快照提交，避免生成过程中改动影响任务结果。
 */
export const useVideoStore = defineStore('video', () => {
  /* ---------------- 数据来源 ---------------- */
  const sourceWork = ref<Work | null>(null)
  const scriptContent = ref('')
  const heritage = ref<Heritage | null>(null)
  const title = ref('')
  const platform = ref('抖音')
  const style = ref('国潮')
  const duration = ref(30)

  /* ---------------- 分镜 ---------------- */
  const storyboards = ref<Storyboard[]>([])
  const busyShotId = ref('')
  const scriptLoading = ref(false)

  /* ---------------- 任务 ---------------- */
  const task = ref<VideoTask | null>(null)
  const simulateFailure = ref(false)
  const creating = ref(false)
  const saving = ref(false)
  const savedWorkId = ref('')
  let pollTimer: number | null = null
  let pollAttempts = 0

  /* ---------------- 选择器数据 ---------------- */
  const heritageOptions = ref<Heritage[]>([])
  const videoWorks = ref<Work[]>([])
  const optionsLoading = ref(false)

  /* ---------------- 派生 ---------------- */
  const hasSource = computed(() => Boolean(heritage.value))
  const status = computed(() => task.value?.status ?? 'idle')
  const progress = computed(() => task.value?.progress ?? 0)
  const isGenerating = computed(
    () => status.value === 'pending' || status.value === 'generating',
  )
  const isSuccess = computed(() => status.value === 'success')
  const isFailed = computed(() => status.value === 'failed')

  /** 步骤条进度：文案 → 脚本 → 分镜 → 生成 */
  const activeStep = computed(() => {
    if (task.value) {
      return 3
    }
    if (storyboards.value.length > 0) {
      return 2
    }
    if (scriptContent.value.trim()) {
      return 1
    }
    return 0
  })

  const timelineError = computed(() => {
    let previousEnd = 0
    for (const shot of storyboards.value) {
      if (shot.start < 0 || shot.end <= shot.start) {
        return `镜头 ${String(shot.index).padStart(2, '0')} 的时间范围无效`
      }
      if (shot.end > duration.value) {
        return `镜头 ${String(shot.index).padStart(2, '0')} 超出视频总时长`
      }
      if (shot.start < previousEnd) {
        return `镜头 ${String(shot.index).padStart(2, '0')} 与前一个镜头重叠`
      }
      previousEnd = shot.end
    }
    return ''
  })

  const canCreateTask = computed(
    () =>
      hasSource.value &&
      storyboards.value.length > 0 &&
      !timelineError.value &&
      !creating.value,
  )

  watch(duration, () => {
    if (storyboards.value.length > 0) {
      resetTaskState()
    }
  })

  /* ---------------- 选择器 ---------------- */
  async function loadOptions(): Promise<void> {
    if (optionsLoading.value) {
      return
    }
    optionsLoading.value = true
    try {
      const [heritagePage, workPage] = await Promise.all([
        fetchHeritages({ page: 1, pageSize: 100 }),
        fetchWorks({ page: 1, pageSize: 100 }),
      ])
      heritageOptions.value = heritagePage.list
      videoWorks.value = workPage.list.filter(
        (work) => work.type === 'video' || work.type === 'videoWork',
      )
    } catch {
      heritageOptions.value = []
      videoWorks.value = []
    } finally {
      optionsLoading.value = false
    }
  }

  /* ---------------- 数据来源切换 ---------------- */
  function resetTaskState(): void {
    stopPolling()
    task.value = null
    savedWorkId.value = ''
  }

  // 用户改动主题稿后，原分镜和已提交的任务都不再对应当前文案。
  watch(scriptContent, () => {
    storyboards.value = []
    resetTaskState()
  }, { flush: 'sync' })

  /** 选择非遗项目作为视频主题 */
  async function applyHeritage(id: string): Promise<void> {
    if (!id) {
      return
    }
    try {
      const data = await fetchHeritageById(id)
      heritage.value = data
      sourceWork.value = null
      scriptContent.value = ''
      storyboards.value = []
      resetTaskState()
      title.value = `${data.name} · ${style.value}非遗宣传短片`
    } catch {
      ElMessage.error('非遗资料加载失败，请重新选择')
    }
  }

  /** 从已有视频作品继续（复用其分镜） */
  async function applyWork(workId: string): Promise<void> {
    if (!workId) {
      return
    }
    try {
      const work = await fetchWorkById(workId)
      sourceWork.value = work
      scriptContent.value = work.content ?? ''
      title.value = work.title
      duration.value = work.duration ?? duration.value
      style.value = work.style ?? style.value
      storyboards.value = (work.storyboards ?? []).map((shot) => ({ ...shot }))
      resetTaskState()

      const data = await fetchHeritageById(work.heritageId)
      heritage.value = data
    } catch {
      ElMessage.error('作品加载失败，请重新选择')
    }
  }

  /** 由当前非遗与风格生成分镜脚本 */
  async function ensureScript(force = false): Promise<boolean> {
    if (!heritage.value) {
      ElMessage.warning('请先选择非遗项目')
      return false
    }
    if (storyboards.value.length > 0 && !force) {
      return true
    }

    scriptLoading.value = true
    try {
      const script = await generateVideoScript({
        heritageId: heritage.value.id,
        duration: duration.value,
        style: style.value,
        ...(scriptContent.value.trim() ? { content: scriptContent.value.trim() } : {}),
      })
      storyboards.value = script.shots.map((shot) => ({ ...shot }))
      title.value = script.title
      duration.value = script.duration
      resetTaskState()
      ElMessage.success('分镜脚本已生成')
      return true
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '脚本生成失败')
      return false
    } finally {
      scriptLoading.value = false
    }
  }

  /* ---------------- 分镜增删改 ---------------- */
  function renumber(): void {
    storyboards.value = storyboards.value.map((shot, index) => ({ ...shot, index: index + 1 }))
  }

  function updateShot(shot: Storyboard): boolean {
    const currentIndex = storyboards.value.findIndex((item) => item.id === shot.id)
    const previous = currentIndex > 0 ? storyboards.value[currentIndex - 1] : undefined
    const next = currentIndex >= 0 ? storyboards.value[currentIndex + 1] : undefined

    if (shot.start < 0 || shot.end <= shot.start || shot.end > duration.value) {
      ElMessage.warning('分镜时间必须在视频总时长内，且结束时间要大于起始时间')
      return false
    }
    if (previous && shot.start < previous.end) {
      ElMessage.warning('当前分镜不能与前一个分镜重叠')
      return false
    }
    if (next && shot.end > next.start) {
      ElMessage.warning('当前分镜不能与后一个分镜重叠')
      return false
    }

    storyboards.value = storyboards.value.map((item) => (item.id === shot.id ? { ...shot } : item))
    resetTaskState()
    return true
  }

  function deleteShot(id: string): void {
    storyboards.value = storyboards.value.filter((shot) => shot.id !== id)
    renumber()
    resetTaskState()
  }

  function addShot(): void {
    const last = storyboards.value[storyboards.value.length - 1]
    const start = last ? last.end : 0
    const end = Math.min(start + 5, duration.value)
    if (end <= start) {
      ElMessage.warning('当前视频时长已没有可用的新增分镜时间')
      return
    }
    const index = storyboards.value.length + 1
    storyboards.value = [
      ...storyboards.value,
      {
        id: `shot-custom-${Date.now().toString(36)}`,
        index,
        start,
        end,
        scene: '补充镜头：在这里描述画面内容',
        narration: '补充旁白',
        prompt: 'custom shot, describe the visual you want',
      },
    ]
    resetTaskState()
  }

  async function regenerateShot(shot: Storyboard): Promise<void> {
    if (!heritage.value) {
      return
    }
    busyShotId.value = shot.id
    try {
      const next = await regenerateStoryboard({
        heritageId: heritage.value.id,
        shot,
      })
      updateShot({ ...next, id: shot.id, index: shot.index, start: shot.start, end: shot.end })
      ElMessage.success(`镜头 ${String(shot.index).padStart(2, '0')} 已重新生成`)
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '分镜重新生成失败')
    } finally {
      busyShotId.value = ''
    }
  }

  /* ---------------- 视频任务 ---------------- */
  function stopPolling(): void {
    if (pollTimer !== null) {
      window.clearInterval(pollTimer)
      pollTimer = null
    }
    pollAttempts = 0
  }

  async function poll(): Promise<void> {
    if (!task.value) {
      return
    }
    pollAttempts += 1
    if (pollAttempts > POLL_MAX_ATTEMPTS) {
      stopPolling()
      task.value = {
        ...task.value,
        status: 'failed',
        errorMessage: '生成超时，请稍后重试或简化分镜内容',
      }
      return
    }

    try {
      const next = await fetchVideoTaskStatus(task.value.id)
      task.value = next
      if (next.status === 'success' || next.status === 'failed') {
        stopPolling()
      }
    } catch (error) {
      stopPolling()
      task.value = {
        ...task.value,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : '状态查询失败',
      }
    }
  }

  function startPolling(): void {
    stopPolling()
    pollTimer = window.setInterval(() => {
      void poll()
    }, POLL_INTERVAL)
    void poll()
  }

  /** 根据当前分镜创建视频生成任务 */
  async function createTask(): Promise<boolean> {
    if (!heritage.value) {
      ElMessage.warning('请先选择非遗项目')
      return false
    }
    if (storyboards.value.length === 0) {
      ElMessage.warning('请先生成分镜脚本')
      return false
    }

    creating.value = true
    savedWorkId.value = ''
    try {
      const created = await createVideoTask({
        heritageId: heritage.value.id,
        workId: sourceWork.value?.id,
        title: title.value,
        platform: platform.value,
        style: style.value,
        duration: duration.value,
        storyboards: storyboards.value.map((shot) => ({ ...shot })),
        ...(simulateFailure.value ? { simulate: 'failed' as const } : {}),
      })
      task.value = created
      startPolling()
      return true
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '视频任务创建失败')
      return false
    } finally {
      creating.value = false
    }
  }

  /** 重新生成：清空任务后按当前分镜再提交一次 */
  async function regenerateTask(): Promise<void> {
    resetTaskState()
    await createTask()
  }

  function resetTask(): void {
    resetTaskState()
  }

  /** 保存为视频作品 */
  async function saveTaskAsWork(): Promise<Work | null> {
    if (!task.value || !heritage.value) {
      ElMessage.warning('请先生成视频')
      return null
    }
    if (task.value.status !== 'success') {
      ElMessage.warning('视频生成成功后才能保存为作品')
      return null
    }

    saving.value = true
    try {
      const work = await createWork({
        title: task.value.title,
        type: 'videoWork',
        heritageId: task.value.heritageId,
        heritageName: task.value.heritageName,
        // 保留用户确认后的主题稿，便于从「我的作品」再次进入视频页时继续编辑。
        content: scriptContent.value.trim() || undefined,
        summary: markdownToSummary(
          `${task.value.style}风格 ${task.value.duration} 秒短视频，共 ${task.value.storyboards.length} 个分镜，目标平台 ${task.value.platform}。`,
          96,
        ),
        cover: task.value.cover,
        duration: task.value.duration,
        style: task.value.style,
        videoTaskId: task.value.id,
        videoUrl: task.value.videoUrl,
        storyboards: task.value.storyboards.map((shot) => ({ ...shot })),
      })
      savedWorkId.value = work.id
      ElMessage.success('视频作品已保存，可在「我的作品」中查看')
      return work
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '保存失败，请稍后重试')
      return null
    } finally {
      saving.value = false
    }
  }

  /* ---------------- 路由初始化 ---------------- */
  async function initWithQuery(query: {
    workId?: unknown
    heritageId?: unknown
    draftId?: unknown
  }): Promise<void> {
    await loadOptions()

    const draftId = typeof query.draftId === 'string' ? query.draftId : ''
    if (draftId) {
      const draft = readCreationDraft(draftId)
      if (draft) {
        sourceWork.value = null
        scriptContent.value = draft.result.content
        try {
          heritage.value = await fetchHeritageById(draft.heritageId)
        } catch {
          ElMessage.error('非遗资料加载失败，请重新选择')
          return
        }
        title.value = draft.result.videoScript?.title || draft.result.title
        platform.value = draft.form.platform || platform.value
        style.value = draft.form.style || style.value
        duration.value = draft.result.videoScript?.duration ?? duration.value
        storyboards.value = (draft.result.videoScript?.shots ?? []).map((shot) => ({ ...shot }))
        resetTaskState()
        return
      }
    }

    const workId = typeof query.workId === 'string' ? query.workId : ''
    if (workId && sourceWork.value?.id !== workId) {
      await applyWork(workId)
      return
    }

    const heritageId = typeof query.heritageId === 'string' ? query.heritageId : ''
    if (heritageId && heritage.value?.id !== heritageId) {
      await applyHeritage(heritageId)
    }
  }

  /** 页面卸载时停止轮询 */
  function dispose(): void {
    stopPolling()
  }

  return {
    // 数据来源
    sourceWork,
    scriptContent,
    heritage,
    title,
    platform,
    style,
    duration,
    // 分镜
    storyboards,
    busyShotId,
    scriptLoading,
    // 任务
    task,
    simulateFailure,
    creating,
    saving,
    savedWorkId,
    // 选择器
    heritageOptions,
    videoWorks,
    optionsLoading,
    // 派生
    hasSource,
    status,
    progress,
    isGenerating,
    isSuccess,
    isFailed,
    timelineError,
    activeStep,
    canCreateTask,
    // 动作
    loadOptions,
    applyHeritage,
    applyWork,
    ensureScript,
    updateShot,
    deleteShot,
    addShot,
    regenerateShot,
    createTask,
    regenerateTask,
    resetTask,
    saveTaskAsWork,
    initWithQuery,
    dispose,
  }
})
