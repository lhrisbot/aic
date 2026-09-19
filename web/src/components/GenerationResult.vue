<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Check, Collection, EditPen, Reading, Refresh, VideoPlay } from '@element-plus/icons-vue'
import type { CreationResult } from '@/types/ai'
import { formatRelativeTime, formatTimeRange } from '@/utils/format'
import CopyButton from '@/components/CopyButton.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

/**
 * 生成结果展示（纯展示组件）。
 * 负责：顶部「基于 N 条资料」提示、标题与正文（Markdown）、编辑模式、
 * 操作区（重新生成 / 编辑 / 复制 / 保存作品）以及短视频场景的附加动作。
 */
const props = withDefaults(
  defineProps<{
    result: CreationResult
    saving?: boolean
    scriptLoading?: boolean
    savedWorkId?: string
    durationSeconds?: number
  }>(),
  {
    saving: false,
    scriptLoading: false,
    savedWorkId: '',
    durationSeconds: 30,
  },
)

const emit = defineEmits<{
  regenerate: []
  'update-content': [content: string]
  save: []
  'generate-script': []
  'go-video': []
  'go-works': []
}>()

const editing = ref(false)
const draft = ref('')
const savedTipVisible = ref(false)

/** 结果变化（重新生成）时退出编辑态，避免把旧草稿写回新结果 */
watch(
  () => props.result.id,
  () => {
    editing.value = false
    draft.value = ''
  },
)

function startEdit(): void {
  draft.value = props.result.content
  editing.value = true
}

function saveEdit(): void {
  emit('update-content', draft.value)
  editing.value = false
  savedTipVisible.value = true
  window.setTimeout(() => {
    savedTipVisible.value = false
  }, 2400)
}

function cancelEdit(): void {
  editing.value = false
  draft.value = ''
}

const wordCount = computed(() => props.result.content.replace(/\s/g, '').length)
const storyboards = computed(() => props.result.videoScript?.shots ?? [])
</script>

