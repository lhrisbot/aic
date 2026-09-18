<script setup lang="ts">
import { computed } from 'vue'
import type { WorkflowStep } from '@/types/ui'

/** 产品工作流可视化：寻找非遗 → 选择场景 → AI 智能创作 → 人工优化 → 视频生成 */
const props = defineProps<{
  steps: WorkflowStep[]
}>()

const lastIndex = computed(() => props.steps.length - 1)
</script>

<template>
  <ol class="workflow">
    <li v-for="(step, index) in steps" :key="step.title" class="workflow__item">
      <div class="workflow__head">
        <span class="workflow__index">{{ String(index + 1).padStart(2, '0') }}</span>
        <span v-if="index !== lastIndex" class="workflow__line" aria-hidden="true" />
      </div>
      <h3 class="workflow__title">{{ step.title }}</h3>
      <p class="workflow__desc">{{ step.desc }}</p>
    </li>
  </ol>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.workflow {
  display: flex;
  gap: var(--sp-4);

  @include below($bp-md) {
    flex-direction: column;
    gap: var(--sp-6);
  }

  &__item {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  &__head {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: var(--sp-4);
  }

  &__index {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: none;
    border: 1px solid var(--color-primary-border);
    border-radius: 50%;
    background: var(--bg-card);
    color: var(--color-primary);
    font-family: var(--font-serif);
    font-size: var(--fs-sm);
  }

  /* 步骤之间的虚线：桌面端横向延伸，移动端改为纵向 */
  &__line {
    flex: 1;
    height: 1px;
    margin-left: var(--sp-3);
    background-image: linear-gradient(
      to right,
      var(--border-color-strong) 0,
      var(--border-color-strong) 6px,
      transparent 6px,
      transparent 12px
    );
    background-size: 12px 1px;
    background-repeat: repeat-x;
    opacity: 0.9;
  }

  &__title {
    margin-bottom: var(--sp-2);
    font-size: var(--fs-md);
  }

  &__desc {
    max-width: 220px;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  @include below($bp-md) {
    /* 移动端改为「左侧序号 + 右侧文字」的纵向流程，竖虚线由 ::after 绘制 */
    &__item {
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr);
      column-gap: var(--sp-3);
      row-gap: var(--sp-1);
      grid-template-areas:
        'head title'
        'head desc';
      align-items: start;
    }

    &__item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 17px;
      top: 40px;
      bottom: calc(-1 * var(--sp-6));
      width: 1px;
      background-image: linear-gradient(
        to bottom,
        var(--border-color-strong) 0,
        var(--border-color-strong) 6px,
        transparent 6px,
        transparent 12px
      );
      background-size: 1px 12px;
      background-repeat: repeat-y;
    }

    &__head {
      grid-area: head;
      margin-bottom: 0;
    }

    &__line {
      display: none;
    }

    &__title {
      grid-area: title;
      align-self: center;
      margin-bottom: 0;
    }

    &__desc {
      grid-area: desc;
      max-width: none;
      padding-left: 0;
    }
  }
}
</style>
