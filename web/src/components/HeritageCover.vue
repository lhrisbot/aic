<script setup lang="ts">
import { computed, useId } from 'vue'
import type { HeritageCategory } from '@/types/heritage'
import { hashString } from '@/utils/hash'

/**
 * 非遗封面（动态插画）。
 *
 * 设计说明：
 * - 不再用"一个大字"当画面，而是按非遗类别绘制一幅**会动的场景插画**：
 *   传统戏剧＝幕布与影人，传统美术＝绣绷与落花，传统技艺＝窑火与器物，
 *   传统音乐＝琴弦与声波，传统舞蹈＝鼓面与醒狮，民俗＝灯笼与人群；
 * - 全部用 SVG + CSS 动画实现（只动 transform / opacity）：不依赖任何素材文件，
 *   离线可用、体积极小、可无限缩放，也没有图片授权问题；
 * - 同一类别内用 id 哈希挑「配色 + 构图变体 + 动画相位」，避免卡片墙千篇一律；
 * - 遵守 prefers-reduced-motion：系统开启"减少动态效果"时动画全部停止，只留静态插画。
 *
 * 若将来要换成真实摄影图或视频动图，只需给 Heritage.cover 填入地址，
 * 调用方（HeritageCard / WorkCard / HeritageDetailHero）会自动改用 <img>/<video>，本组件无需改动。
 */
const props = withDefaults(
  defineProps<{
    name: string
    category: HeritageCategory
    /** 稳定种子（一般传 id），决定配色、构图与动画相位 */
    seed?: string
  }>(),
  { seed: '' },
)

interface Palette {
  from: string
  to: string
  ink: string
  glow: string
  seal: string
}

/** 六类非遗各自的低饱和国风配色 */
const PALETTES: Record<HeritageCategory, Palette> = {
  传统戏剧: { from: '#7E3B36', to: '#C1795A', ink: '#FDF3EE', glow: '#FFD9A8', seal: '#B4453A' },
  传统美术: { from: '#3F5F55', to: '#8FA98C', ink: '#F0F6F1', glow: '#FFE9C4', seal: '#B4453A' },
  传统技艺: { from: '#35606B', to: '#7FA3A0', ink: '#EEF6F6', glow: '#FFCE8A', seal: '#B4453A' },
  传统音乐: { from: '#40456E', to: '#8B8FBE', ink: '#F1F1FA', glow: '#CFE3FF', seal: '#B4453A' },
  传统舞蹈: { from: '#7A4C22', to: '#C79A5C', ink: '#FCF4E7', glow: '#FFD79A', seal: '#B4453A' },
  民俗: { from: '#5E3F5C', to: '#A4809E', ink: '#F9F0F7', glow: '#FFD2B0', seal: '#B4453A' },
}

/** 每个 SVG 需要独立的渐变 id */
const uid = useId()
const seed = computed(() => props.seed || props.name)
const palette = computed(() => PALETTES[props.category] ?? PALETTES['传统技艺'])
const hash = computed(() => hashString(seed.value))
/** 构图变体：同一类别下错开元素位置 */
const variant = computed(() => hash.value % 3)
/** 微小位移，让相邻卡片不雷同 */
const drift = computed(() => (hash.value % 7) - 3)
/** 动画相位偏移（秒），避免同屏动画完全同步 */
const phase = computed(() => ((hash.value % 5) * 0.8).toFixed(1))
const sealText = computed(() => props.category.slice(-1))

/** 鼓点节拍的六个落点（提前算好，避免在模板里用 Math） */
const BEATS = [0, 1, 2, 3, 4, 5].map((index) => ({
  x: Number((160 + 78 * Math.cos((index * Math.PI) / 3)).toFixed(1)),
  y: Number((128 + 78 * Math.sin((index * Math.PI) / 3)).toFixed(1)),
}))
</script>

