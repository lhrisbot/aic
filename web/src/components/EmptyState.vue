<script setup lang="ts">
/**
 * 统一空状态：加载失败、搜索无结果、作品为空等场景共用。
 * 通过默认插槽补充操作按钮（如「重新加载」「去创作」）。
 */
withDefaults(
  defineProps<{
    title: string
    description?: string
    /** 视觉尺寸 */
    size?: 'default' | 'compact'
  }>(),
  {
    description: '',
    size: 'default',
  },
)
</script>

<template>
  <div class="empty-state" :class="`is-${size}`">
    <div class="empty-state__icon" aria-hidden="true">
      <slot name="icon">
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="26" stroke="currentColor" stroke-width="1.6" opacity="0.4" />
          <path
            d="M20 38h24M24 30h16M28 22h8"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            opacity="0.7"
          />
        </svg>
      </slot>
    </div>

    <p class="empty-state__title">{{ title }}</p>
    <p v-if="description" class="empty-state__desc">{{ description }}</p>

    <div v-if="$slots.default" class="empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  padding: var(--sp-12) var(--sp-6);
  text-align: center;

  &.is-compact {
    padding: var(--sp-8) var(--sp-4);
  }

  &__icon {
    color: var(--color-ai);
    opacity: 0.5;
  }

  &__title {
    font-family: var(--font-serif);
    font-size: var(--fs-lg);
    color: var(--text-primary);
  }

  &__desc {
    max-width: 420px;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-top: var(--sp-3);
  }
}
</style>
