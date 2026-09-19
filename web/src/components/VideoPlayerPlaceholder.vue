<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'
import { formatDuration } from '@/utils/format'

/**
 * 视频播放占位区（视频创作页与作品详情页共用）。
 * 演示版本没有真实视频文件：点击给出明确提示，而不是无响应的假播放器。
 */
const props = withDefaults(
  defineProps<{
    title: string
    /** 时长（秒） */
    duration: number
    /** 真实视频地址；接入后端后自动切换为原生播放器 */
    videoUrl?: string
    cover?: string
    note?: string
  }>(),
  {
    note: '视频占位区 · 演示版本不提供真实视频文件',
  },
)

const hasPlayableVideo = computed(() => /^https?:\/\//.test(props.videoUrl ?? ''))

function handlePlay(): void {
  ElMessage.info('演示版本为占位播放区，接入真实视频后此处可直接播放')
}
</script>

<template>
  <div
    class="video-player"
    :class="{ 'has-video': hasPlayableVideo }"
    :role="hasPlayableVideo ? undefined : 'button'"
    :tabindex="hasPlayableVideo ? undefined : 0"
    @click="!hasPlayableVideo && handlePlay()"
    @keyup.enter="!hasPlayableVideo && handlePlay()"
  >
    <video
      v-if="hasPlayableVideo"
      class="video-player__media"
      :src="props.videoUrl"
      :poster="props.cover"
      controls
      preload="metadata"
      @click.stop
    />
    <span class="video-player__play">
      <el-icon :size="30"><VideoPlay /></el-icon>
    </span>
    <span class="video-player__title">{{ props.title }}</span>
    <span class="video-player__duration">{{ formatDuration(props.duration) }}</span>
    <span class="video-player__note">{{ props.note }}</span>
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

  &__media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #232220;
  }

  &.has-video {
    cursor: default;

    .video-player__play,
    .video-player__note {
      display: none;
    }
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
