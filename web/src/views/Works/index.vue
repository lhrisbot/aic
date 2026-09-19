<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { WORK_PAGE_SIZE, parseWorkQuery, useWorkStore } from '@/stores/work'
import { WORK_TYPE_LABELS } from '@/config/constants'
import { ALL, type AllOption } from '@/types/common'
import type { Work, WorkSort, WorkType } from '@/types/work'
import WorkCard from '@/components/WorkCard.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import EmptyState from '@/components/EmptyState.vue'
import WorkFilterBar from './components/WorkFilterBar.vue'
import WorkEditDialog from './components/WorkEditDialog.vue'

/**
 * 我的作品。
 * 筛选条件（关键词 / 类型 / 排序 / 页码）写入 URL，刷新与前进后退都能还原；
 * 数据取自 stores/work，删除带二次确认。
 */
const route = useRoute()
const router = useRouter()
const store = useWorkStore()

const editVisible = ref(false)
const editingWork = ref<Work | null>(null)

const filters = computed(() => parseWorkQuery(route.query))
const hasFilter = computed(
  () => Boolean(filters.value.keyword) || filters.value.type !== ALL,
)
const videoWorkCount = computed(
  () => store.list.filter((work) => work.type === 'video' || work.type === 'videoWork').length,
)
const writingWorkCount = computed(
  () => store.list.filter((work) => work.type !== 'video' && work.type !== 'videoWork').length,
)

/** 更新 URL query（空值与「全部」不写入，保持地址栏干净） */
function setQuery(patch: Record<string, string | number | undefined>): void {
  const next: Record<string, string> = {}
  Object.entries({ ...route.query, ...patch }).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    const text = String(value)
    if (text === ALL || (key === 'page' && text === '1') || (key === 'sort' && text === 'latest')) {
      return
    }
    next[key] = text
  })
  void router.replace({ query: next })
}

function clearFilters(): void {
  void router.replace({ path: '/works' })
}

function handleSearch(keyword: string): void {
  setQuery({ keyword: keyword.trim(), page: 1 })
}

function handleTypeChange(value: WorkType | AllOption): void {
  setQuery({ type: value, page: 1 })
}

function handleSortChange(value: WorkSort): void {
  setQuery({ sort: value, page: 1 })
}

function handlePageChange(value: number): void {
  setQuery({ page: value })
}

function openWork(work: Work): void {
  void router.push(`/works/${work.id}`)
}

function viewScript(work: Work): void {
  void router.push({ path: `/works/${work.id}`, query: { section: 'script' } })
}

function openEdit(work: Work): void {
  editingWork.value = work
  editVisible.value = true
}

async function submitEdit(payload: {
  title: string
  content?: string
  summary?: string
}): Promise<void> {
  if (!editingWork.value) {
    return
  }
  const updated = await store.save(editingWork.value.id, payload)
  if (updated) {
    editVisible.value = false
    editingWork.value = null
  }
}

async function removeWork(work: Work): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `确认删除作品「${work.title}」吗？删除后无法恢复。`,
      '删除作品',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' },
    )
  } catch {
    return
  }
  await store.remove(work.id)
}

