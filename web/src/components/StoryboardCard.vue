<script setup lang="ts">
import { Delete, EditPen, Refresh } from '@element-plus/icons-vue'
import type { Storyboard } from '@/types/video'
import { formatTimeRange } from '@/utils/format'

/**
 * 分镜卡片。
 * 展示：镜头编号、时间、画面描述、旁白、AI Video Prompt；
 * 操作：编辑、删除、重新生成（由父组件处理，卡片本身不做业务请求）。
 */
defineProps<{
  shot: Storyboard
  /** 该分镜是否正在重新生成（按钮 loading） */
  busy?: boolean
  /** 只读模式：隐藏操作按钮（作品详情页查看脚本时使用） */
  readonly?: boolean
}>()

const emit = defineEmits<{
  edit: [shot: Storyboard]
  remove: [shot: Storyboard]
  regenerate: [shot: Storyboard]
}>()
</script>

<template>
  <article class="storyboard-card">
    <header class="storyboard-card__head">
      <div class="storyboard-card__ident">
        <span class="storyboard-card__no">镜头 {{ String(shot.index).padStart(2, '0') }}</span>
        <span class="storyboard-card__time">{{ formatTimeRange(shot.start, shot.end) }}</span>
      </div>

      <div v-if="!readonly" class="storyboard-card__actions">
        <el-button size="small" :icon="EditPen" @click="emit('edit', shot)">编辑</el-button>
        <el-button
          size="small"
          :icon="Refresh"
          :loading="busy"
          @click="emit('regenerate', shot)"
        >
          重新生成
        </el-button>
        <el-button size="small" type="danger" plain :icon="Delete" @click="emit('remove', shot)">
          删除
        </el-button>
      </div>
    </header>

    <dl class="storyboard-card__fields">
      <div class="storyboard-card__field">
        <dt>画面</dt>
        <dd>{{ shot.scene }}</dd>
      </div>
      <div class="storyboard-card__field">
        <dt>旁白</dt>
        <dd>{{ shot.narration }}</dd>
      </div>
      <div class="storyboard-card__field is-prompt">
        <dt>AI Video Prompt</dt>
        <dd class="storyboard-card__prompt">{{ shot.prompt }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.storyboard-card {
  padding: var(--sp-5);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: box-shadow var(--duration) var(--ease-out),
    border-color var(--duration) var(--ease-out);

  &:hover {
    border-color: var(--border-color-strong);
    box-shadow: var(--shadow-sm);
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    padding-bottom: var(--sp-4);
    border-bottom: 1px dashed var(--border-color);

    @include below($bp-md) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-3);
    }
  }

  &__ident {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-3);
  }

  &__no {
    font-family: var(--font-serif);
    font-size: var(--fs-md);
    color: var(--text-primary);
  }

  &__time {
    padding: 2px 10px;
    border-radius: var(--radius-pill);
    background: var(--bg-subtle);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    margin-top: var(--sp-4);
  }

  &__field {
    display: grid;
    grid-template-columns: 92px minmax(0, 1fr);
    gap: var(--sp-4);

    dt {
      font-size: var(--fs-xs);
      color: var(--text-tertiary);
    }

    dd {
      font-size: var(--fs-sm);
      line-height: var(--lh-relaxed);
      color: var(--text-secondary);
    }

    @include below($bp-sm) {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--sp-1);
    }
  }

  &__prompt {
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    background: var(--bg-subtle);
    font-family: var(--font-mono);
    font-size: 11px !important;
    color: var(--color-ai) !important;
    word-break: break-all;
  }
}
</style>
