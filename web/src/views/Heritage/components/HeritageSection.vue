<script setup lang="ts">
/**
 * 详情页正文板块容器：统一的序号 + 标题 + 内容间距。
 * 序号与目录（HeritageToc）里的条目一一对应，便于评委按图索骥。
 */
defineProps<{
  id: string
  title: string
  index?: number
}>()
</script>

<template>
  <section :id="id" class="detail-section">
    <h2 class="detail-section__title">
      <span v-if="index !== undefined" class="detail-section__no">
        {{ String(index).padStart(2, '0') }}
      </span>
      <span class="detail-section__text">{{ title }}</span>
    </h2>

    <div class="detail-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.detail-section {
  padding-top: var(--sp-10);
  margin-top: var(--sp-10);
  border-top: 1px dashed var(--border-color);

  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-bottom: var(--sp-5);
    font-size: var(--fs-2xl);
  }

  &__no {
    font-family: var(--font-mono);
    font-size: var(--fs-base);
    color: var(--color-primary);
    opacity: 0.7;
  }

  &__text {
    position: relative;
    padding-left: var(--sp-4);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      border-radius: var(--radius-pill);
      background: var(--color-primary);
    }
  }

  &__body {
    font-size: var(--fs-md);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }
}
</style>