<template>
  <svg
    class="hcover"
    viewBox="0 0 320 200"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    :aria-label="`${name}（${category}）封面插画`"
    :style="{ '--phase': `${phase}s` }"
  >
    <defs>
      <linearGradient :id="`bg-${uid}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" :stop-color="palette.from" />
        <stop offset="100%" :stop-color="palette.to" />
      </linearGradient>
      <radialGradient :id="`glow-${uid}`" cx="50%" cy="50%" r="50%">
        <stop offset="0%" :stop-color="palette.glow" stop-opacity="0.85" />
        <stop offset="100%" :stop-color="palette.glow" stop-opacity="0" />
      </radialGradient>
      <linearGradient :id="`vig-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1f1e1c" stop-opacity="0" />
        <stop offset="100%" stop-color="#1f1e1c" stop-opacity="0.3" />
      </linearGradient>
      <clipPath :id="`clip-${uid}`">
        <rect width="320" height="200" />
      </clipPath>
    </defs>

    <g :clip-path="`url(#clip-${uid})`">
      <rect width="320" height="200" :fill="`url(#bg-${uid})`" />

      <!-- 环境光晕（呼吸） -->
      <ellipse
        class="hcover__glow"
        :cx="150 + drift * 4"
        cy="130"
        rx="120"
        ry="72"
        :fill="`url(#glow-${uid})`"
      />

      <!-- ================= 传统戏剧：幕布 · 光柱 · 影人 ================= -->
      <g v-if="category === '传统戏剧'">
        <path class="hcover__sway" d="M0 0h58c-8 62-6 126 3 200H0z" fill="#1F1E1C" opacity="0.3" />
        <path
          class="hcover__sway hcover__delay-2"
          d="M320 0h-58c8 62 6 126-3 200h61z"
          fill="#1F1E1C"
          opacity="0.3"
        />
        <path
          class="hcover__beam"
          d="M118-10h84l44 210H74z"
          :fill="`url(#glow-${uid})`"
          opacity="0.22"
        />
        <ellipse cx="160" cy="178" rx="106" ry="14" fill="#1F1E1C" opacity="0.16" />

        <!-- 影人：缓慢横移 -->
        <g class="hcover__walk">
          <g :transform="`translate(${152 + variant * 8} 96)`" :fill="palette.ink">
            <circle cx="0" cy="-20" r="8" opacity="0.92" />
            <path d="M-10-10h20l6 30h-32z" opacity="0.92" />
            <path d="M-10-8l-18 16M10-8l18 14" stroke="#1F1E1C" stroke-width="3.2" opacity="0.7" />
            <path d="M-7 20l-5 26M7 20l6 26" stroke="#1F1E1C" stroke-width="3.2" opacity="0.7" />
          </g>
        </g>
        <g class="hcover__walk hcover__delay-3" opacity="0.45">
          <g transform="translate(96 114) scale(0.7)" :fill="palette.ink">
            <circle cx="0" cy="-20" r="8" />
            <path d="M-10-10h20l6 30h-32z" />
            <path d="M-10-8l-18 16M10-8l18 14" stroke="#1F1E1C" stroke-width="4" />
          </g>
        </g>
      </g>

      <!-- ================= 传统美术：绣绷 · 绣线 · 落花 ================= -->
      <g v-else-if="category === '传统美术'">
        <circle cx="156" cy="104" r="62" fill="none" :stroke="palette.ink" stroke-width="3" opacity="0.5" />
        <circle cx="156" cy="104" r="50" fill="#FFFFFF" opacity="0.1" />
        <path
          class="hcover__stitch"
          d="M124 120c10-32 44-40 62-14 10 15 4 32-12 38"
          fill="none"
          :stroke="palette.ink"
          stroke-width="2.6"
          stroke-linecap="round"
        />
        <path
          class="hcover__stitch hcover__delay-2"
          d="M132 132c8-22 34-28 48-10"
          fill="none"
          :stroke="palette.ink"
          stroke-width="2"
          stroke-linecap="round"
          opacity="0.7"
        />
        <g v-for="petal in 4" :key="`p${petal}`">
          <path
            class="hcover__fall"
            :class="`hcover__delay-${(petal % 3) + 1}`"
            d="M0 0c5-7 14-5 14 5s-7 12-14 5z"
            :fill="palette.ink"
            opacity="0.55"
            :transform="`translate(${46 + petal * 62} ${24 + variant * 10}) scale(${0.7 + (petal % 2) * 0.3})`"
          />
        </g>
      </g>

      <!-- ================= 传统技艺：器物 · 窑火 · 火星 ================= -->
      <g v-else-if="category === '传统技艺'">
        <path
          d="M160 40c17 0 27 13 29 32 3 25 7 42 7 54 0 17-16 28-36 28s-36-11-36-28c0-12 4-29 7-54 2-19 12-32 29-32z"
          fill="#FFFFFF"
          opacity="0.14"
          :stroke="palette.ink"
          stroke-width="1.6"
          stroke-opacity="0.5"
        />
        <path
          d="M136 66c8 6 40 6 48 0"
          fill="none"
          :stroke="palette.ink"
          stroke-width="1.4"
          opacity="0.45"
        />
        <g :fill="palette.glow">
          <path
            class="hcover__flicker"
            d="M160 198c-16 0-26-10-26-22 0-12 10-18 12-30 2 8 6 12 8 6 2-8 6-12 8-22 4 12 10 16 12 26 2 6 4 8 8 6 2 12-6 36-22 36z"
            opacity="0.78"
          />
          <path
            class="hcover__flicker hcover__delay-2"
            d="M114 200c-10 0-16-8-16-16 0-9 8-14 10-24 3 10 10 12 12 22 1 8-1 18-6 18z"
            opacity="0.5"
          />
          <path
            class="hcover__flicker hcover__delay-3"
            d="M206 200c-10 0-16-8-16-16 0-9 8-14 10-24 3 10 10 12 12 22 1 8-1 18-6 18z"
            opacity="0.5"
          />
        </g>
        <g v-for="ember in 5" :key="`e${ember}`" :fill="palette.glow">
          <circle
            class="hcover__ember"
            :class="`hcover__delay-${(ember % 3) + 1}`"
            :cx="128 + ember * 17 + drift * 2"
            cy="170"
            :r="1.4 + (ember % 3) * 0.7"
          />
        </g>
      </g>

      <!-- ================= 传统音乐：琴身 · 琴弦 · 声波 ================= -->
      <g v-else-if="category === '传统音乐'">
        <circle
          v-for="ring in 3"
          :key="`r${ring}`"
          class="hcover__ripple"
          :class="`hcover__delay-${ring}`"
          cx="160"
          cy="86"
          r="34"
          fill="none"
          :stroke="palette.ink"
          stroke-width="1.5"
        />
        <path
          d="M28 118c0-9 8-15 20-15h224c12 0 20 6 20 15s-8 16-20 16H48c-12 0-20-7-20-16z"
          fill="#241F1C"
          opacity="0.55"
        />
        <path
          d="M28 118c0-9 8-15 20-15h224c12 0 20 6 20 15"
          fill="none"
          :stroke="palette.ink"
          stroke-width="1.4"
          opacity="0.45"
        />
        <g :stroke="palette.ink" stroke-width="1.1" opacity="0.85">
          <line
            v-for="string in 5"
            :key="`s${string}`"
            class="hcover__vibrate"
            :class="`hcover__delay-${(string % 3) + 1}`"
            x1="46"
            :y1="107 + string * 4"
            x2="274"
            :y2="107 + string * 4"
          />
        </g>
        <g :fill="palette.ink" opacity="0.5">
          <circle v-for="hui in 7" :key="`h${hui}`" :cx="60 + hui * 33" cy="136" r="1.7" />
        </g>
      </g>

      <!-- ================= 传统舞蹈：鼓面 · 节拍 · 醒狮 ================= -->
      <g v-else-if="category === '传统舞蹈'">
        <circle cx="160" cy="128" r="50" fill="#FFFFFF" opacity="0.12" />
        <circle cx="160" cy="128" r="50" fill="none" :stroke="palette.ink" stroke-width="2" opacity="0.4" />
        <circle cx="160" cy="128" r="34" fill="none" :stroke="palette.ink" stroke-width="1.2" opacity="0.3" />
        <circle
          v-for="wave in 3"
          :key="`w${wave}`"
          class="hcover__ripple"
          :class="`hcover__delay-${wave}`"
          cx="160"
          cy="128"
          r="50"
          fill="none"
          :stroke="palette.ink"
          stroke-width="2"
        />
        <g :fill="palette.glow">
          <circle
            v-for="(beat, index) in BEATS"
            :key="`b${index}`"
            class="hcover__pulse"
            :class="`hcover__delay-${(index % 3) + 1}`"
            :cx="beat.x"
            :cy="beat.y"
            r="3.2"
          />
        </g>
        <g class="hcover__bob">
          <g transform="translate(160 54)">
            <path
              d="M0-26l6 12 12-6-4 13 13 2-11 8 8 10-14-3-5 12-5-12-14 3 8-10-11-8 13-2-4-13 12 6z"
              :fill="palette.ink"
              opacity="0.9"
            />
            <circle cx="0" cy="16" r="14" :fill="palette.ink" opacity="0.85" />
            <circle cx="-5" cy="13" r="3" fill="#1F1E1C" opacity="0.7" />
            <circle cx="5" cy="13" r="3" fill="#1F1E1C" opacity="0.7" />
            <path d="M-8 24c5 4 11 4 16 0" fill="none" stroke="#1F1E1C" stroke-width="2.4" opacity="0.6" />
          </g>
        </g>
      </g>

      <!-- ================= 民俗：灯笼 · 暖光 · 人群 ================= -->
      <g v-else>
        <g fill="#1F1E1C" opacity="0.42">
          <path
            v-for="person in 7"
            :key="`m${person}`"
            :d="`M${12 + person * 44} 200c0-19 10-30 22-30s22 11 22 30z`"
          />
        </g>
        <g v-for="lantern in 3" :key="`l${lantern}`">
          <line
            :x1="70 + lantern * 84 + drift * 3"
            y1="0"
            :x2="70 + lantern * 84 + drift * 3"
            y2="44"
            :stroke="palette.ink"
            stroke-width="1.2"
            opacity="0.5"
          />
          <g
            class="hcover__sway"
            :class="`hcover__delay-${lantern}`"
            :transform="`translate(${70 + lantern * 84 + drift * 3} 44)`"
          >
            <ellipse cx="0" cy="0" rx="19" ry="24" :fill="palette.glow" opacity="0.85" />
            <ellipse
              cx="0"
              cy="0"
              rx="19"
              ry="24"
              fill="none"
              :stroke="palette.seal"
              stroke-width="1.6"
              opacity="0.6"
            />
            <path d="M-8-24h16" :stroke="palette.ink" stroke-width="2.6" opacity="0.7" />
            <path d="M0 24v14" :stroke="palette.seal" stroke-width="1.6" opacity="0.7" />
          </g>
        </g>
        <g v-for="spark in 4" :key="`sp${spark}`" :fill="palette.glow">
          <circle
            class="hcover__fall"
            :class="`hcover__delay-${(spark % 3) + 1}`"
            :cx="50 + spark * 74"
            :cy="44 + (spark % 2) * 22"
            r="2.4"
          />
        </g>
      </g>

      <!-- 斜向光带（质感，缓慢扫过） -->
      <g class="hcover__shimmer" opacity="0.14">
        <rect x="-160" y="-60" width="54" height="320" fill="#FFFFFF" transform="rotate(16 0 0)" />
      </g>

      <!-- 底部渐深，与卡片文字衔接自然 -->
      <rect y="118" width="320" height="82" :fill="`url(#vig-${uid})`" />
    </g>

    <!-- 类别朱红印章（角标） -->
    <g>
      <rect x="272" y="16" width="24" height="24" rx="5" :fill="palette.seal" opacity="0.92" />
      <text
        class="hcover__seal-text"
        x="284"
        y="33"
        text-anchor="middle"
        fill="#FDFBF7"
        font-size="13"
      >
        {{ sealText }}
      </text>
    </g>
  </svg>
