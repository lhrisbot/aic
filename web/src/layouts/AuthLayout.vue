<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { APP_NAME, APP_SLOGAN } from '@/config/constants'
import PatternBackdrop from '@/components/PatternBackdrop.vue'

/** 左侧文化视觉 Banner 的要点（登录 / 注册页共用） */
const HIGHLIGHTS: Array<{ title: string; desc: string }> = [
  {
    title: '可信非遗知识库',
    desc: '检索增强生成，内容有据可依，降低事实错误。',
  },
  {
    title: '场景化内容创作',
    desc: '文旅推文、短视频脚本、直播话术、文创包装一次生成。',
  },
  {
    title: '多模态一体化',
    desc: '从文化知识到文案、分镜与宣传视频的完整链路。',
  },
]
</script>

<template>
  <div class="auth-layout">
    <aside class="auth-layout__banner">
      <PatternBackdrop class="auth-layout__texture" variant="crackle" />

      <div class="auth-layout__banner-inner">
        <RouterLink to="/" class="auth-layout__brand">
          <span class="auth-layout__mark">遗</span>
          <span class="auth-layout__brand-text">{{ APP_NAME }}</span>
        </RouterLink>

        <div class="auth-layout__copy">
          <h2 class="auth-layout__slogan">{{ APP_SLOGAN }}</h2>
          <p class="auth-layout__sub">
            基于可信非遗知识库的 AI 多模态文化内容创作平台
          </p>
        </div>

        <ul class="auth-layout__list">
          <li v-for="item in HIGHLIGHTS" :key="item.title" class="auth-layout__item">
            <span class="auth-layout__dot" aria-hidden="true" />
            <div>
              <p class="auth-layout__item-title">{{ item.title }}</p>
              <p class="auth-layout__item-desc">{{ item.desc }}</p>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <section class="auth-layout__panel">
      <RouterView />
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.auth-layout {
  display: grid;
  grid-template-columns: minmax(360px, 1fr) minmax(420px, 520px);
  min-height: 100vh;
  background: var(--bg-page);

  @include below($bp-lg) {
    grid-template-columns: 1fr;
  }

  &__banner {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: var(--sp-16) var(--sp-12);
    background:
      radial-gradient(120% 90% at 12% 8%, rgba(192, 80, 60, 0.32), transparent 58%),
      radial-gradient(90% 70% at 88% 92%, rgba(63, 107, 115, 0.28), transparent 62%),
      #232220;
    color: var(--text-inverse);

    @include below($bp-lg) {
      display: none;
    }
  }

  &__texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* 深色底上提高纹样强度并反相，避免墨色纹样淹没在深底中 */
    --pattern-opacity: 0.08;
    filter: invert(1);
  }

  &__banner-inner {
    position: relative;
    z-index: 1;
    max-width: 520px;
    margin: 0 auto;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-3);
    margin-bottom: var(--sp-16);
    color: var(--text-inverse);
  }

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius);
    background: var(--color-primary);
    font-family: var(--font-serif);
    font-size: var(--fs-lg);
  }

  &__brand-text {
    font-family: var(--font-serif);
    font-size: var(--fs-xl);
    letter-spacing: 2px;
  }

  &__copy {
    margin-bottom: var(--sp-12);
  }

  &__slogan {
    margin-bottom: var(--sp-4);
    color: var(--text-inverse);
    font-size: var(--fs-3xl);
    line-height: 1.35;
  }

  &__sub {
    max-width: 420px;
    color: var(--text-inverse-secondary);
    font-size: var(--fs-md);
    line-height: var(--lh-relaxed);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: var(--sp-3);
  }

  &__dot {
    flex: none;
    width: 6px;
    height: 6px;
    margin-top: 9px;
    border-radius: 50%;
    background: var(--color-primary);
  }

  &__item-title {
    font-size: var(--fs-md);
    font-weight: var(--fw-medium);
    color: var(--text-inverse);
  }

  &__item-desc {
    margin-top: 2px;
    font-size: var(--fs-sm);
    color: var(--text-inverse-secondary);
    line-height: var(--lh-relaxed);
  }

  &__panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--sp-12) var(--sp-6);

    @include below($bp-lg) {
      padding: var(--sp-8) var(--sp-4);
    }
  }
}
</style>
