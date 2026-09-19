<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowDown, ArrowUp, Reading } from '@element-plus/icons-vue'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useCreationStore } from '@/stores/creation'
import CreationPanel from './components/CreationPanel.vue'
import GenerationPanel from './components/GenerationPanel.vue'
import KnowledgePanel from './components/KnowledgePanel.vue'

/**
 * AI 创作页（全系统最重要的页面）。
 * 三栏结构：创作参数 / 生成结果 / 参考知识。
 * 响应式：<1400px 右栏收窄；<1200px 右栏收进抽屉；<1024px 左栏折叠为顶部面板。
 */
const route = useRoute()
const store = useCreationStore()
const { isBelowXl, isBelowLg, isBelowMd } = useBreakpoints()

/** 窄屏下的「AI 参考资料」抽屉 */
const knowledgeDrawer = ref(false)
/** 紧凑屏下左栏是否展开 */
const settingsOpen = ref(false)

const settingsCollapsed = computed(() => isBelowMd.value && !settingsOpen.value)
const settingsSummary = computed(() => {
  const name = store.heritageName || '未选择项目'
  return `${name} · ${store.sceneLabel}`
})

function syncFromQuery(): void {
  void store.initWithQuery(route.query)
}

onMounted(() => {
  syncFromQuery()
  // 窄屏默认展开设置面板，避免用户找不到参数
  settingsOpen.value = !isBelowMd.value
})

watch(
  () => [route.query.heritageId, route.query.scene],
  () => syncFromQuery(),
)
</script>

