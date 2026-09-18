<script setup lang="ts">
import { HERITAGE_CATEGORIES, HERITAGE_REGIONS } from '@/config/constants'
import { ALL, type AllOption } from '@/types/common'
import type { HeritageCategory, HeritageRegion } from '@/types/heritage'

/**
 * 分类与地区筛选条。
 * 采用胶囊标签而非下拉框：一屏可见全部筛选维度，演示时无需展开交互。
 */
const props = defineProps<{
  category: HeritageCategory | AllOption
  region: HeritageRegion | AllOption
}>()

const emit = defineEmits<{
  'update:category': [value: HeritageCategory | AllOption]
  'update:region': [value: HeritageRegion | AllOption]
}>()

const categories: Array<HeritageCategory | AllOption> = [ALL, ...HERITAGE_CATEGORIES]
const regions: Array<HeritageRegion | AllOption> = [ALL, ...HERITAGE_REGIONS]

function selectCategory(value: HeritageCategory | AllOption): void {
  if (value !== props.category) {
    emit('update:category', value)
  }
}

function selectRegion(value: HeritageRegion | AllOption): void {
  if (value !== props.region) {
    emit('update:region', value)
  }
}
</script>

<template>
  <div class="filter-bar">
    <div class="filter-bar__row">
      <span class="filter-bar__label">分类</span>
      <div class="filter-bar__options">
        <button
          v-for="item in categories"
          :key="item"
          class="filter-bar__chip"
          :class="{ 'is-active': category === item }"
          type="button"
          @click="selectCategory(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>

    <div class="filter-bar__row">
      <span class="filter-bar__label">地区</span>
      <div class="filter-bar__options">
        <button
          v-for="item in regions"
          :key="item"
          class="filter-bar__chip"
          :class="{ 'is-active': region === item }"
          type="button"
          @click="selectRegion(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.filter-bar {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);

  &__row {
    display: flex;
    align-items: flex-start;
    gap: var(--sp-4);

    @include below($bp-md) {
      flex-direction: column;
      gap: var(--sp-2);
    }
  }

  &__label {
    flex: none;
    width: 36px;
    padding-top: 4px;
    font-size: var(--fs-sm);
    color: var(--text-tertiary);
  }

  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }

  &__chip {
    padding: 5px 14px;
    border: 1px solid transparent;
    border-radius: var(--radius-pill);
    background: transparent;
    color: var(--text-secondary);
    font-family: inherit;
    font-size: var(--fs-sm);
    cursor: pointer;
    transition: all var(--duration) var(--ease-out);

    &:hover {
      background: var(--bg-subtle);
      color: var(--text-primary);
    }

    &.is-active {
      background: var(--color-primary-soft);
      border-color: var(--color-primary-border);
      color: var(--color-primary);
      font-weight: var(--fw-medium);
    }
  }
}
</style>
