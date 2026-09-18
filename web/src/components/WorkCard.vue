<script setup lang="ts">
import { computed } from 'vue'
import { Delete, Document, EditPen, Film, VideoPlay, View } from '@element-plus/icons-vue'
import HeritageCover from '@/components/HeritageCover.vue'
import { WORK_TYPE_LABELS } from '@/config/constants'
import type { Work } from '@/types/work'
import { formatDuration, formatRelativeTime } from '@/utils/format'

/**
 * 作品卡片。
 * 两种形态：
 * - 文章型（文章 / 脚本 / 话术 / 包装文案）：非遗名称、类型、标题、摘要、创建时间 + 查看/编辑/删除；
 * - 视频型：封面 + 播放按钮 + 非遗名称 + 时长 + 风格 + 播放/查看脚本/删除。
 * 组件只负责展示与派发事件，跳转与请求由页面处理。
 */
const props = defineProps<{
  work: Work
}>()

const emit = defineEmits<{
  view: [work: Work]
  edit: [work: Work]
  play: [work: Work]
  script: [work: Work]
  remove: [work: Work]
}>()

const isVideo = computed(() => props.work.type === 'videoWork')
const typeLabel = computed(() => WORK_TYPE_LABELS[props.work.type])
const shotCount = computed(() => props.work.storyboards?.length ?? 0)
</script>

<template>
  <!-- 文章型 -->
  <article v-if="!isVideo" class="work-card is-article">
    <header class="work-card__head">
      <span class="work-card__type">
        <el-icon :size="13"><Document /></el-icon>
        {{ typeLabel }}
      </span>
      <span class="work-card__time">{{ formatRelativeTime(work.createdAt) }}</span>
    </header>

    <h3 class="work-card__title" role="link" tabindex="0" @click="emit('view', work)" @keyup.enter="emit('view', work)">
      {{ work.title }}
    </h3>

    <p class="work-card__heritage">非遗项目：{{ work.heritageName }}</p>
    <p class="work-card__summary">{{ work.summary }}</p>

    <footer class="work-card__foot">
      <div class="work-card__actions">
        <el-button size="small" :icon="View" @click="emit('view', work)">查看</el-button>
        <el-button size="small" :icon="EditPen" @click="emit('edit', work)">编辑</el-button>
        <el-button size="small" type="danger" plain :icon="Delete" @click="emit('remove', work)">
          删除
        </el-button>
      </div>
    </footer>
  </article>

  <!-- 视频型 -->
  <article v-else class="work-card is-video">
    <div class="work-card__cover" role="button" tabindex="0" @click="emit('play', work)" @keyup.enter="emit('play', work)">
      <HeritageCover
        :name="work.heritageName"
        :category="work.heritageCategory ?? '传统技艺'"
        :seed="work.id"
      />
      <span class="work-card__play">
        <el-icon :size="22"><VideoPlay /></el-icon>
      </span>
      <span class="work-card__duration">{{ formatDuration(work.duration ?? 0) }}</span>
    </div>

    <div class="work-card__body">
      <header class="work-card__head">
        <span class="work-card__type is-video">
          <el-icon :size="13"><Film /></el-icon>
          {{ typeLabel }}
        </span>
        <span class="work-card__time">{{ formatRelativeTime(work.createdAt) }}</span>
      </header>

      <h3 class="work-card__title" role="link" tabindex="0" @click="emit('view', work)" @keyup.enter="emit('view', work)">
        {{ work.title }}
      </h3>

      <p class="work-card__meta">
        <span>{{ work.heritageName }}</span>
        <i class="work-card__dot" aria-hidden="true" />
        <span>{{ work.style || '国潮' }}</span>
        <i class="work-card__dot" aria-hidden="true" />
        <span>{{ shotCount }} 个分镜</span>
      </p>

      <p class="work-card__summary">{{ work.summary }}</p>

      <footer class="work-card__foot">
        <div class="work-card__actions">
          <el-button size="small" type="primary" plain :icon="VideoPlay" @click="emit('play', work)">
            播放
          </el-button>
          <el-button size="small" :icon="Document" @click="emit('script', work)">
            查看脚本
          </el-button>
          <el-button size="small" type="danger" plain :icon="Delete" @click="emit('remove', work)">
            删除
          </el-button>
        </div>
      </footer>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.work-card {
  display: flex;
  height: 100%;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out), border-color var(--duration) var(--ease-out);

  &:hover {
    transform: translateY(-3px);
    border-color: var(--border-color-strong);
    box-shadow: var(--shadow);

    .work-card__title {
      color: var(--color-primary);
    }
  }

  &.is-article {
    flex-direction: column;
    padding: var(--sp-6);
  }

  &.is-video {
    flex-direction: column;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
  }

  &__type {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    padding: 3px 9px;
    border-radius: var(--radius-xs);
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-size: var(--fs-xs);

    &.is-video {
      background: var(--color-ai-soft);
      color: var(--color-ai);
    }
  }

  &__time {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__title {
    margin-top: var(--sp-4);
    font-size: var(--fs-lg);
    line-height: 1.45;
    cursor: pointer;
    transition: color var(--duration) var(--ease-out);
  }

  &__heritage {
    margin-top: var(--sp-2);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
    margin-top: var(--sp-2);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--border-color-strong);
  }

  &__summary {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-top: var(--sp-3);
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__cover {
    position: relative;
    height: 156px;
    overflow: hidden;
    cursor: pointer;

    > :first-child {
      transition: transform var(--duration-slow) var(--ease-out);
    }

    &:hover > :first-child {
      transform: scale(1.04);
    }
  }

  &__play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1px solid rgba(253, 251, 247, 0.5);
    background: rgba(31, 30, 28, 0.42);
    color: var(--text-inverse);
    backdrop-filter: blur(4px);
    transition: background-color var(--duration) var(--ease-out);
  }

  &__duration {
    position: absolute;
    right: var(--sp-3);
    bottom: var(--sp-3);
    padding: 2px 8px;
    border-radius: var(--radius-xs);
    background: rgba(31, 30, 28, 0.55);
    color: var(--text-inverse);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: var(--sp-5);
  }

  &__foot {
    margin-top: auto;
    padding-top: var(--sp-5);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
  }
}
</style>
