<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'
import { fetchHeritages } from '@/api/heritage'
import {
  HERITAGE_CATEGORIES,
  HERITAGE_PAGE_SIZE,
  HERITAGE_REGIONS,
} from '@/config/constants'
import { ALL, type AllOption } from '@/types/common'
import type { Heritage, HeritageCategory, HeritageRegion } from '@/types/heritage'
import HeritageCard from '@/components/HeritageCard.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import EmptyState from '@/components/EmptyState.vue'
import PatternBackdrop from '@/components/PatternBackdrop.vue'
import HeritageSearchBar from './components/HeritageSearchBar.vue'
import HeritageFilterBar from './components/HeritageFilterBar.vue'

const route = useRoute()
const router = useRouter()

const list = ref<Heritage[]>([])
const total = ref(0)
const loading = ref(true)
const failed = ref(false)

function queryString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/** 筛选条件全部以 URL query 为准：刷新、前进后退、分享链接都能还原状态 */
const keyword = computed(() => queryString(route.query.keyword))
const category = computed<HeritageCategory | AllOption>(() => {
  const raw = queryString(route.query.category)
  return HERITAGE_CATEGORIES.includes(raw as HeritageCategory)
    ? (raw as HeritageCategory)
    : ALL
})
const region = computed<HeritageRegion | AllOption>(() => {
  const raw = queryString(route.query.region)
  return HERITAGE_REGIONS.includes(raw as HeritageRegion) ? (raw as HeritageRegion) : ALL
})
const page = computed(() => {
  const raw = Number(queryString(route.query.page) || '1')
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1
})

const hasFilter = computed(
  () => Boolean(keyword.value) || category.value !== ALL || region.value !== ALL,
)

/** 搜索框的输入态：与已生效的关键词解耦，回车或点击搜索后才写入 URL */
const keywordInput = ref(keyword.value)
watch(keyword, (value) => {
  keywordInput.value = value
})

/** 更新 URL query（空值与「全部」不写入，保持地址栏干净） */
function setQuery(patch: Record<string, string | number | undefined>): void {
  const next: Record<string, string> = {}
  Object.entries({ ...route.query, ...patch }).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    const text = String(value)
    if (text === ALL || (key === 'page' && text === '1')) {
      return
    }
    next[key] = text
  })
  void router.replace({ query: next })
}

async function load(): Promise<void> {
  loading.value = true
  failed.value = false
  try {
    const result = await fetchHeritages({
      keyword: keyword.value,
      category: category.value,
      region: region.value,
      page: page.value,
      pageSize: HERITAGE_PAGE_SIZE,
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

function applySearch(): void {
  setQuery({ keyword: keywordInput.value.trim(), page: 1 })
}

function changeCategory(value: HeritageCategory | AllOption): void {
  setQuery({ category: value, page: 1 })
}

function changeRegion(value: HeritageRegion | AllOption): void {
  setQuery({ region: value, page: 1 })
}

function changePage(value: number): void {
  setQuery({ page: value })
}

function clearFilters(): void {
  keywordInput.value = ''
  void router.replace({ path: '/heritage' })
}

watch(
  () => route.query,
  () => {
    void load()
  },
  { immediate: true },
)
</script>

<template>
  <div class="heritage-list">
    <header class="heritage-list__hero">
      <PatternBackdrop class="heritage-list__texture" variant="crackle" />

      <div class="heritage-list__hero-inner u-container">
        <h1 class="heritage-list__title">探索中国非遗</h1>
        <p class="heritage-list__subtitle">
          发现传统文化背后的故事，并使用 AI 开启新的传播方式。
        </p>

        <HeritageSearchBar
          v-model="keywordInput"
          class="heritage-list__search"
          :loading="loading"
          @search="applySearch"
        />
      </div>
    </header>

    <div class="u-container">
      <HeritageFilterBar
        :category="category"
        :region="region"
        @update:category="changeCategory"
        @update:region="changeRegion"
      />

      <div class="heritage-list__meta">
        <p class="heritage-list__count">
          共 <strong>{{ total }}</strong> 项非遗<template v-if="keyword">
            · 关键词「{{ keyword }}」</template
          ><template v-if="category !== ALL"> · {{ category }}</template
          ><template v-if="region !== ALL"> · {{ region }}</template>
        </p>

        <el-button v-if="hasFilter" text :icon="Refresh" @click="clearFilters">
          清除筛选
        </el-button>
      </div>

      <SkeletonBlock v-if="loading" variant="card" :count="6" />

      <EmptyState
        v-else-if="failed"
        title="非遗资料加载失败"
        description="可能是网络或数据服务异常，请稍后重试。"
        size="compact"
      >
        <el-button :icon="Refresh" @click="load">重新加载</el-button>
      </EmptyState>

      <EmptyState
        v-else-if="list.length === 0"
        title="没有找到匹配的非遗项目"
        description="换一个关键词，或清除筛选条件后再试试。"
        size="compact"
      >
        <el-button type="primary" @click="clearFilters">清除筛选条件</el-button>
      </EmptyState>

      <div v-else class="heritage-list__grid">
        <HeritageCard v-for="item in list" :key="item.id" :heritage="item" />
      </div>

      <div
        v-if="!loading && !failed && total > HERITAGE_PAGE_SIZE"
        class="heritage-list__pagination"
      >
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="HERITAGE_PAGE_SIZE"
          :current-page="page"
          @current-change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.heritage-list {
  &__hero {
    position: relative;
    padding-block: var(--sp-12) var(--sp-10);
    margin-bottom: var(--sp-8);
    border-bottom: 1px solid var(--border-color);

    @include below($bp-md) {
      padding-block: var(--sp-8) var(--sp-6);
    }
  }

  &__texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    --pattern-opacity: 0.05;
  }

  &__hero-inner {
    position: relative;
    z-index: 1;
  }

  &__title {
    font-size: var(--fs-4xl);
    letter-spacing: 2px;

    @include below($bp-md) {
      font-size: var(--fs-3xl);
    }
  }

  &__subtitle {
    margin-top: var(--sp-4);
    font-size: var(--fs-md);
    color: var(--text-secondary);
  }

  &__search {
    max-width: 720px;
    margin-top: var(--sp-8);
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
