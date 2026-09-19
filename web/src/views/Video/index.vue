<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MagicStick, Plus } from '@element-plus/icons-vue'
import { useVideoStore } from '@/stores/video'
import type { Storyboard } from '@/types/video'
import StoryboardCard from '@/components/StoryboardCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import VideoStepBar from './components/VideoStepBar.vue'
import VideoMetaBar from './components/VideoMetaBar.vue'
import VideoScriptPanel from './components/VideoScriptPanel.vue'
import VideoTaskPanel from './components/VideoTaskPanel.vue'
import StoryboardEditDialog from './components/StoryboardEditDialog.vue'
import { formatTimeRange } from '@/utils/format'

/**
 * 视频创作页。
 * 三种进入方式：从创作页带 workId / 带 heritageId / 直接进入后自行选择。
 * 流程：宣传文案 → 视频脚本 → 分镜设计 → AI 视频生成（步骤条同步显示）。
 */
const route = useRoute()
const store = useVideoStore()

const editVisible = ref(false)
const editingShot = ref<Storyboard | null>(null)

function openEdit(shot: Storyboard): void {
  editingShot.value = shot
  editVisible.value = true
}

function submitEdit(shot: Storyboard): void {
  if (!store.updateShot(shot)) {
    return
  }
  editVisible.value = false
  editingShot.value = null
  ElMessage.success(`镜头 ${String(shot.index).padStart(2, '0')} 已更新`)
}

async function removeShot(shot: Storyboard): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `确认删除「镜头 ${String(shot.index).padStart(2, '0')}」吗？删除后可用「添加分镜」重新补充。`,
      '删除分镜',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' },
    )
  } catch {
    return
  }
  store.deleteShot(shot.id)
  ElMessage.success('分镜已删除')
}

async function handleHeritageChange(id: string): Promise<void> {
  await store.applyHeritage(id)
}

async function handleWorkChange(id: string): Promise<void> {
  await store.applyWork(id)
}

async function handleGenerateScript(): Promise<void> {
  await store.ensureScript(true)
}

onMounted(() => {
  void store.initWithQuery(route.query)
})

watch(
  () => [route.query.draftId, route.query.workId, route.query.heritageId],
  () => {
    void store.initWithQuery(route.query)
  },
)

onBeforeUnmount(() => {
  store.dispose()
})
</script>

