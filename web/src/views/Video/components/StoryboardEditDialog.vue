<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Storyboard } from '@/types/video'

/** 分镜编辑弹窗：编辑时间轴、画面描述、旁白与 AI Video Prompt */
const props = defineProps<{
  modelValue: boolean
  shot: Storyboard | null
  duration: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [shot: Storyboard]
}>()

const draft = ref<Storyboard | null>(null)

watch(
  () => props.shot,
  (shot) => {
    draft.value = shot ? { ...shot } : null
  },
  { immediate: true },
)

function close(): void {
  emit('update:modelValue', false)
}

function handleSubmit(): void {
  if (!draft.value) {
    return
  }
  if (draft.value.end <= draft.value.start || draft.value.end > props.duration) {
    ElMessage.warning(`分镜时间必须在 0-${props.duration} 秒内，且结束时间要大于起始时间`)
    return
  }
  emit('submit', { ...draft.value })
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="编辑分镜"
    width="580px"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="draft" class="shot-form">
      <div class="shot-form__timeline">
        <div class="shot-form__field">
          <label class="shot-form__label">起始（秒）</label>
          <el-input-number v-model="draft.start" :min="0" :max="duration" :step="1" />
        </div>
        <div class="shot-form__field">
          <label class="shot-form__label">结束（秒）</label>
          <el-input-number v-model="draft.end" :min="1" :max="duration" :step="1" />
        </div>
        <p class="shot-form__tip">本镜时长 {{ Math.max(draft.end - draft.start, 0) }} 秒</p>
      </div>

      <div class="shot-form__field">
        <label class="shot-form__label">画面描述</label>
        <el-input v-model="draft.scene" type="textarea" :rows="3" resize="none" />
      </div>

      <div class="shot-form__field">
        <label class="shot-form__label">旁白</label>
        <el-input v-model="draft.narration" type="textarea" :rows="2" resize="none" />
      </div>

      <div class="shot-form__field">
        <label class="shot-form__label">AI Video Prompt</label>
        <el-input v-model="draft.prompt" type="textarea" :rows="2" resize="none" />
        <p class="shot-form__tip">建议使用英文描述画面风格、光线与镜头运动。</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存分镜</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.shot-form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);

  &__timeline {
    display: flex;
    align-items: flex-end;
    gap: var(--sp-4);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    min-width: 0;
  }

  &__label {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__tip {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }
}
</style>
