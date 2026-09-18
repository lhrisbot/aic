<script setup lang="ts">
import { SCENE_META } from '@/config/constants'
import type { SceneType } from '@/types/ai'

/**
 * 创作场景选择器。
 * 用图标 + 文字的胶囊网格替代下拉框：四个场景一屏可见，切换成本更低。
 * 具体参数字段由 config/sceneSchema.ts 决定，本组件只负责选择场景。
 */
withDefaults(
  defineProps<{
    modelValue: SceneType
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: SceneType]
}>()
</script>

<template>
  <div class="scene-selector" role="radiogroup" aria-label="创作场景">
    <button
      v-for="scene in SCENE_META"
      :key="scene.type"
      class="scene-selector__item"
      :class="{ 'is-active': modelValue === scene.type }"
      type="button"
      role="radio"
      :aria-checked="modelValue === scene.type"
      :disabled="disabled"
      @click="emit('update:modelValue', scene.type)"
    >
      <el-icon :size="15"><component :is="scene.icon" /></el-icon>
      <span>{{ scene.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.scene-selector {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-2);

  &__item {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: 9px 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-family: inherit;
    font-size: var(--fs-sm);
    cursor: pointer;
    transition: all var(--duration) var(--ease-out);

    &:hover:not(:disabled) {
      border-color: var(--border-color-strong);
      color: var(--text-primary);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &.is-active {
      border-color: var(--color-primary-border);
      background: var(--color-primary-soft);
      color: var(--color-primary);
      font-weight: var(--fw-medium);
    }
  }
}
</style>
