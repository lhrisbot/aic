<script setup lang="ts">
import { MagicStick } from '@element-plus/icons-vue'
import { useVideoStore } from '@/stores/video'

const store = useVideoStore()
</script>

<template>
  <section class="video-script">
    <div class="video-script__intro">
      <span class="video-script__index">01 / 主题与脚本</span>
      <h2>先确认这支短片要讲什么</h2>
      <p>从 AI 创作带来的文案会自动出现在这里。你可以修改后再拆分镜头；留空则根据非遗资料生成初稿分镜。</p>
    </div>

    <div class="video-script__editor">
      <div class="video-script__editor-head">
        <span>宣传主题 / 已确认文案</span>
        <small>{{ store.scriptContent.trim().length }} 字</small>
      </div>
      <el-input
        v-model="store.scriptContent"
        type="textarea"
        :rows="5"
        resize="vertical"
        placeholder="例如：从一位年轻皮影艺人的一天切入，讲述雕刻、操纵与观众体验。也可以从 AI 创作页直接带入已编辑文案。"
        aria-label="宣传主题与脚本内容"
      />
      <div class="video-script__foot">
        <span>脚本内容会传给分镜生成接口；修改后请重新拆分分镜。</span>
        <el-button type="primary" :icon="MagicStick" :loading="store.scriptLoading" @click="store.ensureScript(true)">
          {{ store.storyboards.length ? '按当前脚本重新拆分' : '生成分镜脚本' }}
        </el-button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.video-script {
  display: grid;
  grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
  gap: var(--sp-8);
  padding: var(--sp-7);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: #f3ede5;

  @include below($bp-lg) {
    grid-template-columns: 1fr;
    gap: var(--sp-5);
  }

  &__index {
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1px;
  }

  h2 {
    margin-top: var(--sp-3);
    font-size: var(--fs-xl);
  }

  p {
    margin-top: var(--sp-3);
    max-width: 320px;
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
  }

  &__editor {
    padding: var(--sp-5);
    border: 1px solid rgba(104, 87, 69, 0.16);
    border-radius: var(--radius);
    background: var(--bg-card);
  }

  &__editor-head,
  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
  }

  &__editor-head {
    margin-bottom: var(--sp-3);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);

    small { color: var(--text-tertiary); font-weight: 400; }
  }

  &__foot {
    margin-top: var(--sp-3);
    flex-wrap: wrap;

    span {
      flex: 1 1 220px;
      color: var(--text-tertiary);
      font-size: var(--fs-xs);
    }

    @include below($bp-md) {
      align-items: flex-start;
      flex-direction: column;
    }
  }
}
</style>
