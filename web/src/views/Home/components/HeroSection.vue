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

const WORKFLOW: Array<{ index: string; title: string; detail: string }> = [
  { index: '01', title: '检索知识', detail: '可信来源' },
  { index: '02', title: '生成内容', detail: '场景适配' },
  { index: '03', title: '拆解分镜', detail: '逐镜可改' },
  { index: '04', title: '生成视频', detail: '任务可追踪' },
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
          从<span class="hero__highlight">非遗资料</span>，<br />到可发布的文化内容
        </h1>

        <p class="hero__subtitle">给文旅与文化传播人员的一站式 AI 创作工作台</p>

        <p class="hero__desc">
          选一个非遗项目，参考资料会跟着创作结果一起出现。编辑推文或短视频文案，再拆成分镜并提交视频生成任务。
        </p>

        <div class="hero__actions">
          <el-button type="primary" size="large" @click="router.push('/creation?heritageId=shadow-puppetry&scene=video')">
            用皮影戏体验创作
          </el-button>
          <el-button size="large" @click="router.push('/heritage')">探索非遗</el-button>
        </div>

        <dl class="hero__facts">
          <div v-for="fact in FACTS" :key="fact.label" class="hero__fact">
            <dt class="hero__fact-value">{{ fact.value }}</dt>
            <dd class="hero__fact-label">{{ fact.label }}</dd>
          </div>
        </dl>

        <div class="hero__workflow" aria-label="从非遗资料到视频的创作流程">
          <div class="hero__workflow-head">
            <span>ONE WORKFLOW</span>
            <em>从资料到成片</em>
          </div>
          <div class="hero__workflow-track">
            <template v-for="(stage, index) in WORKFLOW" :key="stage.index">
              <div class="hero__workflow-step">
                <span class="hero__workflow-index">{{ stage.index }}</span>
                <strong>{{ stage.title }}</strong>
                <small>{{ stage.detail }}</small>
              </div>
              <i v-if="index < WORKFLOW.length - 1" class="hero__workflow-arrow">→</i>
            </template>
          </div>
        </div>
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

  &__workflow {
    margin-top: var(--sp-8);
    padding: var(--sp-4) var(--sp-5);
    border-radius: var(--radius-lg);
    background: #242522;
    color: var(--text-inverse);
    box-shadow: 0 18px 44px rgba(35, 34, 32, 0.12);
  }

  &__workflow-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sp-4);
    color: rgba(253, 251, 247, 0.64);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.2px;

    em {
      color: rgba(253, 251, 247, 0.44);
      font-family: var(--font-sans);
      font-style: normal;
      letter-spacing: 0;
    }
  }

  &__workflow-track {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }

  &__workflow-step {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 8px;
    min-width: 0;
    flex: 1;

    strong {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: var(--font-serif);
      font-size: 13px;
      font-weight: var(--fw-medium);
    }

    small {
      grid-column: 2;
      margin-top: 2px;
      color: rgba(253, 251, 247, 0.46);
      font-size: 10px;
    }
  }

  &__workflow-index {
    grid-row: span 2;
    color: #e2a080;
    font-family: var(--font-mono);
    font-size: 11px;
  }

  &__workflow-arrow {
    flex: none;
    color: rgba(253, 251, 247, 0.34);
    font-style: normal;
  }

  @include below($bp-md) {
    &__workflow-track {
      align-items: stretch;
      flex-direction: column;
      gap: var(--sp-3);
    }

    &__workflow-step {
      padding-bottom: var(--sp-3);
      border-bottom: 1px solid rgba(253, 251, 247, 0.1);
    }

    &__workflow-step:last-of-type {
      padding-bottom: 0;
      border-bottom: 0;
    }

    &__workflow-arrow {
      display: none;
    }
  }
}
</style>