<template>
  <article class="generation-result">
    <header class="generation-result__head">
      <p class="generation-result__notice">
        <el-icon :size="15"><Reading /></el-icon>
        <span>
          AI 已基于 <strong>{{ result.sources.length }}</strong> 条非遗资料完成创作
        </span>
        <span class="generation-result__time">{{ formatRelativeTime(result.createdAt) }}</span>
      </p>

      <div class="generation-result__toolbar">
        <el-button :icon="Refresh" @click="emit('regenerate')">重新生成</el-button>
        <el-button v-if="!editing" :icon="EditPen" @click="startEdit">编辑</el-button>
        <el-button v-else :icon="Check" type="primary" plain @click="saveEdit">保存修改</el-button>
        <CopyButton :text="result.content" />
        <el-button
          type="primary"
          :icon="Collection"
          :loading="saving"
          @click="emit('save')"
        >
          保存作品
        </el-button>
      </div>
    </header>

    <h2 class="generation-result__title">{{ result.title }}</h2>

    <div class="generation-result__meta">
      <span>{{ wordCount }} 字</span>
      <i class="generation-result__dot" aria-hidden="true" />
      <span>引用 {{ result.sources.length }} 条资料</span>
      <template v-if="result.scene === 'video'">
        <i class="generation-result__dot" aria-hidden="true" />
        <span>{{ durationSeconds }} 秒脚本</span>
      </template>
    </div>

    <p v-if="savedTipVisible" class="generation-result__saved-tip">修改已保存</p>

    <section v-if="editing" class="generation-result__editor">
      <el-input
        v-model="draft"
        type="textarea"
        :rows="18"
        resize="vertical"
        placeholder="支持 Markdown 语法"
      />
      <div class="generation-result__editor-actions">
        <el-button type="primary" @click="saveEdit">保存修改</el-button>
        <el-button @click="cancelEdit">取消</el-button>
        <span class="generation-result__editor-hint">支持 Markdown 语法，保存后立即生效</span>
      </div>
    </section>

    <MarkdownRenderer v-else class="generation-result__body" :content="result.content" :sources="result.sources" />

    <!-- 短视频场景：生成视频脚本 / 进入视频创作 -->
    <section v-if="result.scene === 'video'" class="generation-result__video">
      <div class="generation-result__video-head">
        <div>
          <h3 class="generation-result__video-title">视频脚本与分镜</h3>
          <p class="generation-result__video-desc">
            由文案进一步拆解为分镜，逐镜生成画面后可合成宣传视频。
          </p>
        </div>

        <div class="generation-result__video-actions">
          <el-button
            :icon="VideoPlay"
            :loading="scriptLoading"
            @click="emit('generate-script')"
          >
            {{ storyboards.length ? '重新生成脚本' : '生成视频脚本' }}
          </el-button>
          <el-button
            type="primary"
            plain
            :disabled="!storyboards.length"
            @click="emit('go-video')"
          >
            进入视频创作
          </el-button>
        </div>
      </div>

      <ol v-if="storyboards.length" class="generation-result__shots">
        <li v-for="shot in storyboards" :key="shot.id" class="generation-result__shot">
          <span class="generation-result__shot-no">
            {{ String(shot.index).padStart(2, '0') }}
          </span>
          <span class="generation-result__shot-time">
            {{ formatTimeRange(shot.start, shot.end) }}
          </span>
          <span class="generation-result__shot-text">{{ shot.scene }}</span>
        </li>
      </ol>

      <p v-else class="generation-result__video-empty">
        还没有分镜脚本，点击「生成视频脚本」按当前时长与风格拆分镜头。
      </p>
    </section>

    <footer v-if="savedWorkId" class="generation-result__saved">
      <span>作品已保存</span>
      <el-button link type="primary" @click="emit('go-works')">前往「我的作品」查看</el-button>
    </footer>
  </article>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.generation-result {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    padding-bottom: var(--sp-5);
    border-bottom: 1px solid var(--border-color);

    @include below($bp-xl) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__notice {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: 6px 12px;
    border-radius: var(--radius-pill);
    background: var(--color-ai-soft);
    color: var(--color-ai);
    font-size: var(--fs-sm);

    strong {
      font-family: var(--font-serif);
      font-size: var(--fs-md);
    }
  }

  &__time {
    color: var(--text-tertiary);
    font-size: var(--fs-xs);
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;

    @include below($bp-md) {
      width: 100%;
    }
  }

  &__title {
    margin-top: var(--sp-6);
    font-size: var(--fs-2xl);
    line-height: 1.4;

    @include below($bp-md) {
      font-size: var(--fs-xl);
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-top: var(--sp-3);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--border-color-strong);
  }

  &__saved-tip {
    margin-top: var(--sp-4);
    padding: var(--sp-2) var(--sp-4);
    border-radius: var(--radius-sm);
    background: var(--color-success-soft);
    color: var(--color-success);
    font-size: var(--fs-xs);
  }

  &__body {
    margin-top: var(--sp-6);
  }

  &__editor {
    margin-top: var(--sp-6);

    :deep(.el-textarea__inner) {
      font-family: var(--font-mono);
      font-size: var(--fs-sm);
      line-height: var(--lh-relaxed);
      padding: var(--sp-5);
    }
  }

  &__editor-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-top: var(--sp-4);
  }

  &__editor-hint {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__video {
    margin-top: var(--sp-10);
    padding: var(--sp-6);
    border: 1px dashed var(--border-color-strong);
    border-radius: var(--radius-lg);
    background: var(--bg-subtle);
  }

  &__video-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sp-6);

    @include below($bp-lg) {
      flex-direction: column;
      gap: var(--sp-4);
    }
  }

  &__video-title {
    font-size: var(--fs-lg);
  }

  &__video-desc {
    margin-top: var(--sp-2);
    max-width: 460px;
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__video-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex: none;
  }

  &__shots {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    margin-top: var(--sp-6);
  }

  &__shot {
    display: grid;
    grid-template-columns: 28px 88px minmax(0, 1fr);
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3) var(--sp-4);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: var(--fs-sm);
  }

  &__shot-no {
    font-family: var(--font-mono);
    color: var(--color-primary);
  }

  &__shot-time {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__shot-text {
    color: var(--text-secondary);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__video-empty {
    margin-top: var(--sp-5);
    font-size: var(--fs-sm);
    color: var(--text-tertiary);
  }

  &__saved {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-top: var(--sp-8);
    padding-top: var(--sp-5);
    border-top: 1px dashed var(--border-color);
    font-size: var(--fs-sm);
    color: var(--color-success);
  }
}
</style>
