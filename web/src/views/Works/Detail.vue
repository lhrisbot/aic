<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowLeft, Delete, EditPen, Film, Refresh } from '@element-plus/icons-vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { fetchWorkById } from '@/api/work'
import { useWorkStore } from '@/stores/work'
import { APP_NAME, WORK_TYPE_LABELS } from '@/config/constants'
import type { Work } from '@/types/work'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import SourceCard from '@/components/SourceCard.vue'
import StoryboardCard from '@/components/StoryboardCard.vue'
import VideoPlayerPlaceholder from '@/components/VideoPlayerPlaceholder.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import EmptyState from '@/components/EmptyState.vue'
import WorkEditDialog from './components/WorkEditDialog.vue'

/**
 * 作品详情。
 * - 文章型：Markdown 正文 + 生成时依据的参考资料；
 * - 视频型：播放占位区 + 视频信息 + 分镜脚本（只读）。
 * 支持编辑与删除（二次确认后回到列表）。
 */
const route = useRoute()
const router = useRouter()
const workStore = useWorkStore()

const work = ref<Work | null>(null)
const loading = ref(true)
const failed = ref(false)
const editVisible = ref(false)

const id = computed(() => String(route.params.id ?? ''))
const isVideo = computed(() => work.value?.type === 'videoWork')
const typeLabel = computed(() => (work.value ? WORK_TYPE_LABELS[work.value.type] : ''))
const storyboards = computed(() => work.value?.storyboards ?? [])

