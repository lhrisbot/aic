<script setup lang="ts">
import { computed, useId } from 'vue'
import type { HeritageCategory } from '@/types/heritage'
import { hashString } from '@/utils/hash'

/**
 * 程序化生成的非遗封面。
 *
 * 设计取舍：为了比赛演示时完全离线可用、且避免使用未授权的摄影作品，
 * 封面不使用外网图片，而是按「类别配色 + 稳定纹样 + 项目首字」实时绘制 SVG。
 * 数据层 `Heritage.cover` 仍保留图片地址字段：一旦填入真实图片，
 * 调用方改为渲染 <img> 即可，本组件无需改动。
 */
const props = withDefaults(
  defineProps<{
    name: string
    category: HeritageCategory
    /** 稳定种子（一般传 id），决定配色与纹样的选择，保证同一项目每次渲染一致 */
    seed?: string
  }>(),
  { seed: '' },
)

interface Palette {
  from: string
  to: string
  ink: string
}

/** 六类非遗各自的低饱和国风配色 */
const CATEGORY_PALETTES: Record<HeritageCategory, Palette> = {
  传统戏剧: { from: '#8C4A3F', to: '#C1795A', ink: '#FDF3EE' },
  传统美术: { from: '#4E6B5C', to: '#8FA98C', ink: '#F0F6F1' },
  传统技艺: { from: '#3F6B73', to: '#7FA3A0', ink: '#EEF6F6' },
  传统音乐: { from: '#4A4E7A', to: '#8B8FBE', ink: '#F1F1FA' },
  传统舞蹈: { from: '#8A5A2B', to: '#C79A5C', ink: '#FCF4E7' },
  民俗: { from: '#6B4A67', to: '#A4809E', ink: '#F9F0F7' },
}

const MOTIFS = ['fret', 'crackle', 'cloud', 'rings'] as const
type Motif = (typeof MOTIFS)[number]

/** 每个 SVG 需要独立的渐变 id，避免同页多个封面互相覆盖 */
const gradientId = useId()

const seed = computed(() => props.seed || props.name)
const palette = computed<Palette>(
  () => CATEGORY_PALETTES[props.category] ?? CATEGORY_PALETTES['传统技艺'],
)
const motif = computed<Motif>(() => {
  const index = hashString(seed.value) % MOTIFS.length
  return MOTIFS[index] as Motif
})
const initial = computed(() => props.name.slice(0, 1))
const sealText = computed(() => props.category.slice(-1))
</script>

<template>
  <svg
    class="heritage-cover"
    viewBox="0 0 320 200"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    :aria-label="`${name}（${category}）封面`"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" :stop-color="palette.from" />
        <stop offset="100%" :stop-color="palette.to" />
      </linearGradient>
    </defs>

    <rect width="320" height="200" :fill="`url(#${gradientId})`" />

    <!-- 纹样层：回纹 -->
    <g v-if="motif === 'fret'" :stroke="palette.ink" stroke-width="1.4" fill="none" opacity="0.2">
      <path d="M24 176V116h36v36H42v24" />
      <path d="M92 176V96h48v48h-24v32" />
      <path d="M180 176v-60h36v36h-18v24" />
      <path d="M248 176v-80h48v48h-24v32" />
      <path d="M0 40h40V20h40v40H60v20H20V60H0z" />
      <path d="M240 24h56v36h-28V42h-28z" />
    </g>

    <!-- 纹样层：冰裂纹 -->
    <g
      v-else-if="motif === 'crackle'"
      :stroke="palette.ink"
      stroke-width="1.1"
      fill="none"
      opacity="0.22"
    >
      <path d="M0 46l58 18 42-32 48 22 52-16 60 20 60-14" />
      <path d="M0 128l44-26 52 32 54-18 56 22 54-16 60 18" />
      <path d="M58 64l12 64M100 32l6 74M148 54l-4 70M204 64l-2 66M258 68l-6 62M44 102l-8 54M160 124l10 52" />
    </g>

    <!-- 纹样层：云纹 -->
    <g
      v-else-if="motif === 'cloud'"
      :stroke="palette.ink"
      stroke-width="1.3"
      fill="none"
      opacity="0.22"
    >
      <path d="M-10 58c14-26 44-26 58 0M48 58c14-26 44-26 58 0M106 58c14-26 44-26 58 0M164 58c14-26 44-26 58 0M222 58c14-26 44-26 58 0M280 58c14-26 44-26 58 0" />
      <path d="M-10 128c14-26 44-26 58 0M48 128c14-26 44-26 58 0M106 128c14-26 44-26 58 0M164 128c14-26 44-26 58 0M222 128c14-26 44-26 58 0M280 128c14-26 44-26 58 0" />
      <path d="M20 176c16-22 48-22 64 0M128 176c16-22 48-22 64 0M236 176c16-22 48-22 64 0" />
    </g>

    <!-- 纹样层：团花同心圆 -->
    <g v-else :stroke="palette.ink" stroke-width="1.1" fill="none" opacity="0.2">
      <circle cx="60" cy="152" r="22" />
      <circle cx="60" cy="152" r="40" />
      <circle cx="60" cy="152" r="58" />
      <circle cx="60" cy="152" r="76" />
      <circle cx="252" cy="52" r="18" />
      <circle cx="252" cy="52" r="34" />
      <circle cx="252" cy="52" r="50" />
      <path d="M252 2v100M202 52h100M216 16l72 72M288 16l-72 72" />
    </g>

    <!-- 项目首字：宋体大字，作为封面的视觉重心 -->
    <text
      class="heritage-cover__char"
      x="238"
      y="126"
      text-anchor="middle"
      :fill="palette.ink"
      font-size="78"
      opacity="0.92"
    >
      {{ initial }}
    </text>

    <!-- 类别朱红印章 -->
    <g class="heritage-cover__seal">
      <rect x="268" y="22" width="26" height="26" rx="5" fill="var(--color-primary)" />
      <text
        x="281"
        y="40"
        text-anchor="middle"
        fill="#FDFBF7"
        font-size="14"
      >
        {{ sealText }}
      </text>
    </g>
  </svg>
</template>

<style scoped lang="scss">
.heritage-cover {
  display: block;
  width: 100%;
  height: 100%;

  &__char {
    font-family: var(--font-serif);
    font-weight: var(--fw-semibold);
    letter-spacing: 2px;
  }

  &__seal text {
    font-family: var(--font-serif);
  }
}
</style>