</template>

<style scoped lang="scss">
/* ---------- 动画：缓慢、克制，只动 transform / opacity ---------- */
.hcover {
  display: block;
  width: 100%;
  height: 100%;
  --phase: 0s;

  &__seal-text {
    font-family: var(--font-serif);
  }

  &__glow {
    animation: hcover-breathe 6.5s ease-in-out infinite;
    animation-delay: var(--phase);
    transform-box: fill-box;
    transform-origin: center;
  }

  &__sway {
    animation: hcover-sway 7s ease-in-out infinite;
    animation-delay: var(--phase);
    transform-box: fill-box;
    transform-origin: top center;
  }

  &__walk {
    animation: hcover-walk 13s ease-in-out infinite;
    animation-delay: var(--phase);
  }

  &__beam {
    animation: hcover-beam 5.5s ease-in-out infinite;
    animation-delay: var(--phase);
  }

  &__stitch {
    stroke-dasharray: 190;
    stroke-dashoffset: 190;
    animation: hcover-stitch 6.5s ease-in-out infinite;
    animation-delay: var(--phase);
  }

  &__fall {
    animation: hcover-fall 9s linear infinite;
    animation-delay: var(--phase);
  }

  &__flicker {
    animation: hcover-flicker 2.2s ease-in-out infinite;
    animation-delay: var(--phase);
    transform-box: fill-box;
    transform-origin: bottom center;
  }

  &__ember {
    animation: hcover-ember 4.4s ease-out infinite;
    animation-delay: var(--phase);
  }

  &__vibrate {
    animation: hcover-vibrate 1.6s ease-in-out infinite;
    animation-delay: var(--phase);
  }

  &__ripple {
    animation: hcover-ripple 3.4s ease-out infinite;
    animation-delay: var(--phase);
    transform-box: fill-box;
    transform-origin: center;
  }

  &__pulse {
    animation: hcover-pulse 1.5s ease-in-out infinite;
    animation-delay: var(--phase);
    transform-box: fill-box;
    transform-origin: center;
  }

  &__bob {
    animation: hcover-bob 2.6s ease-in-out infinite;
    animation-delay: var(--phase);
  }

  &__shimmer {
    animation: hcover-shimmer 9s ease-in-out infinite;
    animation-delay: var(--phase);
  }

  /* 相位修饰：放在最后，确保 animation-delay 生效 */
  &__delay-1 {
    animation-delay: calc(var(--phase) + 0.7s);
  }

  &__delay-2 {
    animation-delay: calc(var(--phase) + 1.4s);
  }

  &__delay-3 {
    animation-delay: calc(var(--phase) + 2.1s);
  }
}