async function load(): Promise<void> {
  loading.value = true
  failed.value = false
  work.value = null
  try {
    const data = await fetchWorkById(id.value)
    work.value = data
    document.title = `${data.title} · ${APP_NAME}`

    // 从列表点「查看脚本」进入时，滚动到脚本区
    if (route.query.section === 'script') {
      await nextTick()
      window.setTimeout(() => {
        document.getElementById('script')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

async function submitEdit(payload: {
  title: string
  content?: string
  summary?: string
}): Promise<void> {
  if (!work.value) {
    return
  }
  const updated = await workStore.save(work.value.id, payload)
  if (updated) {
    work.value = updated
    editVisible.value = false
  }
}

async function removeWork(): Promise<void> {
  if (!work.value) {
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认删除作品「${work.value.title}」吗？删除后无法恢复。`,
      '删除作品',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' },
    )
  } catch {
    return
  }

  const succeed = await workStore.remove(work.value.id)
  if (succeed) {
    await router.push('/works')
  }
}

function goVideoCreation(): void {
  if (!work.value) {
    return
  }
  void router.push({
    path: '/video',
    query: { workId: work.value.id, heritageId: work.value.heritageId },
  })
}

watch(id, () => void load(), { immediate: true })
</script>

<template>
  <div class="work-detail">
    <!-- 加载中 -->
    <div v-if="loading" class="u-container">
      <div class="work-detail__loading">
        <SkeletonBlock variant="text" :rows="2" />
        <SkeletonBlock variant="text" :rows="6" />
      </div>
    </div>

    <!-- 未找到 -->
    <div v-else-if="failed || !work" class="u-container">
      <div class="work-detail__empty">
        <EmptyState
          title="没有找到这件作品"
          description="作品可能已被删除，或地址中的编号不正确。"
        >
          <el-button type="primary" @click="router.push('/works')">返回我的作品</el-button>
          <el-button :icon="Refresh" @click="load">重新加载</el-button>
        </EmptyState>
      </div>
    </div>

    <template v-else>
      <nav class="work-detail__breadcrumb u-container" aria-label="面包屑">
        <RouterLink class="work-detail__crumb-link" to="/works">
          <el-icon :size="14"><ArrowLeft /></el-icon>
          我的作品
        </RouterLink>
        <span class="work-detail__crumb-sep">/</span>
        <span class="work-detail__crumb-current">{{ work.title }}</span>
      </nav>

      <div class="u-container">
        <!-- 头部信息 -->
        <header class="work-detail__header">
          <div class="work-detail__head-main">
            <span class="work-detail__type" :class="{ 'is-video': isVideo }">
              <el-icon :size="13">
                <Film v-if="isVideo" />
                <EditPen v-else />
              </el-icon>
              {{ typeLabel }}
            </span>

            <h1 class="work-detail__title">{{ work.title }}</h1>

            <p class="work-detail__meta">
              <RouterLink class="work-detail__heritage" :to="`/heritage/${work.heritageId}`">
                非遗项目：{{ work.heritageName }}
              </RouterLink>
              <i class="work-detail__dot" aria-hidden="true" />
              <span>创建于 {{ new Date(work.createdAt).toLocaleString('zh-CN') }}</span>
              <template v-if="isVideo">
                <i class="work-detail__dot" aria-hidden="true" />
                <span>{{ work.duration }} 秒 · {{ work.style }}</span>
                <i class="work-detail__dot" aria-hidden="true" />
                <span>{{ storyboards.length }} 个分镜</span>
              </template>
              <template v-else-if="work.sources?.length">
                <i class="work-detail__dot" aria-hidden="true" />
                <span>引用 {{ work.sources.length }} 条资料</span>
              </template>
            </p>

            <p v-if="work.summary" class="work-detail__summary">{{ work.summary }}</p>
          </div>

          <div class="work-detail__actions">
            <el-button :icon="EditPen" @click="editVisible = true">编辑</el-button>
            <el-button
              v-if="isVideo"
              @click="goVideoCreation"
            >
              去视频创作页加工
            </el-button>
            <el-button type="danger" plain :icon="Delete" @click="removeWork">删除</el-button>
          </div>
        </header>

        <!-- 视频型：播放区 + 分镜脚本 -->
        <template v-if="isVideo">
          <section class="work-detail__section">
            <h2 class="work-detail__section-title">视频预览</h2>
            <VideoPlayerPlaceholder
              :title="work.title"
              :duration="work.duration ?? 0"
              :video-url="work.videoUrl"
              :cover="work.cover"
            />
          </section>

          <section id="script" class="work-detail__section">
            <div class="work-detail__section-head">
              <h2 class="work-detail__section-title">分镜脚本</h2>
              <span class="work-detail__section-note">共 {{ storyboards.length }} 个镜头</span>
            </div>

            <div v-if="storyboards.length" class="work-detail__shots">
              <StoryboardCard v-for="shot in storyboards" :key="shot.id" :shot="shot" readonly />
            </div>

            <EmptyState
              v-else
              title="这件作品没有保存分镜"
              description="可以到视频创作页重新拆分分镜后再保存。"
              size="compact"
            >
              <el-button @click="goVideoCreation">去视频创作页</el-button>
            </EmptyState>
          </section>
        </template>

        <!-- 文章型：正文 + 参考资料 -->
        <template v-else>
          <section class="work-detail__section">
            <MarkdownRenderer :content="work.content ?? ''" />
          </section>

          <section v-if="work.sources?.length" class="work-detail__section">
            <div class="work-detail__section-head">
              <h2 class="work-detail__section-title">参考资料</h2>
              <span class="work-detail__section-note">
                生成时依据的 {{ work.sources.length }} 条知识库资料
              </span>
            </div>

            <div class="work-detail__sources">
              <SourceCard
                v-for="(source, index) in work.sources"
                :key="source.id"
                :source="source"
                :index="index + 1"
              />
            </div>
          </section>
        </template>
      </div>
    </template>

    <WorkEditDialog v-model="editVisible" :work="work" @submit="submitEdit" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.work-detail {
  padding-bottom: var(--sp-16);

  &__loading {
    display: flex;
    flex-direction: column;
    gap: var(--sp-8);
    max-width: 860px;
    padding-block: var(--sp-12);
  }

  &__empty {
    padding-block: var(--sp-16);
  }

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    padding-block: var(--sp-6);
    font-size: var(--fs-sm);
    color: var(--text-tertiary);
  }

  &__crumb-link {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    color: var(--text-secondary);

    &:hover {
      color: var(--color-primary);
    }
  }

  &__crumb-current {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--text-primary);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sp-8);
    padding: var(--sp-8) var(--sp-10);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);

    @include below($bp-lg) {
      flex-direction: column;
      gap: var(--sp-6);
      padding: var(--sp-6);
    }
  }

  &__head-main {
    min-width: 0;
  }

  &__type {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    padding: 3px 10px;
    border-radius: var(--radius-xs);
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-size: var(--fs-xs);

    &.is-video {
      background: var(--color-ai-soft);
      color: var(--color-ai);
    }
  }

  &__title {
    margin-top: var(--sp-4);
    font-size: var(--fs-2xl);
    line-height: 1.4;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    flex-wrap: wrap;
    margin-top: var(--sp-4);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__heritage {
    color: var(--color-primary);
  }

  &__dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--border-color-strong);
  }

  &__summary {
    margin-top: var(--sp-4);
    max-width: 720px;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex: none;
    flex-wrap: wrap;
  }

  &__section {
    margin-top: var(--sp-10);
  }

  &__section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sp-4);
    margin-bottom: var(--sp-5);
    padding-bottom: var(--sp-3);
    border-bottom: 1px dashed var(--border-color);
  }

  &__section-title {
    font-size: var(--fs-xl);
  }

  &__section-note {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__shots {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  &__sources {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }
}
</style>
