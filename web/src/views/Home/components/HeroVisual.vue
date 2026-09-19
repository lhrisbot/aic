<script setup lang="ts">
import { Film, Reading, VideoPlay } from '@element-plus/icons-vue'
import PatternBackdrop from '@/components/PatternBackdrop.vue'

/**
 * Hero 右侧的 AI × 非遗 视觉区，使用本地生成的非遗主题示意配图。
 * 用三层卡片同时交代平台的三件事：可信知识检索 → 场景化文案生成 → 分镜与视频生成。
 */
const KNOWLEDGE_ROWS = [
  { title: '国家级非遗代表性项目名录·皮影戏', similarity: 95 },
  { title: '皮影博物馆展陈资料：影人雕刻与操纵', similarity: 89 },
  { title: '地方文化馆非遗项目介绍（关中皮影）', similarity: 83 },
]

const SHOT_ROWS = [
  { index: '01', time: '0-5 秒', text: '灯光渐亮，影人剪影出现' },
  { index: '02', time: '5-15 秒', text: '手部特写，雕刻刀锋游走' },
  { index: '03', time: '15-30 秒', text: '年轻艺人向观众演示操影' },
]
const heroPhoto = `url('${import.meta.env.BASE_URL}heritage/shadow-puppetry.jpg')`
</script>

