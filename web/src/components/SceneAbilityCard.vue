<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import type { SceneMeta } from '@/config/constants'

/** 首页「场景能力」卡片：图标 + 标题 + 一句描述 + Hover 动效 */
defineProps<{
  scene: SceneMeta
  /** 序号，用于展示 01 / 02 … */
  index: number
}>()
</script>

<template>
  <RouterLink
    class="scene-card"
    :to="{ path: '/creation', query: { scene: scene.type } }"
  >
    <div class="scene-card__top">
      <span class="scene-card__icon">
        <el-icon :size="22"><component :is="scene.icon" /></el-icon>
      </span>
      <span class="scene-card__index">{{ String(index + 1).padStart(2, '0') }}</span>
    </div>

    <h3 class="scene-card__title">{{ scene.label }}</h3>
    <p class="scene-card__desc">{{ scene.desc }}</p>

    <span class="scene-card__action">
      用它创作
      <el-icon :size="14"><ArrowRight /></el-icon>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.scene-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--sp-6);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out), border-color var(--duration) var(--ease-out);

  /* 悬停时从卡片下方浮起一层极淡的朱红渐变 */
  &::after {
    content: '';
    position: absolute;
    inset: auto -30% -60% -30%;
    height: 140px;
    background: radial-gradient(closest-side, var(--color-primary-soft), transparent);
    opacity: 0;
    transition: opacity var(--duration-slow) var(--ease-out);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-color-strong);
    box-shadow: var(--shadow-lg);

    &::after {
      opacity: 1;
    }

    .scene-card__icon {
      background: var(--color-primary);
      color: var(--text-inverse);
    }

    .scene-card__action {
      color: var(--color-primary);
      gap: var(--sp-2);
    }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sp-6);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius);
    background: var(--color-primary-soft);
    color: var(--color-primary);
    transition: background-color var(--duration) var(--ease-out),
      color var(--duration) var(--ease-out);
  }

  &__index {
    font-family: var(--font-serif);
    font-size: var(--fs-xl);
    color: var(--text-tertiary);
    opacity: 0.5;
  }

  &__title {
    margin-bottom: var(--sp-3);
    font-size: var(--fs-xl);
  }

  &__desc {
    flex: 1;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__action {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    margin-top: var(--sp-6);
    font-size: var(--fs-sm);
    color: var(--text-tertiary);
    transition: color var(--duration) var(--ease-out), gap var(--duration) var(--ease-out);
  }
}
</style>