@keyframes hcover-breathe {
  0%,
  100% {
    opacity: 0.75;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes hcover-sway {
  0%,
  100% {
    transform: rotate(-1.6deg);
  }

  50% {
    transform: rotate(1.6deg);
  }
}

@keyframes hcover-walk {
  0%,
  100% {
    transform: translateX(-26px);
  }

  50% {
    transform: translateX(26px);
  }
}

@keyframes hcover-beam {
  0%,
  100% {
    opacity: 0.14;
  }

  50% {
    opacity: 0.3;
  }
}

@keyframes hcover-stitch {
  0% {
    stroke-dashoffset: 190;
    opacity: 0.3;
  }

  55%,
  85% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    stroke-dashoffset: 190;
    opacity: 0.3;
  }
}

@keyframes hcover-fall {
  0% {
    transform: translateY(-18px) rotate(0deg);
    opacity: 0;
  }

  15% {
    opacity: 0.75;
  }

  85% {
    opacity: 0.55;
  }

  100% {
    transform: translateY(120px) rotate(140deg);
    opacity: 0;
  }
}

@keyframes hcover-flicker {
  0%,
  100% {
    transform: scaleY(0.94) scaleX(1);
    opacity: 0.72;
  }

  40% {
    transform: scaleY(1.08) scaleX(0.97);
    opacity: 1;
  }

  70% {
    transform: scaleY(0.99) scaleX(1.03);
    opacity: 0.85;
  }
}

@keyframes hcover-ember {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }

  20% {
    opacity: 0.9;
  }

  100% {
    transform: translateY(-104px) scale(0.5);
    opacity: 0;
  }
}

@keyframes hcover-vibrate {
  0%,
  100% {
    transform: translateY(-0.8px);
  }

  50% {
    transform: translateY(0.8px);
  }
}

@keyframes hcover-ripple {
  0% {
    transform: scale(0.62);
    opacity: 0.85;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes hcover-pulse {
  0%,
  100% {
    transform: scale(0.78);
    opacity: 0.45;
  }

  50% {
    transform: scale(1.18);
    opacity: 1;
  }
}

@keyframes hcover-bob {
  0%,
  100% {
    transform: translateY(-3px);
  }

  50% {
    transform: translateY(3px);
  }
}

@keyframes hcover-shimmer {
  0%,
  100% {
    transform: translateX(-40px);
  }

  50% {
    transform: translateX(360px);
  }
}

/* 系统开启"减少动态效果"时停掉所有动画，只保留静态插画 */
@media (prefers-reduced-motion: reduce) {
  .hcover {
    g,
    path,
    circle,
    line,
    ellipse,
    rect {
      animation: none !important;
    }

    .hcover__stitch {
      stroke-dashoffset: 0;
    }
  }
}
</style>
