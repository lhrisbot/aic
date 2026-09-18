<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeroSection from './components/HeroSection.vue'
import HeritageMarquee from './components/HeritageMarquee.vue'
import SceneAbilitySection from './components/SceneAbilitySection.vue'
import WorkflowSection from './components/WorkflowSection.vue'
import TechFeatureSection from './components/TechFeatureSection.vue'
import SourceTrustBand from './components/SourceTrustBand.vue'
import HotHeritageSection from './components/HotHeritageSection.vue'
import PatternBackdrop from '@/components/PatternBackdrop.vue'

const router = useRouter()
</script>

<template>
  <div class="home">
    <HeroSection />
    <HeritageMarquee />
    <SceneAbilitySection />
    <WorkflowSection />
    <TechFeatureSection />
    <SourceTrustBand />
    <HotHeritageSection />

    <!-- 底部转化区：引导进入 AI 创作 -->
    <section v-reveal class="home__cta">
      <div class="home__cta-panel">
        <PatternBackdrop class="home__cta-texture" variant="crackle" />

        <div class="home__cta-inner">
          <p class="home__cta-eyebrow">开始你的第一次非遗创作</p>
          <h2 class="home__cta-title">选一个非遗项目，让 AI 帮你写出第一篇宣传文案</h2>
          <p class="home__cta-desc">
            从皮影戏、昆曲到苏绣，挑一个熟悉的项目，选择传播场景，几十秒即可得到一版可用的初稿。
          </p>

          <div class="home__cta-actions">
            <el-button type="primary" size="large" @click="router.push('/creation')">
              进入 AI 创作
            </el-button>
            <el-button size="large" class="home__cta-ghost" @click="router.push('/heritage')">
              先看看非遗资料
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.home {
  &__cta {
    padding-block: var(--sp-16) var(--sp-10);
  }

  &__cta-panel {
    position: relative;
    overflow: hidden;
    max-width: var(--container-width);
    margin: 0 auto;
    padding: var(--sp-16) var(--sp-12);
    border-radius: var(--radius-xl);
    background:
      radial-gradient(110% 90% at 10% 10%, rgba(192, 80, 60, 0.3), transparent 58%),
      radial-gradient(90% 70% at 92% 88%, rgba(63, 107, 115, 0.26), transparent 60%),
      #232220;
    color: var(--text-inverse);

    @include below($bp-md) {
      padding: var(--sp-10) var(--sp-6);
      border-radius: var(--radius-lg);
      margin-inline: var(--sp-4);
    }
  }

  &__cta-texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    --pattern-opacity: 0.07;
    filter: invert(1);
  }

  &__cta-inner {
    position: relative;
    z-index: 1;
    max-width: 620px;
  }

  &__cta-eyebrow {
    display: inline-block;
    margin-bottom: var(--sp-4);
    padding: 4px 12px;
    border: 1px solid rgba(253, 251, 247, 0.24);
    border-radius: var(--radius-pill);
    font-size: var(--fs-xs);
    color: var(--text-inverse-secondary);
  }

  &__cta-title {
    color: var(--text-inverse);
    font-size: var(--fs-2xl);
    line-height: 1.45;

    @include below($bp-md) {
      font-size: var(--fs-xl);
    }
  }

  &__cta-desc {
    margin-top: var(--sp-4);
    font-size: var(--fs-base);
    line-height: var(--lh-relaxed);
    color: var(--text-inverse-secondary);
  }

  &__cta-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-top: var(--sp-8);
  }

  &__cta-ghost {
    background: transparent;
    border-color: rgba(253, 251, 247, 0.32);
    color: var(--text-inverse);

    &:hover,
    &:focus {
      background: rgba(253, 251, 247, 0.1);
      border-color: rgba(253, 251, 247, 0.5);
      color: var(--text-inverse);
    }
  }
}
</style>
