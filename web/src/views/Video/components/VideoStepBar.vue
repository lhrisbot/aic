<script setup lang="ts">
import { computed } from 'vue'

/**
 * 视频创作步骤条。
 * 四步对应：宣传文案 → 视频脚本 → 分镜设计 → AI 视频生成。
 * 当前进度由父组件根据数据状态推导（有无脚本 / 有无分镜 / 是否已提交任务）。
 */
const props = defineProps<{
  activeIndex: number
}>()

const STEPS = [
  { title: '宣传文案', desc: '确定选题与文案' },
  { title: '视频脚本', desc: '按时长与风格成稿' },
  { title: '分镜设计', desc: '逐镜编辑画面与旁白' },
  { title: 'AI 视频生成', desc: '逐镜生成并合成' },
]

const current = computed(() => Math.min(Math.max(props.activeIndex, 0), STEPS.length - 1))
</script>

<template>
  <ol class="video-step-bar" aria-label="视频创作步骤">
    <li
      v-for="(step, index) in STEPS"
      :key="step.title"
      class="video-step-bar__item"
      :class="{
        'is-done': index < current,
        'is-active': index === current,
      }"
    >
      <span class="video-step-bar__index">
        <template v-if="index < current">✓</template>
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span class="video-step-bar__text">
        <strong>{{ step.title }}</strong>
        <em>{{ step.desc }}</em>
      </span>
      <span v-if="index < STEPS.length - 1" class="video-step-bar__line" aria-hidden="true" />
    </li>
  </ol>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.video-step-bar {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-5) var(--sp-6);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);

  @include below($bp-lg) {
    flex-direction: column;
    gap: var(--sp-4);
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    flex: 1;
    min-width: 0;
  }

  &__index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex: none;
    border: 1px solid var(--border-color-strong);
    border-radius: 50%;
    background: var(--bg-card);
    color: var(--text-tertiary);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;

    strong {
      font-size: var(--fs-sm);
      font-weight: var(--fw-medium);
      color: var(--text-secondary);
    }

    em {
      font-style: normal;
      font-size: var(--fs-xs);
      color: var(--text-tertiary);
    }
  }

  &__line {
    flex: 1;
    height: 1px;
    min-width: 12px;
    background-image: linear-gradient(
      to right,
      var(--border-color-strong) 0,
      var(--border-color-strong) 6px,
      transparent 6px,
      transparent 12px
    );
    background-size: 12px 1px;
    background-repeat: repeat-x;

    @include below($bp-lg) {
      display: none;
    }
  }

  &.is-active {
    .video-step-bar__index {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: var(--text-inverse);
    }

    .video-step-bar__text strong {
      color: var(--color-primary);
    }
  }

  &.is-done {
    .video-step-bar__index {
      border-color: var(--color-ai-border);
      background: var(--color-ai-soft);
      color: var(--color-ai);
    }

    .video-step-bar__text strong {
      color: var(--text-primary);
    }
  }
}
</style>