<template>
  <div class="creation">
    <header class="creation__header u-container">
      <div class="creation__intro">
        <p class="creation__eyebrow"><span aria-hidden="true" /> AI CONTENT STUDIO</p>
        <h1 class="creation__title">AI 创作</h1>
        <p class="creation__subtitle">
          选择非遗项目与创作场景，AI 会先检索知识库中的可信资料，再生成可直接使用的场景化内容。
        </p>
      </div>

      <div v-if="store.heritage" class="creation__summary">
        <span class="creation__chip is-heritage">{{ store.heritage.name }}</span>
        <span class="creation__chip">{{ store.sceneLabel }}</span>
        <span class="creation__chip is-ai">{{ store.result ? '本次引用' : '可参考资料' }} {{ store.sources.length }} 条</span>
      </div>
    </header>

    <div class="creation__workspace u-container">
      <div class="creation__workspace-head">
        <div>
          <span class="creation__workspace-kicker">WORKSPACE / 01</span>
          <strong>一站式文化内容生产台</strong>
        </div>
        <div class="creation__workspace-flow" aria-label="AI 创作工作流">
          <span :class="{ 'is-active': store.heritageLoading, 'is-done': store.heritage }">01 资料检索</span>
          <i>→</i>
          <span :class="{ 'is-active': store.heritage && !store.generating && !store.result, 'is-done': store.result }">02 参数配置</span>
          <i>→</i>
          <span :class="{ 'is-active': store.generating, 'is-done': store.result }">03 生成结果</span>
        </div>
      </div>

      <div
        class="creation__grid"
        :class="{
          'is-xl-narrow': isBelowXl,
          'is-narrow': isBelowLg,
          'is-compact': isBelowMd,
        }"
      >
        <!-- 左栏：创作设置 -->
        <aside class="creation__aside">
          <button
            v-if="isBelowMd"
            class="creation__collapse"
            type="button"
            :aria-expanded="settingsOpen"
            @click="settingsOpen = !settingsOpen"
          >
            <span class="creation__collapse-label">创作设置</span>
            <span class="creation__collapse-summary">{{ settingsSummary }}</span>
            <el-icon :size="14">
              <ArrowUp v-if="settingsOpen" />
              <ArrowDown v-else />
            </el-icon>
          </button>

          <CreationPanel v-show="!settingsCollapsed" />
        </aside>

        <!-- 中栏：生成结果 -->
        <main class="creation__main">
          <GenerationPanel />
        </main>

        <!-- 右栏：参考知识（宽屏内联，窄屏抽屉） -->
        <aside v-if="!isBelowLg" class="creation__knowledge">
          <KnowledgePanel />
        </aside>
      </div>
    </div>

    <!-- 窄屏：参考资料抽屉 -->
    <el-drawer
      v-model="knowledgeDrawer"
      title="AI 参考资料"
      direction="rtl"
      size="min(340px, 92vw)"
    >
      <KnowledgePanel />
    </el-drawer>

    <button
      v-if="isBelowLg"
      class="creation__floating"
      type="button"
      @click="knowledgeDrawer = true"
    >
      <el-icon :size="16"><Reading /></el-icon>
      AI 参考资料
      <span v-if="store.sources.length" class="creation__floating-count">
        {{ store.sources.length }}
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.creation {
  position: relative;
  padding-bottom: var(--sp-16);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 6%;
    width: min(520px, 46vw);
    height: 240px;
    pointer-events: none;
    background: radial-gradient(closest-side, rgba(63, 107, 115, 0.11), transparent 72%);
    filter: blur(2px);
  }

  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--sp-6);
    padding-block: var(--sp-10) var(--sp-6);

    @include below($bp-md) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-4);
      padding-block: var(--sp-8) var(--sp-5);
    }
  }

  &__title {
    font-size: var(--fs-3xl);
    letter-spacing: 1px;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
    color: var(--color-ai);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1.4px;

    span {
      width: 24px;
      height: 1px;
      background: var(--color-ai);
    }
  }

  &__subtitle {
    margin-top: var(--sp-3);
    max-width: 640px;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex-wrap: wrap;
    flex: none;
  }

  &__chip {
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    background: var(--bg-subtle);
    color: var(--text-secondary);
    font-size: var(--fs-xs);

    &.is-heritage {
      background: var(--color-primary-soft);
      color: var(--color-primary);
      font-family: var(--font-serif);
      font-size: var(--fs-sm);
    }

    &.is-ai {
      background: var(--color-ai-soft);
      color: var(--color-ai);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 288px minmax(0, 1fr) 312px;
    gap: var(--sp-6);
    align-items: start;

    &.is-xl-narrow {
      grid-template-columns: 280px minmax(0, 1fr) 284px;
    }

    /* <1200px：右栏进入抽屉 */
    &.is-narrow {
      grid-template-columns: 272px minmax(0, 1fr);
    }

    /* <1024px：左栏折叠为顶部面板，中栏占满 */
    &.is-compact {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__workspace {
    position: relative;
    overflow: hidden;
    padding-top: var(--sp-4);
    padding-bottom: var(--sp-4);
    border: 1px solid var(--border-color-strong);
    border-radius: 28px;
    background:
      radial-gradient(70% 100% at 100% 0%, rgba(63, 107, 115, 0.08), transparent 62%),
      radial-gradient(60% 90% at 0% 100%, rgba(192, 80, 60, 0.08), transparent 64%),
      var(--bg-subtle);
    box-shadow: 0 18px 44px rgba(76, 67, 56, 0.1);

    @include below($bp-md) {
      padding-top: var(--sp-3);
      padding-bottom: var(--sp-3);
      border-radius: var(--radius-lg);
    }
  }

  &__workspace-head {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-5);
    padding: 0 var(--sp-5) var(--sp-4);
    color: var(--text-primary);

    strong {
      display: block;
      margin-top: 4px;
      font-family: var(--font-serif);
      font-size: var(--fs-md);
      font-weight: var(--fw-medium);
    }

    @include below($bp-md) {
      align-items: flex-start;
      flex-direction: column;
      padding-inline: var(--sp-4);
    }
  }

  &__workspace-kicker {
    color: var(--text-tertiary);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.3px;
  }

  &__workspace-flow {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-tertiary);
    font-size: 11px;

    span {
      white-space: nowrap;
    }

    .is-active {
      color: var(--color-primary);
      font-weight: var(--fw-semibold);
    }

    .is-done {
      color: var(--color-success);
    }

    i {
      color: var(--border-color-strong);
      font-style: normal;
    }

    @include below($bp-md) {
      width: 100%;
      justify-content: space-between;
      gap: 4px;
      font-size: 10px;
    }
  }

  &__aside,
  &__knowledge {
    position: sticky;
    top: calc(var(--header-height) + var(--sp-5));
    max-height: calc(100vh - var(--header-height) - var(--sp-10));
    overflow-y: auto;
    padding-right: 4px;

    @include below($bp-lg) {
      position: static;
      max-height: none;
      overflow: visible;
      padding-right: 0;
    }
  }

  &__workspace > &__grid {
    position: relative;
    z-index: 1;
    padding: var(--sp-3);
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.58);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);

    @include below($bp-md) {
      padding: var(--sp-2);
      border-radius: 16px;
    }
  }

  &__collapse {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    width: 100%;
    padding: var(--sp-4) var(--sp-5);
    margin-bottom: var(--sp-3);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background: var(--bg-card);
    color: var(--text-primary);
    font-family: inherit;
    cursor: pointer;
  }

  &__collapse-label {
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
  }

  &__collapse-summary {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__main {
    min-width: 0;
  }

  &__floating {
    position: fixed;
    right: var(--sp-5);
    bottom: var(--sp-6);
    z-index: 20;
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: 10px 18px;
    border: 1px solid var(--color-ai-border);
    border-radius: var(--radius-pill);
    background: var(--bg-card);
    color: var(--color-ai);
    font-family: inherit;
    font-size: var(--fs-sm);
    box-shadow: var(--shadow-lg);
    cursor: pointer;
    transition: transform var(--duration) var(--ease-out);
  }

  &__floating-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: var(--radius-pill);
    background: var(--color-ai);
    color: var(--text-inverse);
    font-family: var(--font-mono);
    font-size: 11px;
  }
}
</style>
