<script setup lang="ts">
import { RouterLink } from 'vue-router'
import HeritageCover from '@/components/HeritageCover.vue'
import type { Heritage } from '@/types/heritage'

/** 非遗卡片：封面、名称、地区、类别、一句简介、标签 */
defineProps<{
  heritage: Heritage
}>()
</script>

<template>
  <RouterLink :to="`/heritage/${heritage.id}`" class="heritage-card">
    <div class="heritage-card__cover">
      <img
        v-if="heritage.cover"
        :src="heritage.cover"
        :alt="heritage.name"
        loading="lazy"
        class="heritage-card__image"
      />
      <HeritageCover
        v-else
        :name="heritage.name"
        :category="heritage.category"
        :seed="heritage.id"
      />
      <span v-if="heritage.level" class="heritage-card__level">{{ heritage.level }}</span>
    </div>

    <div class="heritage-card__body">
      <div class="heritage-card__head">
        <h3 class="heritage-card__name">{{ heritage.name }}</h3>
        <p class="heritage-card__meta">
          <span>{{ heritage.region }}</span>
          <i class="heritage-card__dot" aria-hidden="true" />
          <span>{{ heritage.category }}</span>
        </p>
      </div>

      <p class="heritage-card__summary">{{ heritage.summary }}</p>

      <ul class="heritage-card__tags">
        <li v-for="tag in heritage.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
      </ul>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.heritage-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out), border-color var(--duration) var(--ease-out);

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-color-strong);
    box-shadow: var(--shadow-lg);

    .heritage-card__cover > :not(.heritage-card__level) {
      transform: scale(1.04);
    }

    .heritage-card__name {
      color: var(--color-primary);
    }
  }

  &__cover {
    position: relative;
    height: 152px;
    overflow: hidden;

    > :not(.heritage-card__level) {
      transition: transform var(--duration-slow) var(--ease-out);
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__level {
    position: absolute;
    left: var(--sp-3);
    top: var(--sp-3);
    padding: 2px 8px;
    border-radius: var(--radius-xs);
    background: rgba(31, 30, 28, 0.55);
    color: var(--text-inverse);
    font-size: var(--fs-xs);
    backdrop-filter: blur(4px);
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--sp-3);
    padding: var(--sp-5);
  }

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sp-3);
  }

  &__name {
    font-size: var(--fs-lg);
    transition: color var(--duration) var(--ease-out);
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    flex: none;
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--border-color-strong);
  }

  &__summary {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
    margin-top: auto;

    li {
      padding: 2px 8px;
      border-radius: var(--radius-xs);
      background: var(--bg-subtle);
      color: var(--text-secondary);
      font-size: var(--fs-xs);
    }
  }
}
</style>
