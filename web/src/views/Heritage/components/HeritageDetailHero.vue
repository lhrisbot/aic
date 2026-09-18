<script setup lang="ts">
import HeritageCover from '@/components/HeritageCover.vue'
import type { Heritage } from '@/types/heritage'

/** 非遗详情页头图：大幅封面 + 叠加信息卡（名称、地区、类别、保护级别、标签、简介） */
defineProps<{
  heritage: Heritage
}>()
</script>

<template>
  <header class="detail-hero">
    <div class="detail-hero__band">
      <img
        v-if="heritage.cover"
        :src="heritage.cover"
        :alt="heritage.name"
        class="detail-hero__image"
      />
      <HeritageCover
        v-else
        :name="heritage.name"
        :category="heritage.category"
        :seed="heritage.id"
      />
    </div>

    <div class="u-container">
      <div class="detail-hero__card">
        <div class="detail-hero__head">
          <h1 class="detail-hero__name">{{ heritage.name }}</h1>

          <div class="detail-hero__meta">
            <span class="detail-hero__badge is-region">{{ heritage.region }}</span>
            <span class="detail-hero__badge is-category">{{ heritage.category }}</span>
            <span v-if="heritage.level" class="detail-hero__badge is-level">
              {{ heritage.level }}
            </span>
          </div>
        </div>

        <p class="detail-hero__summary">{{ heritage.summary }}</p>

        <ul class="detail-hero__tags">
          <li v-for="tag in heritage.tags" :key="tag"># {{ tag }}</li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.detail-hero {
  &__band {
    position: relative;
    height: 320px;
    overflow: hidden;
    border-bottom: 1px solid var(--border-color);

    /* 封面底部压一层渐变，让下方叠加卡片过渡更自然 */
    &::after {
      content: '';
      position: absolute;
      inset: auto 0 0 0;
      height: 120px;
      background: linear-gradient(to bottom, transparent, rgba(31, 30, 28, 0.18));
      pointer-events: none;
    }

    @include below($bp-md) {
      height: 200px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__card {
    position: relative;
    z-index: 1;
    margin-top: -76px;
    padding: var(--sp-8) var(--sp-10);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow);

    @include below($bp-md) {
      margin-top: -56px;
      padding: var(--sp-6);
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-6);

    @include below($bp-md) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-3);
    }
  }

  &__name {
    font-size: var(--fs-4xl);
    letter-spacing: 2px;

    @include below($bp-md) {
      font-size: var(--fs-3xl);
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex: none;
  }

  &__badge {
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    font-size: var(--fs-xs);

    &.is-region {
      background: var(--bg-subtle);
      color: var(--text-secondary);
    }

    &.is-category {
      background: var(--color-primary-soft);
      color: var(--color-primary);
    }

    &.is-level {
      background: var(--color-ai-soft);
      color: var(--color-ai);
    }
  }

  &__summary {
    margin-top: var(--sp-5);
    max-width: 760px;
    font-size: var(--fs-md);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
    margin-top: var(--sp-5);
    padding-top: var(--sp-5);
    border-top: 1px dashed var(--border-color);

    li {
      padding: 3px 10px;
      border-radius: var(--radius-xs);
      background: var(--bg-subtle);
      color: var(--text-secondary);
      font-size: var(--fs-xs);
    }
  }
}
</style>
