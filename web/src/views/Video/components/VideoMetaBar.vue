<script setup lang="ts">
import { computed } from 'vue'
import { useVideoStore } from '@/stores/video'

/** 目标平台 / 视频风格 / 时长选项（与创作页短视频场景保持一致） */
const PLATFORMS = ['抖音', '视频号', 'B站']
const STYLES = ['国潮', '纪录片', '年轻化', '故事感']
const DURATIONS = [15, 30, 60]

/**
 * 视频信息条：视频标题、时长、目标平台、视频风格（提示词要求展示这四项），
 * 并允许在生成前调整——调整时长或风格后脚本可能需要重新拆分，条内直接给出入口。
 */
const store = useVideoStore()

const shotCount = computed(() => store.storyboards.length)
const totalSeconds = computed(() => store.duration)

</script>

<template>
  <section class="video-meta">
    <div class="video-meta__row">
      <div class="video-meta__field is-title">
        <label class="video-meta__label">视频标题</label>
        <el-input v-model="store.title" placeholder="给这支短片起个标题" />
      </div>

      <div class="video-meta__field">
        <label class="video-meta__label">视频时长</label>
        <el-select v-model="store.duration">
          <el-option v-for="item in DURATIONS" :key="item" :label="`${item} 秒`" :value="item" />
        </el-select>
      </div>

      <div class="video-meta__field">
        <label class="video-meta__label">目标平台</label>
        <el-select v-model="store.platform">
          <el-option v-for="item in PLATFORMS" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <div class="video-meta__field">
        <label class="video-meta__label">视频风格</label>
        <el-select v-model="store.style">
          <el-option v-for="item in STYLES" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
    </div>

    <div class="video-meta__foot">
      <span class="video-meta__stat">
        共 <strong>{{ shotCount }}</strong> 个分镜 · 总计 {{ totalSeconds }} 秒
      </span>

      <div class="video-meta__actions">
        <span v-if="store.timelineError" class="video-meta__error">
          {{ store.timelineError }}
        </span>
        <span v-else class="video-meta__hint">修改时长或风格后，请在下方按当前脚本重新拆分分镜</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.video-meta {
  padding: var(--sp-5) var(--sp-6);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);

  &__row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
    gap: var(--sp-4);

    @include below($bp-lg) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include below($bp-sm) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    min-width: 0;
  }

  &__label {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    margin-top: var(--sp-5);
    padding-top: var(--sp-4);
    border-top: 1px dashed var(--border-color);

    @include below($bp-md) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-3);
    }
  }

  &__stat {
    font-size: var(--fs-sm);
    color: var(--text-secondary);

    strong {
      font-family: var(--font-serif);
      font-size: var(--fs-md);
      color: var(--color-primary);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  &__hint {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__error {
    font-size: var(--fs-xs);
    color: var(--color-danger);
  }
}
</style>
