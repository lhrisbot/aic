<script setup lang="ts">
/**
 * 统一骨架屏。
 * - card：封面 + 两行文字的卡片骨架，用于非遗 / 作品卡片墙；
 * - text：纯文字行骨架，用于详情正文；
 * - list：多行条目骨架，用于参考资料等列表。
 */
withDefaults(
  defineProps<{
    variant?: 'card' | 'text' | 'list'
    /** 重复份数（card 用于占位网格） */
    count?: number
    /** 文字行数 */
    rows?: number
  }>(),
  {
    variant: 'card',
    count: 6,
    rows: 3,
  },
)
</script>

<template>
  <div class="skeleton" :class="`skeleton--${variant}`" aria-hidden="true">
    <template v-if="variant === 'card'">
      <div v-for="index in count" :key="index" class="skeleton__card">
        <div class="skeleton__item skeleton__cover" />
        <div class="skeleton__body">
          <div class="skeleton__item skeleton__line is-title" />
          <div class="skeleton__item skeleton__line" />
          <div class="skeleton__item skeleton__line is-short" />
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'list'">
      <div v-for="index in rows" :key="index" class="skeleton__row">
        <div class="skeleton__item skeleton__line is-title" />
        <div class="skeleton__item skeleton__line" />
      </div>
    </template>

    <template v-else>
      <div v-for="index in rows" :key="index" class="skeleton__item skeleton__line" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  &--card {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--sp-6);
  }

  &--text,
  &--list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  &__card {
    overflow: hidden;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
  }

  &__cover {
    height: 148px;
    border-radius: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    padding: var(--sp-4) var(--sp-5) var(--sp-5);
  }

  &__row {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    padding: var(--sp-3) 0;
  }

  &__line {
    height: 12px;

    &.is-title {
      height: 16px;
      width: 46%;
    }

    &.is-short {
      width: 62%;
    }
  }

  &__item {
    background: linear-gradient(
      90deg,
      var(--bg-subtle) 25%,
      var(--bg-subtle-strong) 37%,
      var(--bg-subtle) 63%
    );
    background-size: 400% 100%;
    border-radius: var(--radius-sm);
    animation: skeleton-loading 1.4s ease infinite;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton__item {
    animation: none;
  }
}
</style>
