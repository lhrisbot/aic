<script setup lang="ts">
/**
 * 可信资料来源带。
 * 首页中段的"内容补白"：把 AI 生成所依据的资料类型摆出来，
 * 让"可信知识库"这个卖点从抽象口号变成看得见的来源清单。
 */
const SOURCES: Array<{ label: string; kind: string }> = [
  { label: '国家级非遗代表性项目名录', kind: '名录' },
  { label: '中国非物质文化遗产网', kind: '官方' },
  { label: '博物馆展陈资料', kind: '博物馆' },
  { label: '联合国教科文组织名录', kind: '国际' },
  { label: '地方文化馆项目介绍', kind: '地方志' },
]

const FLOW: string[] = ['检索资料', '生成内容', '标注来源', '人工定稿']
</script>

<template>
  <section class="trust">
    <div class="trust__inner u-container">
      <div class="trust__head">
        <h2 class="trust__title">每一次生成，都能说清依据</h2>
        <p class="trust__desc">
          内容不是凭空写出来的：先检索知识库资料，再生成文案，并在结果里标注每条资料的来源与相关度。
        </p>
      </div>

      <ul class="trust__sources">
        <li v-for="(source, index) in SOURCES" :key="source.label" v-reveal="index * 70" class="trust__source">
          <span class="trust__kind">{{ source.kind }}</span>
          <span class="trust__label">{{ source.label }}</span>
        </li>
      </ul>

      <ol class="trust__flow">
        <li v-for="(step, index) in FLOW" :key="step" v-reveal="index * 90" class="trust__step">
          <span class="trust__step-no">{{ String(index + 1).padStart(2, '0') }}</span>
          {{ step }}
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.trust {
  padding-block: var(--sp-16);
  background: var(--bg-subtle);

  &__inner {
    display: flex;
    flex-direction: column;
    gap: var(--sp-8);
  }

  &__head {
    max-width: 620px;
  }

  &__title {
    font-size: var(--fs-2xl);
  }

  &__desc {
    margin-top: var(--sp-3);
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__sources {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
  }

  &__source {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: var(--sp-3) var(--sp-4);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    transition: transform var(--duration) var(--ease-out),
      border-color var(--duration) var(--ease-out);

    &:hover {
      transform: translateY(-2px);
      border-color: var(--color-ai-border);
    }
  }

  &__kind {
    padding: 1px 6px;
    border-radius: var(--radius-xs);
    background: var(--color-ai-soft);
    color: var(--color-ai);
    font-size: 11px;
  }

  &__label {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__flow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--sp-3) var(--sp-6);
    padding-top: var(--sp-6);
    border-top: 1px dashed var(--border-color-strong);
  }

  &__step {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--fs-sm);
    color: var(--text-primary);
  }

  &__step-no {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--color-primary);
  }

  @include below($bp-md) {
    padding-block: var(--sp-12);
  }
}
</style>
