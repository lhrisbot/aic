<script setup lang="ts">
import { computed } from 'vue'
import { InfoFilled, Reading } from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'
import { useCreationStore } from '@/stores/creation'
import SourceCard from '@/components/SourceCard.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import EmptyState from '@/components/EmptyState.vue'
import { USE_MOCK } from '@/utils/request'

/**
 * 右栏：AI 参考资料。
 * 明确区分两种状态：
 * - 生成前：展示该项目在知识库中的资料，说明"AI 将基于以下资料创作"；
 * - 生成后：展示本次实际引用的资料，强调"基于知识库的可信资料，而不是完全自由生成"。
 */
const store = useCreationStore()

const noteText = computed(() =>
  USE_MOCK
    ? '当前为演示资料，来源名称和相关度仅用于展示检索流程；正式使用前需由知识库返回可核验链接。'
    : store.sourcesFromResult
      ? '本次生成依据下列资料。点击正文引用编号可以定位到对应来源。'
      : 'AI 将基于以下知识库资料进行创作，生成后会在此处显示本次实际引用的资料与相关度。',
)
</script>

<template>
  <section class="knowledge-panel">
    <header class="knowledge-panel__head">
      <h2 class="knowledge-panel__title">
        <el-icon :size="16"><Reading /></el-icon>
        AI 参考资料
      </h2>

      <p v-if="store.heritage" class="knowledge-panel__heritage">
        {{ store.heritage.name }}
        <span class="knowledge-panel__count">检索到 {{ store.sources.length }} 条</span>
      </p>
    </header>

    <div v-if="!store.form.heritageId" class="knowledge-panel__blank">
      <EmptyState
        title="尚未选择非遗项目"
        description="在左侧选择项目后，这里会显示知识库中该项目的资料与来源。"
        size="compact"
      />
    </div>

    <div v-else-if="store.heritageLoading" class="knowledge-panel__skeleton">
      <SkeletonBlock variant="list" :rows="3" />
    </div>

    <template v-else>
      <p class="knowledge-panel__note">
        <el-icon :size="14"><InfoFilled /></el-icon>
        <span>{{ noteText }}</span>
      </p>

      <div class="knowledge-panel__list">
        <SourceCard
          v-for="(source, index) in store.sources"
          :key="source.id"
          :source="source"
          :index="index + 1"
          :anchor-id="`source-${source.id}`"
        />
      </div>

      <p v-if="store.heritage" class="knowledge-panel__foot">
        资料来自非遗知识库检索结果；相关度代表与该项目的匹配程度。
        <RouterLink class="knowledge-panel__link" :to="`/heritage/${store.heritage.id}`">
          查看完整资料
        </RouterLink>
      </p>
    </template>
  </section>
</template>

<style scoped lang="scss">
.knowledge-panel {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  padding: var(--sp-6);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);

  &__head {
    padding-bottom: var(--sp-4);
    border-bottom: 1px dashed var(--border-color);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    font-family: var(--font-sans);
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
  }

  &__heritage {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    margin-top: var(--sp-3);
    font-family: var(--font-serif);
    font-size: var(--fs-md);
    color: var(--text-primary);
  }

  &__count {
    flex: none;
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    background: var(--color-ai-soft);
    color: var(--color-ai);
    font-family: var(--font-sans);
    font-size: var(--fs-xs);
  }

  &__blank,
  &__skeleton {
    padding-block: var(--sp-4);
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: var(--sp-2);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius);
    background: var(--color-ai-soft);
    color: var(--color-ai);
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  &__foot {
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
    color: var(--text-tertiary);
  }

  &__link {
    color: var(--color-primary);
  }
}
</style>
