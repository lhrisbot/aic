<script setup lang="ts">
import { computed } from 'vue'
import { getSceneConfig, readFieldValue, type SceneField } from '@/config/sceneSchema'
import type { CreationFormModel } from '@/types/ai'

/**
 * 场景参数表单（数据驱动）。
 * 渲染哪些字段、字段类型、选项与默认值全部来自 config/sceneSchema.ts：
 * 新增场景只需要加一份配置，本组件与页面都不需要改动。
 */
const props = defineProps<{
  form: CreationFormModel
}>()

const emit = defineEmits<{
  change: [field: SceneField, value: string]
}>()

const config = computed(() => getSceneConfig(props.form.scene))

function valueOf(field: SceneField): string {
  return readFieldValue(props.form, field)
}

function handleUpdate(field: SceneField, value: string): void {
  emit('change', field, value)
}
</script>

<template>
  <div class="scene-form">
    <div v-for="field in config.fields" :key="field.key" class="scene-form__field">
      <label class="scene-form__label">
        {{ field.label }}
        <span v-if="field.required" class="scene-form__required" aria-hidden="true">*</span>
      </label>

      <el-select
        v-if="field.type === 'select'"
        :model-value="valueOf(field)"
        placeholder="请选择"
        class="scene-form__control"
        @update:model-value="(value: string) => handleUpdate(field, value)"
      >
        <el-option
          v-for="option in field.options ?? []"
          :key="option"
          :label="option"
          :value="option"
        />
      </el-select>

      <div v-else-if="field.type === 'chips'" class="scene-form__chips">
        <button
          v-for="option in field.options ?? []"
          :key="option"
          class="scene-form__chip"
          :class="{ 'is-active': valueOf(field) === option }"
          type="button"
          @click="handleUpdate(field, option)"
        >
          {{ option }}
        </button>
      </div>

      <el-input
        v-else
        :model-value="valueOf(field)"
        type="textarea"
        :rows="3"
        resize="none"
        :placeholder="field.placeholder"
        @update:model-value="(value: string) => handleUpdate(field, value)"
      />

      <p v-if="field.hint" class="scene-form__hint">{{ field.hint }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scene-form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  &__label {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__required {
    color: var(--color-primary);
    margin-left: 2px;
  }

  &__control {
    width: 100%;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }

  &__chip {
    padding: 5px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-family: inherit;
    font-size: var(--fs-xs);
    cursor: pointer;
    transition: all var(--duration) var(--ease-out);

    &:hover {
      border-color: var(--border-color-strong);
      color: var(--text-primary);
    }

    &.is-active {
      border-color: var(--color-primary-border);
      background: var(--color-primary-soft);
      color: var(--color-primary);
      font-weight: var(--fw-medium);
    }
  }

  &__hint {
    font-size: var(--fs-xs);
    line-height: var(--lh-relaxed);
    color: var(--text-tertiary);
  }
}
</style>
