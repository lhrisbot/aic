<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeroVisual from './HeroVisual.vue'
import PatternBackdrop from '@/components/PatternBackdrop.vue'

const router = useRouter()

/** Hero 下方的三个事实性数字，全部与当前实现一致（不夸大） */
const FACTS: Array<{ value: string; label: string }> = [
  { value: '12 项', label: '非遗资料示例' },
  { value: '4 类', label: '创作场景' },
  { value: '4 步', label: '视频生成流程' },
]
</script>

<template>
  <section class="hero">
    <PatternBackdrop class="hero__texture" variant="cloud" />

    <div class="hero__inner u-container">
      <div class="hero__content">
        <p class="hero__eyebrow">
          <span class="hero__eyebrow-dot" aria-hidden="true" />
          可信非遗知识库 · AI 多模态创作
        </p>

        <h1 class="hero__title">
          让<span class="hero__highlight">千年非遗</span>，<br />被今天的人看见
        </h1>

        <p class="hero__subtitle">基于可信非遗知识库的 AI 多模态文化内容创作平台</p>

        <p class="hero__desc">
          帮助文旅工作者快速完成非遗资料查询、场景化内容创作、视频脚本与宣传视频生成。
        </p>

        <div class="hero__actions">
          <el-button type="primary" size="large" @click="router.push('/creation')">
            开始创作
          </el-button>
          <el-button size="large" @click="router.push('/heritage')">探索非遗</el-button>
        </div>

        <dl class="hero__facts">
          <div v-for="fact in FACTS" :key="fact.label" class="hero__fact">
            <dt class="hero__fact-value">{{ fact.value }}</dt>
            <dd class="hero__fact-label">{{ fact.label }}</dd>
          </div>
        </dl>
      </div>

      <div class="hero__visual">
        <HeroVisual />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.hero {
  position: relative;
  overflow: hidden;
  padding-block: var(--sp-16) var(--sp-24);

  @include below($bp-md) {
    padding-block: var(--sp-10) var(--sp-12);
  }

  &__texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    --pattern-opacity: 0.05;
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    align-items: center;
    gap: var(--sp-12);

    @include below($bp-xl) {
      grid-template-columns: 1fr;
      gap: var(--sp-12);
    }
  }

  &__content {
    max-width: 560px;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: 5px 14px;
    border: 1px solid var(--color-ai-border);
    border-radius: var(--radius-pill);
    background: var(--color-ai-soft);
    color: var(--color-ai);
    font-size: var(--fs-xs);
    letter-spacing: 0.5px;
  }

  &__eyebrow-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-ai);
  }

  &__title {
    margin-top: var(--sp-6);
    font-size: var(--fs-4xl);
    line-height: 1.28;
    letter-spacing: 2px;

    @include below($bp-md) {
      font-size: var(--fs-3xl);
    }
  }

  &__highlight {
    position: relative;
    color: var(--color-primary);

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 2px;
      height: 8px;
      border-radius: var(--radius-pill);
      background: var(--color-primary-soft-strong);
      z-index: -1;
    }
  }

  &__subtitle {
    margin-top: var(--sp-5);
    font-family: var(--font-serif);
    font-size: var(--fs-lg);
    line-height: var(--lh-base);
    color: var(--text-primary);
  }

  &__desc {
    margin-top: var(--sp-3);
    max-width: 480px;
    font-size: var(--fs-base);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-top: var(--sp-8);
  }

  &__facts {
    display: flex;
    gap: var(--sp-10);
    margin-top: var(--sp-10);
    padding-top: var(--sp-6);
    border-top: 1px solid var(--border-color);
  }

  &__fact-value {
    font-family: var(--font-serif);
    font-size: var(--fs-2xl);
    color: var(--color-primary);
  }

  &__fact-label {
    margin-top: 2px;
    margin-left: 0;
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__visual {
    @include below($bp-xl) {
      max-width: 640px;
    }
  }
}
</style>
