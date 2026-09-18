<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, Refresh } from '@element-plus/icons-vue'
import { fetchHotHeritages } from '@/api/heritage'
import type { Heritage } from '@/types/heritage'
import HeritageCard from '@/components/HeritageCard.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import EmptyState from '@/components/EmptyState.vue'

const list = ref<Heritage[]>([])
const loading = ref(true)
const failed = ref(false)

async function load(): Promise<void> {
  loading.value = true
  failed.value = false
  try {
    list.value = await fetchHotHeritages(6)
  } catch {
    failed.value = true
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="hot-heritage">
    <div class="u-container">
      <SectionTitle
        eyebrow="热门推荐"
        title="从这些非遗开始"
        subtitle="每个项目都配有历史渊源、艺术特色、技艺流程与参考资料，可直接用于 AI 创作。"
      >
        <template #extra>
          <RouterLink class="hot-heritage__more" to="/heritage">
            查看全部非遗
            <el-icon :size="14"><ArrowRight /></el-icon>
          </RouterLink>
        </template>
      </SectionTitle>

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
        title="暂无推荐内容"
        description="可以先到非遗探索页查看全部项目。"
        size="compact"
      >
        <el-button type="primary" @click="$router.push('/heritage')">去非遗探索</el-button>
      </EmptyState>

      <div v-else class="hot-heritage__grid">
        <HeritageCard v-for="item in list" :key="item.id" :heritage="item" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.hot-heritage {
  padding-block: var(--sp-16);

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

  &__more {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    font-size: var(--fs-sm);
    color: var(--color-primary);
    transition: gap var(--duration) var(--ease-out);

    &:hover {
      gap: var(--sp-2);
    }
  }
}
</style>
