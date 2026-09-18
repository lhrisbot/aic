<script setup lang="ts">
import type { Component } from 'vue'

/**
 * 核心技术特色卡片。
 * tone 用于区分语义：primary（朱红，平台主张）/ ai（石青，AI 与可信知识）。
 */
withDefaults(
  defineProps<{
    title: string
    description: string
    icon: Component
    /** 补充要点，让能力描述更具体 */
    points?: string[]
    tone?: 'primary' | 'ai'
  }>(),
  {
    points: () => [],
    tone: 'ai',
  },
)
</script>

<template>
  <article class="feature-card" :class="`is-${tone}`">
    <span class="feature-card__icon">
      <el-icon :size="22"><component :is="icon" /></el-icon>
    </span>

    <h3 class="feature-card__title">{{ title }}</h3>
    <p class="feature-card__desc">{{ description }}</p>

    <ul v-if="points.length" class="feature-card__points">
      <li v-for="point in points" :key="point">{{ point }}</li>
    </ul>
  </article>
</template>

<style scoped lang="scss">
.feature-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--sp-8);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    margin-bottom: var(--sp-5);
    border-radius: var(--radius);
  }

  &__title {
    font-size: var(--fs-xl);
  }

  &__desc {
    margin-top: var(--sp-3);
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__points {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    margin-top: var(--sp-5);
    padding-top: var(--sp-5);
    border-top: 1px dashed var(--border-color);

    li {
      position: relative;
      padding-left: var(--sp-4);
      font-size: var(--fs-xs);
      line-height: var(--lh-relaxed);
      color: var(--text-tertiary);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
      }
    }
  }

  &.is-ai {
    .feature-card__icon {
      background: var(--color-ai-soft);
      color: var(--color-ai);
    }
  }

  &.is-primary {
    .feature-card__icon {
      background: var(--color-primary-soft);
      color: var(--color-primary);
    }
  }
}
</style>
