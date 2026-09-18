<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, MagicStick, Refresh } from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'
import { getSceneConfig, type SceneField } from '@/config/sceneSchema'
import { useCreationStore } from '@/stores/creation'
import SceneSelector from '@/components/SceneSelector.vue'
import SceneParamForm from './SceneParamForm.vue'

/** 左栏：创作设置（非遗项目 → 创作场景 → 场景参数 → 开始创作） */
const store = useCreationStore()

const sceneDesc = computed(() => getSceneConfig(store.form.scene).desc)

function handleSelectHeritage(id: string): void {
  void store.selectHeritage(id)
}

function handleFieldChange(field: SceneField, value: string): void {
  store.setField(field, value)
}

function handleGenerate(): void {
  void store.generate()
}
</script>

<template>
  <section class="creation-panel">
    <!-- 1. 非遗项目 -->
    <div class="creation-panel__block">
      <h2 class="creation-panel__block-title">
        <span class="creation-panel__step">1</span>
        非遗项目
      </h2>

      <el-select
        :model-value="store.form.heritageId"
        filterable
        :loading="store.optionsLoading"
        placeholder="搜索并选择非遗项目"
        class="creation-panel__select"
        @update:model-value="handleSelectHeritage"
      >
        <el-option
          v-for="item in store.options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
          <div class="creation-panel__option">
            <span class="creation-panel__option-name">{{ item.name }}</span>
            <span class="creation-panel__option-meta">{{ item.region }} · {{ item.category }}</span>
          </div>
        </el-option>
      </el-select>

      <p v-if="store.optionsFailed" class="creation-panel__error">
        非遗列表加载失败，请刷新页面重试
      </p>

      <div v-if="store.heritageLoading" class="creation-panel__loading">正在载入非遗资料…</div>

      <div v-else-if="store.heritage" class="creation-panel__heritage">
        <p class="creation-panel__heritage-name">{{ store.heritage.name }}</p>
        <p class="creation-panel__heritage-summary">{{ store.heritage.summary }}</p>
        <RouterLink
          class="creation-panel__heritage-link"
          :to="`/heritage/${store.heritage.id}`"
        >
          查看非遗详情
          <el-icon :size="12"><ArrowRight /></el-icon>
        </RouterLink>
      </div>

      <p v-else-if="store.heritageFailed" class="creation-panel__error">
        资料加载失败，请重新选择项目
      </p>
    </div>

    <!-- 2. 创作场景 -->
    <div class="creation-panel__block">
      <h2 class="creation-panel__block-title">
        <span class="creation-panel__step">2</span>
        创作场景
      </h2>

      <SceneSelector
        :model-value="store.form.scene"
        :disabled="store.generating"
        @update:model-value="store.setScene"
      />
      <p class="creation-panel__scene-desc">{{ sceneDesc }}</p>
    </div>

    <!-- 3. 场景参数 -->
    <div class="creation-panel__block">
      <h2 class="creation-panel__block-title">
        <span class="creation-panel__step">3</span>
        场景参数
      </h2>

      <SceneParamForm :form="store.form" @change="handleFieldChange" />
    </div>

    <!-- 4. 开始创作 -->
    <div class="creation-panel__footer">
      <el-button
        type="primary"
        size="large"
        class="creation-panel__submit"
        :icon="MagicStick"
        :loading="store.generating"
        :disabled="!store.form.heritageId"
        @click="handleGenerate"
      >
        {{ store.generating ? '正在创作…' : 'AI 开始创作' }}
      </el-button>

      <el-button
        v-if="store.hasResult"
        text
        size="small"
        :icon="Refresh"
        class="creation-panel__reset"
        @click="store.resetResult"
      >
        清空结果
      </el-button>

      <p class="creation-panel__hint">
        生成结果会标注引用的知识库资料，可继续编辑后保存为作品。
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.creation-panel {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  padding: var(--sp-6);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);

  &__block {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);

    & + & {
      padding-top: var(--sp-6);
      border-top: 1px dashed var(--border-color);
    }
  }

  &__block-title {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    font-family: var(--font-sans);
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
  }

  &__step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: 11px;
  }

  &__select {
    width: 100%;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
  }

  &__option-name {
    color: var(--text-primary);
  }

  &__option-meta {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__loading {
    padding: var(--sp-3);
    border-radius: var(--radius-sm);
    background: var(--bg-subtle);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__heritage {
    padding: var(--sp-4);
    border-radius: var(--radius);
    background: var(--bg-subtle);
  }

  &__heritage-name {
    font-family: var(--font-serif);
    font-size: var(--fs-md);
    color: var(--text-primary);
  }

  &__heritage-summary {
    margin-top: var(--sp-2);
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__heritage-link {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    margin-top: var(--sp-3);
    font-size: var(--fs-xs);
    color: var(--color-primary);
  }

  &__error {
    font-size: var(--fs-xs);
    color: var(--color-danger);
  }

  &__scene-desc {
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
    color: var(--text-tertiary);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    padding-top: var(--sp-5);
    border-top: 1px solid var(--border-color);
  }

  &__submit {
    width: 100%;
  }

  &__reset {
    align-self: center;
  }

  &__hint {
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
    color: var(--text-tertiary);
    text-align: center;
  }
}
</style>
