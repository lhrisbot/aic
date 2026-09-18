<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import type { SceneMeta } from '@/config/constants'

/**
 * 首页「场景能力」卡片。
 * 顶部是一幅 48×48 的**微型动态插画**（纯 CSS 动画，无素材依赖）：
 * 推文＝逐行浮现的文字与光标，短视频＝滚动胶片与脉冲播放键，
 * 直播＝扩散声波与闪烁提示点，文创＝旋转的礼盒纹样。
 */
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

    <!-- 微型动态插画 -->
    <svg class="scene-card__art" viewBox="0 0 120 40" aria-hidden="true">
      <template v-if="scene.type === 'article'">
        <line class="art-line is-1" x1="8" y1="12" x2="84" y2="12" />
        <line class="art-line is-2" x1="8" y1="20" x2="96" y2="20" />
        <line class="art-line is-3" x1="8" y1="28" x2="64" y2="28" />
        <rect class="art-caret" x="68" y="24" width="2" height="8" />
      </template>

      <template v-else-if="scene.type === 'video'">
        <g class="art-film">
          <rect x="4" y="12" width="14" height="16" rx="2" />
          <rect x="22" y="12" width="14" height="16" rx="2" />
          <rect x="40" y="12" width="14" height="16" rx="2" />
          <rect x="58" y="12" width="14" height="16" rx="2" />
          <rect x="76" y="12" width="14" height="16" rx="2" />
          <rect x="94" y="12" width="14" height="16" rx="2" />
        </g>
        <path class="art-play" d="M104 6l10 6-10 6z" />
      </template>

      <template v-else-if="scene.type === 'live'">
        <rect x="10" y="14" width="8" height="14" rx="4" />
        <path d="M14 28v5M9 33h10" />
        <circle class="art-wave is-1" cx="34" cy="20" r="6" />
        <circle class="art-wave is-2" cx="34" cy="20" r="11" />
        <circle class="art-wave is-3" cx="34" cy="20" r="16" />
        <circle class="art-rec" cx="96" cy="12" r="4" />
        <line x1="70" y1="20" x2="86" y2="20" />
      </template>

      <template v-else>
        <g class="art-box">
          <rect x="46" y="12" width="28" height="20" rx="3" />
          <path d="M60 12v20M46 20h28" />
        </g>
        <path class="art-ribbon" d="M60 12c-6-8-16-4-12 2 3 5 12 0 12 0s9 5 12 0c4-6-6-10-12-2z" />
      </template>
    </svg>

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

  /* ---------- 微型动态插画 ---------- */
  &__art {
    width: 100%;
    height: 40px;
    margin-bottom: var(--sp-4);
    overflow: visible;

    line,
    rect,
    circle,
    path {
      fill: none;
      stroke: var(--color-primary);
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.55;
      transition: opacity var(--duration) var(--ease-out);
    }

    .art-play,
    .art-rec,
    .art-ribbon {
      fill: var(--color-primary);
      stroke: none;
    }
  }

  &:hover &__art {
    line,
    rect,
    circle,
    path {
      opacity: 0.95;
    }
  }

  /* 推文：三行文字依次浮现 + 光标闪烁 */
  .art-line {
    stroke-dasharray: 90;
    animation: scene-line 3.6s ease-in-out infinite;

    &.is-2 {
      animation-delay: 0.35s;
    }

    &.is-3 {
      animation-delay: 0.7s;
    }
  }

  .art-caret {
    fill: var(--color-primary);
    stroke: none;
    animation: scene-caret 1s steps(2, end) infinite;
  }

  /* 短视频：胶片横向滚动 + 播放键脉冲 */
  .art-film {
    animation: scene-film 5s linear infinite;
  }

  .art-play {
    animation: scene-pulse 1.8s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }

  /* 直播：声波扩散 + 提示点闪烁 */
  .art-wave {
    animation: scene-wave 2.6s ease-out infinite;

    &.is-2 {
      animation-delay: 0.5s;
    }

    &.is-3 {
      animation-delay: 1s;
    }
  }

  .art-rec {
    animation: scene-rec 1.4s ease-in-out infinite;
  }

  /* 文创：礼盒轻微浮动 + 丝带呼吸 */
  .art-box {
    animation: scene-bob 3.2s ease-in-out infinite;
  }

  .art-ribbon {
    animation: scene-pulse 2.4s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
}

@keyframes scene-line {
  0% {
    stroke-dashoffset: 90;
    opacity: 0.2;
  }

  40%,
  75% {
    stroke-dashoffset: 0;
    opacity: 0.9;
  }

  100% {
    stroke-dashoffset: 90;
    opacity: 0.2;
  }
}

@keyframes scene-caret {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

@keyframes scene-film {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-22px);
  }
}

@keyframes scene-pulse {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.6;
  }

  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

@keyframes scene-wave {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }

  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes scene-rec {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 1;
  }
}

@keyframes scene-bob {
  0%,
  100% {
    transform: translateY(-1.5px);
  }

  50% {
    transform: translateY(1.5px);
  }
}

/* 系统开启"减少动态效果"时停掉插画动画 */
@media (prefers-reduced-motion: reduce) {
  .scene-card__art {
    line,
    rect,
    circle,
    path,
    g {
      animation: none !important;
    }
  }
}
</style>
