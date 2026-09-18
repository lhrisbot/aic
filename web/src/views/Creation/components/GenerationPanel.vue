<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MagicStick, Refresh } from '@element-plus/icons-vue'
import { GENERATING_TIPS } from '@/config/constants'
import { useCreationStore } from '@/stores/creation'
import EmptyState from '@/components/EmptyState.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import GenerationResult from '@/components/GenerationResult.vue'

/** 中栏：AI 生成结果（空状态 / 生成中 / 失败 / 结果四种形态） */
const store = useCreationStore()
const router = useRouter()

/** 生成过程中轮换「思考态」文案，强化"先检索、再生成"的过程感知 */
const tipIndex = ref(0)
let tipTimer: number | null = null

function stopTipTimer(): void {
  if (tipTimer !== null) {
    window.clearInterval(tipTimer)
    tipTimer = null
  }
}

watch(
  () => store.generating,
  (generating) => {
    stopTipTimer()
    if (!generating) {
      return
    }
    tipIndex.value = 0
    tipTimer = window.setInterval(() => {
      tipIndex.value = (tipIndex.value + 1) % GENERATING_TIPS.length
    }, 1400)
  },
  { immediate: true },
)

onBeforeUnmount(stopTipTimer)

function goVideo(): void {
  void router.push({
    path: '/video',
    query: {
      heritageId: store.form.heritageId,
      ...(store.savedWorkId ? { workId: store.savedWorkId } : {}),
    },
  })
}
</script>

<template>
  <section class="generation-panel">
    <!-- 1. 未选择项目 -->
    <div v-if="!store.form.heritageId && !store.generating" class="generation-panel__state">
      <EmptyState
        title="先选择一个非遗项目"
        description="在左侧挑选非遗项目与创作场景，AI 会先检索知识库资料，再生成场景化内容。"
      >
        <template #icon>
          <el-icon :size="40"><MagicStick /></el-icon>
        </template>
      </EmptyState>
    </div>

    <!-- 2. 生成中 -->
    <div v-else-if="store.generating" class="generation-panel__loading">
      <p class="generation-panel__tip">
        <span class="generation-panel__spinner" aria-hidden="true" />
        {{ GENERATING_TIPS[tipIndex] }}
      </p>

      <div class="generation-panel__skeleton">
        <SkeletonBlock variant="text" :rows="2" />
        <SkeletonBlock variant="text" :rows="6" />
        <SkeletonBlock variant="text" :rows="4" />
      </div>
    </div>

    <!-- 3. 生成失败 -->
    <div v-else-if="store.errorMessage" class="generation-panel__state">
      <EmptyState
        title="生成失败"
        :description="store.errorMessage"
        size="compact"
      >
        <el-button type="primary" :icon="Refresh" @click="store.generate()">
          重新生成
        </el-button>
      </EmptyState>
    </div>

    <!-- 4. 空状态（已选项目但尚未生成） -->
    <div v-else-if="!store.result" class="generation-panel__state">
      <EmptyState
        title="选择一个非遗项目和创作场景，开始你的 AI 非遗创作。"
        description="设置好左侧参数后点击「AI 开始创作」，生成结果会在这里以 Markdown 形式展示，可编辑、复制并保存为作品。"
      >
        <template #icon>
          <el-icon :size="40"><MagicStick /></el-icon>
        </template>
      </EmptyState>

      <ul class="generation-panel__features">
        <li>检索可信资料后再生成，正文标注引用来源</li>
        <li>四种场景各自的内容结构与参数</li>
        <li>结果可直接编辑并保存到「我的作品」</li>
      </ul>
    </div>

    <!-- 5. 生成结果 -->
    <GenerationResult
      v-else
      :result="store.result"
      :saving="store.saving"
      :script-loading="store.scriptLoading"
      :saved-work-id="store.savedWorkId"
      :duration-seconds="store.durationSeconds"
      @regenerate="store.regenerate()"
      @update-content="store.updateContent($event)"
      @save="store.saveWork()"
      @generate-script="store.generateScript()"
      @go-video="goVideo"
      @go-works="router.push('/works')"
    />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.generation-panel {
  min-height: 560px;
  padding: var(--sp-8);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);

  @include below($bp-md) {
    min-height: auto;
    padding: var(--sp-5);
  }

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 440px;
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--sp-4);
    margin-top: var(--sp-4);

    li {
      position: relative;
      padding-left: var(--sp-4);
      font-size: var(--fs-xs);
      color: var(--text-tertiary);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--color-ai);
        opacity: 0.6;
      }
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: var(--sp-8);
    padding-top: var(--sp-4);
  }

  &__tip {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-3);
    align-self: flex-start;
    padding: 8px 16px;
    border-radius: var(--radius-pill);
    background: var(--color-ai-soft);
    color: var(--color-ai);
    font-size: var(--fs-sm);
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid var(--color-ai-border);
    border-top-color: var(--color-ai);
    animation: generation-spin 0.8s linear infinite;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);
  }
}

@keyframes generation-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .generation-panel__spinner {
    animation: none;
  }
}
</style>
