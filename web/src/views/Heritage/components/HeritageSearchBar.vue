<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { SEARCH_SUGGESTIONS } from '@/config/constants'

/**
 * 非遗探索页顶部大搜索框。
 * 支持回车搜索、点击按钮搜索、快捷示例词，以及一键清空。
 */
const props = withDefaults(
  defineProps<{
    modelValue: string
    loading?: boolean
    placeholder?: string
  }>(),
  {
    loading: false,
    placeholder: '请输入非遗名称，例如：皮影戏',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()

function handleInput(value: string): void {
  emit('update:modelValue', value)
}

function handleClear(): void {
  emit('update:modelValue', '')
  emit('search')
}

function useSuggestion(word: string): void {
  emit('update:modelValue', word)
  emit('search')
}
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__field">
      <el-icon class="search-bar__icon" :size="18"><Search /></el-icon>
      <input
        class="search-bar__input"
        type="search"
        :value="props.modelValue"
        :placeholder="placeholder"
        aria-label="搜索非遗项目"
        @input="handleInput(($event.target as HTMLInputElement).value)"
        @keyup.enter="emit('search')"
      />
      <button
        v-if="props.modelValue"
        class="search-bar__clear"
        type="button"
        aria-label="清空关键词"
        @click="handleClear"
      >
        ×
      </button>
      <el-button
        type="primary"
        class="search-bar__submit"
        :loading="loading"
        @click="emit('search')"
      >
        搜索
      </el-button>
    </div>

    <div class="search-bar__suggestions">
      <span class="search-bar__suggestions-label">试试</span>
      <button
        v-for="word in SEARCH_SUGGESTIONS"
        :key="word"
        class="search-bar__chip"
        type="button"
        @click="useSuggestion(word)"
      >
        {{ word }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.search-bar {
  &__field {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: 6px 6px 6px var(--sp-5);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-sm);
    transition: border-color var(--duration) var(--ease-out),
      box-shadow var(--duration) var(--ease-out);

    &:focus-within {
      border-color: var(--color-primary-border);
      box-shadow: var(--shadow), 0 0 0 3px var(--color-primary-soft);
    }
  }

  &__icon {
    flex: none;
    color: var(--text-tertiary);
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: 40px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text-primary);
    font-family: inherit;
    font-size: var(--fs-md);

    &::placeholder {
      color: var(--text-tertiary);
    }

    /* 去掉 type=search 的浏览器默认清除按钮，改用自定义按钮 */
    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__clear {
    flex: none;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: var(--bg-subtle);
    color: var(--text-secondary);
    font-size: var(--fs-md);
    line-height: 1;
    cursor: pointer;
    transition: background-color var(--duration) var(--ease-out);

    &:hover {
      background: var(--bg-subtle-strong);
    }
  }

  &__submit {
    flex: none;
    height: 40px;
    padding: 0 var(--sp-6);
    border-radius: var(--radius-pill);
  }

  &__suggestions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-top: var(--sp-3);
    padding-left: var(--sp-2);
  }

  &__suggestions-label {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__chip {
    padding: 3px 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-pill);
    background: transparent;
    color: var(--text-secondary);
    font-size: var(--fs-xs);
    cursor: pointer;
    transition: all var(--duration) var(--ease-out);

    &:hover {
      border-color: var(--color-primary-border);
      background: var(--color-primary-soft);
      color: var(--color-primary);
    }
  }
}
</style>
