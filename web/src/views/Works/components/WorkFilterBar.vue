<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { WORK_SORT_OPTIONS, WORK_TYPE_LABELS } from '@/config/constants'
import { ALL, type AllOption } from '@/types/common'
import type { WorkSort, WorkType } from '@/types/work'

/**
 * 作品筛选条：类型胶囊 + 关键词搜索 + 时间排序。
 * 输入态与"已生效"的关键词解耦，回车或点击搜索后才向上派发。
 */
const props = defineProps<{
  keyword: string
  type: WorkType | AllOption
  sort: WorkSort
}>()

const emit = defineEmits<{
  search: [keyword: string]
  'update:type': [value: WorkType | AllOption]
  'update:sort': [value: WorkSort]
}>()

/** 类型选项：全部 + 四种文案场景 + 视频作品 */
const typeOptions = computed<Array<{ label: string; value: WorkType | AllOption }>>(() => [
  { label: ALL, value: ALL },
  ...(Object.keys(WORK_TYPE_LABELS) as WorkType[]).map((type) => ({
    label: WORK_TYPE_LABELS[type],
    value: type,
  })),
])

const keywordInput = ref(props.keyword)
watch(
  () => props.keyword,
  (value) => {
    keywordInput.value = value
  },
)

function handleSelectType(value: WorkType | AllOption): void {
  if (value !== props.type) {
    emit('update:type', value)
  }
}
</script>

<template>
  <section class="work-filter">
    <div class="work-filter__row">
      <span class="work-filter__label">类型</span>
      <div class="work-filter__options">
        <button
          v-for="option in typeOptions"
          :key="option.value"
          class="work-filter__chip"
          :class="{ 'is-active': type === option.value }"
          type="button"
          @click="handleSelectType(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="work-filter__row is-controls">
      <el-input
        v-model="keywordInput"
        class="work-filter__search"
        placeholder="搜索作品标题、摘要或非遗名称"
        clearable
        :prefix-icon="Search"
        @keyup.enter="emit('search', keywordInput)"
        @clear="emit('search', '')"
      >
        <template #append>
          <el-button :icon="Search" @click="emit('search', keywordInput)">搜索</el-button>
        </template>
      </el-input>

      <el-select
        :model-value="sort"
        class="work-filter__sort"
        @update:model-value="emit('update:sort', $event)"
      >
        <el-option
          v-for="option in WORK_SORT_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.work-filter {
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

    &.is-controls {
      align-items: center;
      padding-top: var(--sp-4);
      border-top: 1px dashed var(--border-color);

      @include below($bp-sm) {
        flex-direction: column;
        align-items: stretch;
      }
    }

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

    @include below($bp-md) {
      padding-top: 0;
    }
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

  &__search {
    flex: 1;
    min-width: 0;
  }

  &__sort {
    flex: none;
    width: 160px;

    @include below($bp-sm) {
      width: 100%;
    }
  }
}
</style>
