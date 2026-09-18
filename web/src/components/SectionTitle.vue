<script setup lang="ts">
/**
 * 统一小节标题：可选小标签 + 主标题 + 副标题 + 右侧动作区。
 * 首页与各列表页共用，保证字号、间距、留白一致。
 */
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** 主标题上方的小标签，用于交代该区块的定位 */
    eyebrow?: string
    align?: 'left' | 'center'
  }>(),
  {
    subtitle: '',
    eyebrow: '',
    align: 'left',
  },
)
</script>

<template>
  <div class="section-title" :class="`is-${align}`">
    <div class="section-title__main">
      <p v-if="eyebrow" class="section-title__eyebrow">{{ eyebrow }}</p>
      <h2 class="section-title__title">{{ title }}</h2>
      <p v-if="subtitle" class="section-title__subtitle">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.extra" class="section-title__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-6);
  margin-bottom: var(--sp-10);

  &.is-center {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  @include below($bp-md) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sp-4);
    margin-bottom: var(--sp-8);
  }

  &__eyebrow {
    display: inline-block;
    margin-bottom: var(--sp-3);
    padding: 3px 10px;
    border-radius: var(--radius-pill);
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-size: var(--fs-xs);
    letter-spacing: 1px;
  }

  &__title {
    font-size: var(--fs-3xl);
    letter-spacing: 1px;
  }

  &__subtitle {
    margin-top: var(--sp-3);
    max-width: 620px;
    font-size: var(--fs-md);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__extra {
    flex: none;
  }
}
</style>