watch(
  () => route.query,
  () => {
    void store.load(filters.value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="works-page">
    <header class="works-page__header u-container">
      <div>
        <p class="works-page__eyebrow"><span aria-hidden="true" /> CONTENT LIBRARY</p>
        <h1 class="works-page__title">我的作品</h1>
        <p class="works-page__subtitle">
          AI 生成的文案与视频作品集中在这里，可随时查看、编辑，或带着脚本继续到视频创作页加工。
        </p>
      </div>

      <el-button
        type="primary"
        size="large"
        :icon="Plus"
        class="works-page__create"
        @click="router.push('/creation')"
      >
        新建作品
      </el-button>
    </header>

    <section class="works-page__dashboard u-container" aria-label="作品资产概览">
      <div class="works-page__dashboard-intro">
        <span class="works-page__dashboard-kicker">CONTENT ASSETS</span>
        <strong>你的文化内容资产</strong>
        <p>把灵感、脚本与成片留在同一个工作流里。</p>
      </div>
      <div class="works-page__metric">
        <span>全部作品</span>
        <strong>{{ store.total }}</strong>
        <small>已保存内容</small>
      </div>
      <div class="works-page__metric is-ai">
        <span>视频 / 分镜</span>
        <strong>{{ videoWorkCount }}</strong>
        <small>当前页资产</small>
      </div>
      <div class="works-page__metric is-writing">
        <span>图文 / 脚本</span>
        <strong>{{ writingWorkCount }}</strong>
        <small>当前页资产</small>
      </div>
    </section>

    <div class="u-container">
      <WorkFilterBar
        :keyword="filters.keyword"
        :type="filters.type"
        :sort="filters.sort"
        @search="handleSearch"
        @update:type="handleTypeChange"
        @update:sort="handleSortChange"
      />

      <div class="works-page__meta">
        <p class="works-page__count">
          共 <strong>{{ store.total }}</strong> 件作品<template v-if="filters.keyword">
            · 关键词「{{ filters.keyword }}」</template
          ><template v-if="filters.type !== ALL"> · {{ WORK_TYPE_LABELS[filters.type] }}</template>
        </p>

        <el-button v-if="hasFilter" text :icon="Refresh" @click="clearFilters">
          清除筛选
        </el-button>
      </div>

      <SkeletonBlock v-if="store.loading" variant="card" :count="6" />

      <EmptyState
        v-else-if="store.failed"
        title="作品加载失败"
        description="可能是网络或数据服务异常，请稍后重试。"
        size="compact"
      >
        <el-button :icon="Refresh" @click="store.load()">重新加载</el-button>
      </EmptyState>

      <EmptyState
        v-else-if="store.isEmpty && hasFilter"
        title="没有找到匹配的作品"
        description="换一个关键词或类型，也可以清除筛选条件后再看看。"
        size="compact"
      >
        <el-button @click="clearFilters">清除筛选条件</el-button>
      </EmptyState>

      <EmptyState
        v-else-if="store.isEmpty"
        title="还没有作品"
        description="去 AI 创作页选一个非遗项目和创作场景，生成的第一篇文案会自动出现在这里。"
        size="compact"
      >
        <el-button type="primary" @click="router.push('/creation')">去 AI 创作</el-button>
      </EmptyState>

      <TransitionGroup v-else name="card" tag="div" class="works-page__grid">
        <WorkCard
          v-for="work in store.list"
          :key="work.id"
          :work="work"
          @view="openWork"
          @play="openWork"
          @script="viewScript"
          @edit="openEdit"
          @remove="removeWork"
        />
      </TransitionGroup>

      <div
        v-if="!store.loading && !store.failed && store.total > WORK_PAGE_SIZE"
        class="works-page__pagination"
      >
        <el-pagination
          background
          layout="prev, pager, next"
          :total="store.total"
          :page-size="WORK_PAGE_SIZE"
          :current-page="filters.page"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <WorkEditDialog v-model="editVisible" :work="editingWork" @submit="submitEdit" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.works-page {
  position: relative;
  padding-bottom: var(--sp-16);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 10%;
    width: min(420px, 38vw);
    height: 220px;
    pointer-events: none;
    background: radial-gradient(closest-side, rgba(192, 80, 60, 0.08), transparent 72%);
  }

  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--sp-6);
    padding-block: var(--sp-10) var(--sp-6);

    @include below($bp-md) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-4);
      padding-block: var(--sp-8) var(--sp-5);
    }
  }

  &__title {
    font-size: var(--fs-3xl);
    letter-spacing: 1px;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1.4px;

    span {
      width: 24px;
      height: 1px;
      background: var(--color-primary);
    }
  }

  &__subtitle {
    margin-top: var(--sp-3);
    max-width: 640px;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__create {
    flex: none;
  }

  &__dashboard {
    display: grid;
    grid-template-columns: minmax(220px, 1.4fr) repeat(3, minmax(130px, 0.7fr));
    gap: 1px;
    margin-bottom: var(--sp-8);
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: rgba(255, 255, 255, 0.16);
    box-shadow: 0 18px 42px rgba(35, 34, 32, 0.12);

    @include below($bp-md) {
      grid-template-columns: 1fr 1fr;
      margin-inline: var(--sp-4);
    }

    @include below($bp-sm) {
      grid-template-columns: 1fr;
      margin-inline: 0;
    }
  }

  &__dashboard-intro,
  &__metric {
    min-height: 122px;
    padding: var(--sp-5);
    background: #252624;
    color: var(--text-inverse);
  }

  &__dashboard-intro {
    background:
      radial-gradient(90% 120% at 0% 100%, rgba(192, 80, 60, 0.36), transparent 68%),
      #252624;

    strong {
      display: block;
      margin-top: var(--sp-3);
      font-family: var(--font-serif);
      font-size: var(--fs-lg);
      font-weight: var(--fw-medium);
    }

    p {
      margin-top: 4px;
      color: rgba(253, 251, 247, 0.54);
      font-size: var(--fs-xs);
    }
  }

  &__dashboard-kicker {
    color: rgba(253, 251, 247, 0.48);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.2px;
  }

  &__metric {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #2c302d;

    &.is-ai {
      background: #273e3f;
    }

    &.is-writing {
      background: #3b302d;
    }

    span {
      color: rgba(253, 251, 247, 0.66);
      font-size: var(--fs-xs);
    }

    strong {
      margin-top: var(--sp-3);
      color: var(--text-inverse);
      font-family: var(--font-mono);
      font-size: 30px;
      font-weight: var(--fw-medium);
      line-height: 1;
    }

    small {
      color: rgba(253, 251, 247, 0.38);
      font-size: 10px;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    margin-block: var(--sp-6) var(--sp-5);
  }

  &__count {
    font-size: var(--fs-sm);
    color: var(--text-secondary);

    strong {
      color: var(--color-primary);
      font-family: var(--font-serif);
      font-size: var(--fs-md);
    }
  }

  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--sp-6);

    @include below($bp-lg) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include below($bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__pagination {
    display: flex;
    justify-content: center;
    margin-top: var(--sp-10);
  }
}
</style>
