<script setup lang="ts">
import { computed } from 'vue'
import { SOURCE_TYPE_LABELS } from '@/config/constants'
import type { Source } from '@/types/heritage'
import { formatPercent } from '@/utils/format'

/**
 * 参考资料卡片。
 * 同时呈现三件事：资料本身（标题 + 片段）、来源可信度（来源类型徽标）、
 * 检索相关度（进度条 + 百分比）——这是「可信知识库」在界面上的落点。
 */
const props = defineProps<{
  source: Source
  /** 序号，用于与正文引用角标对应（可选） */
  index?: number
}>()

const typeLabel = computed(() =>
  props.source.type ? SOURCE_TYPE_LABELS[props.source.type] : '参考资料',
)

const similarityText = computed(() => formatPercent(props.source.similarity))
</script>

<template>
  <article class="source-card">
    <header class="source-card__head">
      <span v-if="index" class="source-card__index">[{{ index }}]</span>
      <h4 class="source-card__title">{{ source.title }}</h4>
      <span class="source-card__type">{{ typeLabel }}</span>
    </header>

    <p class="source-card__content">{{ source.content }}</p>

    <footer class="source-card__foot">
      <span class="source-card__meta">
        {{ source.source }}<template v-if="source.year"> · {{ source.year }}</template>
      </span>

      <span class="source-card__similarity">
        <span class="source-card__similarity-label">相关度</span>
        <span class="source-card__bar">
          <i :style="{ width: similarityText }" />
        </span>
        <span class="source-card__value">{{ similarityText }}</span>
      </span>
    </footer>
  </article>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.source-card {
  padding: var(--sp-5);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--color-ai);
  border-radius: var(--radius);
  transition: box-shadow var(--duration) var(--ease-out),
    border-color var(--duration) var(--ease-out);

  &:hover {
    box-shadow: var(--shadow);
  }

  &__head {
    display: flex;
    align-items: baseline;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
  }

  &__index {
    flex: none;
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--color-primary);
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-family: var(--font-sans);
    font-size: var(--fs-base);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
  }

  &__type {
    flex: none;
    padding: 2px 8px;
    border-radius: var(--radius-xs);
    background: var(--color-ai-soft);
    color: var(--color-ai);
    font-size: var(--fs-xs);
  }

  &__content {
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    margin-top: var(--sp-4);
    padding-top: var(--sp-3);
    border-top: 1px dashed var(--border-color);

    @include below($bp-sm) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-2);
    }
  }

  &__meta {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__similarity {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    flex: none;
  }

  &__similarity-label {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__bar {
    display: block;
    width: 64px;
    height: 4px;
    border-radius: var(--radius-pill);
    background: var(--bg-subtle);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--color-ai);
    }
  }

  &__value {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--color-ai);
  }
}
</style>
