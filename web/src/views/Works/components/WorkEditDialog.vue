<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Work } from '@/types/work'

/**
 * 作品编辑弹窗。
 * - 文章型作品：可改标题与 Markdown 正文（保存后由 store 重新生成列表摘要）；
 * - 视频型作品：可改标题与摘要（分镜脚本请到视频创作页调整）。
 */
const props = defineProps<{
  modelValue: boolean
  work: Work | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: { title: string; content?: string; summary?: string }]
}>()

const draft = ref({ title: '', content: '', summary: '' })

const isVideo = computed(() => props.work?.type === 'video')

watch(
  () => [props.modelValue, props.work] as const,
  ([visible, work]) => {
    if (!visible || !work) {
      return
    }
    draft.value = {
      title: work.title,
      content: work.content ?? '',
      summary: work.summary ?? '',
    }
  },
  { immediate: true },
)

function close(): void {
  emit('update:modelValue', false)
}

function handleSubmit(): void {
  const title = draft.value.title.trim()
  if (!title) {
    ElMessage.warning('作品标题不能为空')
    return
  }

  if (isVideo.value) {
    emit('submit', { title, summary: draft.value.summary.trim() })
  } else {
    emit('submit', { title, content: draft.value.content })
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="isVideo ? '编辑视频作品' : '编辑作品'"
    width="720px"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="work-edit">
      <div class="work-edit__field">
        <label class="work-edit__label">作品标题</label>
        <el-input v-model="draft.title" placeholder="作品标题" />
      </div>

      <div v-if="!isVideo" class="work-edit__field">
        <label class="work-edit__label">正文（支持 Markdown）</label>
        <el-input v-model="draft.content" type="textarea" :rows="14" resize="vertical" />
        <p class="work-edit__tip">保存后会自动按正文重新生成作品摘要。</p>
      </div>

      <div v-else class="work-edit__field">
        <label class="work-edit__label">作品摘要</label>
        <el-input v-model="draft.summary" type="textarea" :rows="3" resize="none" />
        <p class="work-edit__tip">如需调整分镜脚本，请到「视频创作」页对应作品继续编辑。</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存修改</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.work-edit {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
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