<template>
  <div class="video-page">
    <header class="video-page__header u-container">
      <div>
        <p class="video-page__eyebrow"><span aria-hidden="true" /> VIDEO PRODUCTION / 04</p>
        <h1 class="video-page__title">视频创作</h1>
        <p class="video-page__subtitle">
          把已经确认的宣传文案拆成可执行的分镜，再逐镜生成画面并合成为一支宣传短片。
        </p>
      </div>

      <div v-if="store.heritage" class="video-page__summary">
        <span class="video-page__chip is-heritage">{{ store.heritage.name }}</span>
        <span class="video-page__chip">{{ store.style }}</span>
        <span class="video-page__chip">{{ store.platform }}</span>
        <span class="video-page__chip is-ai">{{ store.duration }} 秒</span>
      </div>
    </header>

    <div class="video-page__body u-container">
      <!-- 未确定主题：先选来源 -->
      <section v-if="!store.hasSource" class="video-page__picker">
        <EmptyState
          title="先确定这支短片讲什么"
          description="可以从已有视频作品继续，也可以直接选一个非遗项目，按当前时长与风格拆分分镜。"
        >
          <template #icon>
            <el-icon :size="40"><MagicStick /></el-icon>
          </template>
        </EmptyState>

        <div class="video-page__picker-fields">
          <div class="video-page__picker-field">
            <label class="video-page__picker-label">从已有脚本或视频作品继续</label>
            <el-select
              :model-value="''"
              placeholder="选择一件视频作品"
              :loading="store.optionsLoading"
              :disabled="store.videoWorks.length === 0"
              @change="handleWorkChange"
            >
              <el-option
                v-for="work in store.videoWorks"
                :key="work.id"
                :label="work.title"
                :value="work.id"
              />
            </el-select>
            <p v-if="store.videoWorks.length === 0" class="video-page__picker-hint">
              暂无可继续加工的脚本或视频作品，可先在 AI 创作页生成短视频脚本。
            </p>
          </div>

          <div class="video-page__picker-field">
            <label class="video-page__picker-label">选择非遗项目新建</label>
            <el-select
              :model-value="''"
              filterable
              placeholder="搜索并选择非遗项目"
              :loading="store.optionsLoading"
              @change="handleHeritageChange"
            >
              <el-option
                v-for="item in store.heritageOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <div class="video-page__option">
                  <span>{{ item.name }}</span>
                  <span class="video-page__option-meta">{{ item.region }} · {{ item.category }}</span>
                </div>
              </el-option>
            </el-select>
            <p class="video-page__picker-hint">
              选择后会按当前时长与风格拆出分镜，可逐镜编辑后再生成视频。
            </p>
          </div>
        </div>
      </section>

      <!-- 已确定主题：完整流程 -->
      <template v-else>
        <VideoStepBar :active-index="store.activeStep" />

        <VideoMetaBar />

        <VideoScriptPanel />

        <section class="video-page__storyboards">
          <header class="video-page__section-head">
            <div>
              <p class="video-page__section-index">02 / 分镜设计</p>
              <h2 class="video-page__section-title">分镜设计</h2>
              <p class="video-page__section-desc">
                每个镜头包含画面描述、旁白与 AI Video Prompt，可单独编辑、重新生成或删除。
              </p>
            </div>

            <div class="video-page__section-actions">
              <el-button :icon="Plus" :disabled="!store.hasSource" @click="store.addShot">
                添加分镜
              </el-button>
            </div>
          </header>

          <div v-if="store.storyboards.length" class="video-page__timeline">
            <div class="video-page__timeline-head">
              <span>EDIT TIMELINE</span>
              <em>{{ store.duration }} 秒 · {{ store.storyboards.length }} 个镜头</em>
            </div>
            <div class="video-page__timeline-track">
              <div
                v-for="shot in store.storyboards"
                :key="`timeline-${shot.id}`"
                class="video-page__timeline-segment"
                :class="{ 'is-alt': shot.index % 2 === 0 }"
                :style="{
                  width: `${Math.max(10, ((shot.end - shot.start) / Math.max(store.duration, 1)) * 100)}%`,
                }"
              >
                <strong>{{ String(shot.index).padStart(2, '0') }}</strong>
                <span>{{ formatTimeRange(shot.start, shot.end) }}</span>
              </div>
            </div>
          </div>

          <div v-if="store.storyboards.length" class="video-page__shot-list">
            <StoryboardCard
              v-for="shot in store.storyboards"
              :key="shot.id"
              :shot="shot"
              :busy="store.busyShotId === shot.id"
              @edit="openEdit"
              @remove="removeShot"
              @regenerate="store.regenerateShot"
            />
          </div>

          <EmptyState
            v-else
            title="还没有分镜"
            description="点击「生成分镜脚本」，按当前时长与风格自动拆分镜头。"
            size="compact"
          >
            <el-button type="primary" :icon="MagicStick" :loading="store.scriptLoading" @click="handleGenerateScript">
              生成分镜脚本
            </el-button>
          </EmptyState>
        </section>

        <VideoTaskPanel />
      </template>
    </div>

    <StoryboardEditDialog
      v-model="editVisible"
      :shot="editingShot"
      :duration="store.duration"
      @submit="submitEdit"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.video-page {
  position: relative;
  isolation: isolate;
  padding-bottom: var(--sp-16);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 8%;
    width: min(460px, 42vw);
    height: 280px;
    pointer-events: none;
    background: radial-gradient(closest-side, rgba(192, 80, 60, 0.12), transparent 72%);
    filter: blur(2px);
    z-index: -1;
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
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1.4px;

    span {
      width: 24px;
      height: 1px;
      background: var(--color-primary);
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

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);
  }

  &__picker {
    padding: var(--sp-10) var(--sp-8);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);

    @include below($bp-md) {
      padding: var(--sp-6);
    }
  }

  &__picker-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp-6);
    max-width: 760px;
    margin: 0 auto;

    @include below($bp-md) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__picker-field {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  &__picker-label {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__picker-hint {
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
    color: var(--text-tertiary);
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
  }

  &__option-meta {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__storyboards {
    padding: var(--sp-7);
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);

    @include below($bp-md) {
      padding: var(--sp-5);
    }
  }

  &__section-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sp-6);
    margin-bottom: var(--sp-5);

    @include below($bp-lg) {
      flex-direction: column;
      gap: var(--sp-4);
    }
  }

  &__section-title {
    font-size: var(--fs-xl);
  }

  &__section-index {
    margin-bottom: var(--sp-2);
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1px;
  }

  &__section-desc {
    margin-top: var(--sp-2);
    max-width: 560px;
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__section-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    flex: none;
  }

  &__timeline {
    margin-bottom: var(--sp-6);
    padding: var(--sp-4);
    border-radius: var(--radius);
    background: #252624;
    color: var(--text-inverse);
    box-shadow: 0 14px 30px rgba(35, 34, 32, 0.12);
  }

  &__timeline-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    margin-bottom: var(--sp-3);
    color: rgba(253, 251, 247, 0.54);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.1px;

    em {
      color: rgba(253, 251, 247, 0.42);
      font-family: var(--font-sans);
      font-style: normal;
      letter-spacing: 0;
    }
  }

  &__timeline-track {
    display: flex;
    gap: 3px;
    min-height: 56px;
    padding: 4px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  &__timeline-segment {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 6px;
    min-width: 54px;
    padding: 8px 9px;
    border-radius: 5px;
    background: linear-gradient(160deg, #c96f59, #a9443d);
    color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    transition: filter var(--duration) var(--ease-out), transform var(--duration) var(--ease-out);

    &.is-alt {
      background: linear-gradient(160deg, #4e8585, #356366);
    }

    &:hover {
      filter: brightness(1.12);
      transform: translateY(-2px);
    }

    strong {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: var(--fw-medium);
    }

    span {
      white-space: nowrap;
      font-size: 10px;
      opacity: 0.72;
    }
  }

  &__shot-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }
}
</style>