<template>
  <div class="hero-visual" aria-hidden="true">
    <div class="hero-visual__stage" :style="{ '--hero-photo': heroPhoto }">
      <PatternBackdrop class="hero-visual__texture" variant="crackle" />
      <span class="hero-visual__glow is-primary" />
      <span class="hero-visual__glow is-ai" />

      <!-- 主卡：AI 生成结果预览 -->
      <article class="hero-visual__main">
        <header class="hero-visual__head">
          <span class="hero-visual__tag is-ai">
            <el-icon :size="13"><Reading /></el-icon>
            知识库生成示意
          </span>
          <span class="hero-visual__dot-group">
            <i /><i /><i />
          </span>
        </header>

        <h3 class="hero-visual__title">一灯一幕一双手：皮影戏的当代表达</h3>

        <div class="hero-visual__lines">
          <span class="hero-visual__line" style="width: 100%" />
          <span class="hero-visual__line" style="width: 92%" />
          <span class="hero-visual__line is-accent" style="width: 68%" />
          <span class="hero-visual__line" style="width: 86%" />
        </div>

        <footer class="hero-visual__foot">
          <span class="hero-visual__foot-text">示例引用 3 条资料</span>
          <span class="hero-visual__chips">
            <i>名录</i><i>展陈</i><i>地方志</i>
          </span>
        </footer>
      </article>

      <!-- 浮层卡一：知识库检索 -->
      <article class="hero-visual__float is-knowledge">
        <p class="hero-visual__float-title">
          <el-icon :size="13"><Reading /></el-icon>
          知识库检索示意
        </p>
        <ul class="hero-visual__sources">
          <li v-for="row in KNOWLEDGE_ROWS" :key="row.title">
            <span class="hero-visual__source-name">{{ row.title }}</span>
            <span class="hero-visual__source-bar">
              <i :style="{ width: `${row.similarity}%` }" />
            </span>
            <span class="hero-visual__source-value">{{ row.similarity }}%</span>
          </li>
        </ul>
      </article>

      <!-- 浮层卡二：分镜脚本 -->
      <article class="hero-visual__float is-storyboard">
        <p class="hero-visual__float-title">
          <el-icon :size="13"><Film /></el-icon>
          分镜脚本 · 30 秒
        </p>
        <ul class="hero-visual__shots">
          <li v-for="row in SHOT_ROWS" :key="row.index">
            <span class="hero-visual__shot-index">{{ row.index }}</span>
            <span class="hero-visual__shot-time">{{ row.time }}</span>
            <span class="hero-visual__shot-text">{{ row.text }}</span>
          </li>
        </ul>
        <p class="hero-visual__video">
          <el-icon :size="14"><VideoPlay /></el-icon>
          视频合成流程示意
          <span class="hero-visual__progress"><i /></span>
        </p>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.hero-visual {
  position: relative;
  width: 100%;

  &__stage {
    position: relative;
    min-height: 520px;
    padding: var(--sp-8);
    border-radius: var(--radius-xl);
    background:
      linear-gradient(140deg, rgba(22, 29, 28, 0.76) 0%, rgba(22, 29, 28, 0.18) 52%, rgba(22, 29, 28, 0.64) 100%),
      var(--hero-photo) center / cover no-repeat,
      #252624;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 24px 70px rgba(35, 34, 32, 0.2);

    @include below($bp-md) {
      min-height: auto;
      padding: var(--sp-5);
    }
  }

  &__texture {
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    overflow: hidden;
    pointer-events: none;
    --pattern-opacity: 0.05;
  }

  &__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(46px);
    pointer-events: none;

    &.is-primary {
      width: 180px;
      height: 180px;
      left: -40px;
      bottom: -30px;
      background: var(--color-primary-soft-strong);
    }

    &.is-ai {
      width: 200px;
      height: 200px;
      right: -40px;
      top: -40px;
      background: var(--color-ai-soft);
    }
  }

  /* ---------- 主卡 ---------- */
  &__main {
    position: relative;
    z-index: 2;
    max-width: 300px;
    margin-left: auto;
    padding: var(--sp-5);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);

    @include below($bp-md) {
      max-width: none;
      margin-left: 0;
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sp-4);
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    padding: 3px 9px;
    border-radius: var(--radius-pill);
    font-size: var(--fs-xs);

    &.is-ai {
      background: var(--color-ai-soft);
      color: var(--color-ai);
    }
  }

  &__dot-group {
    display: inline-flex;
    gap: 4px;

    i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--border-color-strong);
    }
  }

  &__title {
    margin-bottom: var(--sp-4);
    font-size: var(--fs-md);
    line-height: 1.5;
  }

  &__lines {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  &__line {
    display: block;
    height: 9px;
    border-radius: var(--radius-pill);
    background: var(--bg-subtle);

    &.is-accent {
      background: var(--color-primary-soft-strong);
    }
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    margin-top: var(--sp-5);
    padding-top: var(--sp-4);
    border-top: 1px dashed var(--border-color);
  }

  &__foot-text {
    font-size: var(--fs-xs);
    color: var(--color-ai);
  }

  &__chips {
    display: inline-flex;
    gap: 4px;

    i {
      padding: 1px 6px;
      border-radius: var(--radius-xs);
      background: var(--bg-subtle);
      color: var(--text-tertiary);
      font-size: 11px;
      font-style: normal;
    }
  }

  /* ---------- 浮层卡 ---------- */
  &__float {
    position: absolute;
    z-index: 3;
    padding: var(--sp-4);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    box-shadow: var(--shadow);

    &.is-knowledge {
      left: -16px;
      top: 44px;
      width: 228px;
      animation: hero-float 7s var(--ease-out) infinite alternate;
    }

    &.is-storyboard {
      left: -16px;
      bottom: -20px;
      width: 280px;
      animation: hero-float 8.5s var(--ease-out) infinite alternate-reverse;
    }

    @include below($bp-xl) {
      position: static;
      width: 100%;
      margin-top: var(--sp-4);
      animation: none;
    }
  }

  &__float-title {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
    font-size: var(--fs-xs);
    color: var(--text-secondary);
  }

  &__sources {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);

    li {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 44px 30px;
      align-items: center;
      gap: var(--sp-2);
    }
  }

  &__source-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: var(--fs-xs);
    color: var(--text-primary);
  }

  &__source-bar {
    height: 4px;
    border-radius: var(--radius-pill);
    background: var(--bg-subtle);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--color-ai);
    }
  }

  &__source-value {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-ai);
    text-align: right;
  }

  &__shots {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);

    li {
      display: grid;
      grid-template-columns: 22px 52px minmax(0, 1fr);
      align-items: center;
      gap: var(--sp-2);
      font-size: 11px;
    }
  }

  &__shot-index {
    font-family: var(--font-mono);
    color: var(--color-primary);
  }

  &__shot-time {
    color: var(--text-tertiary);
  }

  &__shot-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--text-secondary);
  }

  &__video {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-top: var(--sp-4);
    padding-top: var(--sp-3);
    border-top: 1px dashed var(--border-color);
    font-size: 11px;
    color: var(--color-ai);
  }

  &__progress {
    flex: 1;
    height: 4px;
    border-radius: var(--radius-pill);
    background: var(--bg-subtle);
    overflow: hidden;

    i {
      display: block;
      width: 62%;
      height: 100%;
      border-radius: var(--radius-pill);
      background: linear-gradient(90deg, var(--color-ai), var(--color-primary));
    }
  }
}

@keyframes hero-float {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-visual__float {
    animation: none;
  }
}
</style>
