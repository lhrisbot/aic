<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Collection, Download, Refresh, VideoPlay, Warning } from '@element-plus/icons-vue'
import { VIDEO_STATUS_META } from '@/config/constants'
import { useVideoStore } from '@/stores/video'
import VideoPlayerPlaceholder from '@/components/VideoPlayerPlaceholder.vue'

/**
 * 视频生成任务面板：底部「根据当前分镜生成视频」+ 四种状态（等待生成 / 生成中 / 成功 / 失败）。
 * 成功后展示播放占位区与保存、重新生成、下载三项操作。
 */
const store = useVideoStore()

const statusMeta = computed(() => VIDEO_STATUS_META[store.status as keyof typeof VIDEO_STATUS_META])

function handleGenerate(): void {
  void store.createTask()
}

function handleRegenerate(): void {
  void store.regenerateTask()
}

function handleSave(): void {
  void store.saveTaskAsWork()
}

/** 演示版本没有真实视频文件：明确告知，而不是给一个点了没反应的按钮 */
function handleDownload(): void {
  ElMessage.warning('演示版本使用占位视频，接入真实视频生成服务后即可下载')
}
</script>

<template>
  <section class="video-task">
    <header class="video-task__head">
      <div class="video-task__intro">
        <h2 class="video-task__title">AI 视频生成</h2>
        <p class="video-task__desc">
          按当前 {{ store.storyboards.length }} 个分镜逐镜生成画面，再合成为 {{ store.duration }} 秒竖版短片。
        </p>
      </div>

      <div v-if="store.task" class="video-task__status">
        <el-tag :type="statusMeta?.tagType ?? 'info'" effect="light" round>
          {{ statusMeta?.label }}
        </el-tag>
        <span class="video-task__status-desc">{{ statusMeta?.description }}</span>
      </div>

      <!-- 演示开关常驻：无论是否已有任务，都能切换下一次生成的预期结果 -->
      <el-checkbox v-model="store.simulateFailure" class="video-task__simulate">
        模拟生成失败（演示用）
      </el-checkbox>
    </header>

    <!-- 1. 未开始 -->
    <div v-if="!store.task" class="video-task__idle">
      <div class="video-task__idle-actions">
        <el-button
          type="primary"
          size="large"
          :icon="VideoPlay"
          :loading="store.creating"
          :disabled="!store.canCreateTask"
          @click="handleGenerate"
        >
          根据当前分镜生成视频
        </el-button>
      </div>

      <p class="video-task__hint">
        <template v-if="!store.hasSource">请先选择非遗项目或从作品继续。</template>
        <template v-else-if="store.storyboards.length === 0">
          还没有分镜，先在上方生成或添加分镜。
        </template>
        <template v-else>
          默认按成功生成；勾选右上角开关后点击生成或「重新生成」，可演示「生成失败」形态
          （不做随机失败，保证演示可控）。
        </template>
      </p>
    </div>

    <!-- 2. 等待生成 -->
    <div v-else-if="store.status === 'pending'" class="video-task__pending">
      <span class="video-task__spinner" aria-hidden="true" />
      <div>
        <p class="video-task__state-title">等待生成</p>
        <p class="video-task__state-desc">任务已提交，正在排队等待算力资源…</p>
      </div>
      <el-button text @click="store.resetTask">取消任务</el-button>
    </div>

    <!-- 3. 生成中 -->
    <div v-else-if="store.isGenerating" class="video-task__generating">
      <div class="video-task__state-head">
        <p class="video-task__state-title">正在生成（{{ store.progress }}%）</p>
        <el-button text @click="store.resetTask">取消任务</el-button>
      </div>

      <el-progress :percentage="store.progress" :stroke-width="10" :show-text="false" />

      <ul class="video-task__steps">
        <li :class="{ 'is-done': store.progress > 5 }">解析分镜脚本与画面描述</li>
        <li :class="{ 'is-done': store.progress > 45 }">逐镜生成画面素材</li>
        <li :class="{ 'is-done': store.progress > 80 }">合成配音、字幕与转场</li>
      </ul>
    </div>

    <!-- 4. 生成成功 -->
    <div v-else-if="store.isSuccess && store.task" class="video-task__success">
      <VideoPlayerPlaceholder
        :title="store.task.title"
        :duration="store.task.duration"
      />

      <div class="video-task__result-actions">
        <el-button
          type="primary"
          :icon="Collection"
          :loading="store.saving"
          @click="handleSave"
        >
          保存作品
        </el-button>
        <el-button :icon="Refresh" @click="handleRegenerate">重新生成</el-button>
        <el-button :icon="Download" @click="handleDownload">下载视频</el-button>
      </div>

      <p v-if="store.savedWorkId" class="video-task__saved">
        视频作品已保存
        <el-button link type="primary" @click="$router.push('/works')">前往「我的作品」查看</el-button>
      </p>
    </div>

    <!-- 5. 生成失败 -->
    <div v-else-if="store.isFailed && store.task" class="video-task__failed">
      <div class="video-task__failed-head">
        <el-icon :size="18"><Warning /></el-icon>
        <div>
          <p class="video-task__state-title">生成失败</p>
          <p class="video-task__state-desc">
            {{ store.task.errorMessage || '生成过程出现异常，请重试或调整分镜后再次生成。' }}
          </p>
        </div>
      </div>

      <div class="video-task__result-actions">
        <el-button type="primary" :icon="Refresh" @click="handleRegenerate">
          重新生成
        </el-button>
        <el-button @click="store.resetTask">返回修改分镜</el-button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.video-task {
  padding: var(--sp-6);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sp-6);
    padding-bottom: var(--sp-5);
    border-bottom: 1px dashed var(--border-color);
    flex-wrap: wrap;

    @include below($bp-lg) {
      flex-direction: column;
      gap: var(--sp-3);
    }
  }

  &__intro {
    flex: 1;
    min-width: 260px;
  }

  &__title {
    font-size: var(--fs-xl);
  }

  &__desc {
    margin-top: var(--sp-2);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__status {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    flex: none;
  }

  &__status-desc {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__idle {
    padding-top: var(--sp-6);
  }

  &__idle-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-5);
    flex-wrap: wrap;
  }

  &__simulate {
    flex: none;
    margin-top: 2px;

    :deep(.el-checkbox__label) {
      font-size: var(--fs-xs);
      color: var(--text-tertiary);
    }
  }

  &__hint {
    margin-top: var(--sp-4);
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
    color: var(--text-tertiary);
  }

  &__pending,
  &__failed-head {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding-top: var(--sp-6);
  }

  &__pending {
    justify-content: flex-start;
  }

  &__state-title {
    font-family: var(--font-serif);
    font-size: var(--fs-md);
    color: var(--text-primary);
  }

  &__state-desc {
    margin-top: 2px;
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__spinner {
    width: 20px;
    height: 20px;
    flex: none;
    border-radius: 50%;
    border: 2px solid var(--color-ai-border);
    border-top-color: var(--color-ai);
    animation: video-task-spin 0.8s linear infinite;
  }

  &__generating {
    padding-top: var(--sp-6);
  }

  &__state-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sp-4);
  }

  &__steps {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-5);
    margin-top: var(--sp-5);

    li {
      position: relative;
      padding-left: var(--sp-5);
      font-size: var(--fs-xs);
      color: var(--text-tertiary);
      transition: color var(--duration) var(--ease-out);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 1px solid var(--border-color-strong);
      }

      &.is-done {
        color: var(--color-ai);

        &::before {
          border-color: var(--color-ai);
          background: var(--color-ai);
        }
      }
    }
  }

  &__success,
  &__failed {
    padding-top: var(--sp-6);
  }

  &__result-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-top: var(--sp-5);
    flex-wrap: wrap;
  }

  &__saved {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-top: var(--sp-4);
    font-size: var(--fs-sm);
    color: var(--color-success);
  }

  &__failed-head {
    padding: var(--sp-4) var(--sp-5);
    border-radius: var(--radius);
    background: var(--color-danger-soft);
    color: var(--color-danger);
  }
}

@keyframes video-task-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-task__spinner {
    animation: none;
  }
}
</style>
