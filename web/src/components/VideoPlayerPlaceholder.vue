<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'
import { formatDuration } from '@/utils/format'

/**
 * 视频播放占位区（视频创作页与作品详情页共用）。
 * 演示版本没有真实视频文件：点击给出明确提示，而不是无响应的假播放器。
 */
withDefaults(
  defineProps<{
    title: string
    /** 时长（秒） */
    duration: number
    note?: string
  }>(),
  {
    note: '视频占位区 · 演示版本不提供真实视频文件',
  },
)

function handlePlay(): void {
  ElMessage.info('演示版本为占位播放区，接入真实视频后此处可直接播放')
}
</script>

<template>
  <div
    class="video-player"
    role="button"
    tabindex="0"
    @click="handlePlay"
    @keyup.enter="handlePlay"
  >
    <span class="video-player__play">
      <el-icon :size="30"><VideoPlay /></el-icon>
    </span>
    <span class="video-player__title">{{ title }}</span>
    <span class="video-player__duration">{{ formatDuration(duration) }}</span>
    <span class="video-player__note">{{ note }}</span>
  </div>
</template>

<style scoped lang="scss">
.video-player {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  max-height: 420px;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(80% 80% at 20% 20%, rgba(192, 80, 60, 0.32), transparent 60%),
    radial-gradient(80% 80% at 85% 85%, rgba(63, 107, 115, 0.3), transparent 62%),
    #232220;
  cursor: pointer;
  overflow: hidden;

  &:hover .video-player__play {
    transform: scale(1.06);
  }

  &__play {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 1px solid rgba(253, 251, 247, 0.4);
    background: rgba(253, 251, 247, 0.12);
    color: var(--text-inverse);
    transition: transform var(--duration) var(--ease-out);
  }

  &__title {
    position: absolute;
    left: var(--sp-6);
    bottom: var(--sp-8);
    max-width: 70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: var(--font-serif);
    font-size: var(--fs-md);
    color: var(--text-inverse);
  }

  &__duration {
    position: absolute;
    right: var(--sp-6);
    top: var(--sp-5);
    padding: 2px 10px;
    border-radius: var(--radius-pill);
    background: rgba(31, 30, 28, 0.5);
    color: var(--text-inverse);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
  }

  &__note {
    position: absolute;
    left: var(--sp-6);
    bottom: var(--sp-4);
    font-size: var(--fs-xs);
    color: rgba(253, 251, 247, 0.6);
  }
}
</style>
