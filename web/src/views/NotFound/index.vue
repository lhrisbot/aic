<script setup lang="ts">
import { useRouter } from 'vue-router'
import PatternBackdrop from '@/components/PatternBackdrop.vue'

const router = useRouter()
</script>

<template>
  <section class="not-found">
    <PatternBackdrop class="not-found__texture" variant="fret" />

    <div class="not-found__inner">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">这一页似乎未被收录</h1>
      <p class="not-found__desc">
        你访问的页面不存在或已被移动，可以回到首页继续探索非遗，或直接进入 AI 创作。
      </p>

      <div class="not-found__actions">
        <el-button type="primary" size="large" @click="router.push('/')">返回首页</el-button>
        <el-button size="large" @click="router.back()">返回上一页</el-button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--sp-12) var(--sp-6);
  overflow: hidden;

  &__texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    --pattern-opacity: 0.05;
  }

  &__inner {
    position: relative;
    z-index: 1;
    max-width: 520px;
    text-align: center;
  }

  &__code {
    font-family: var(--font-serif);
    font-size: 96px;
    line-height: 1;
    color: var(--color-primary);
    opacity: 0.16;
  }

  &__title {
    margin-top: var(--sp-4);
    font-size: var(--fs-2xl);
  }

  &__desc {
    margin-top: var(--sp-4);
    font-size: var(--fs-base);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--sp-3);
    margin-top: var(--sp-8);
  }
}
</style>
