<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { submitFeedback } from '@/api/feedback'
import { FEEDBACK_TYPE_OPTIONS } from '@/config/constants'
import { isNotifiedError } from '@/utils/request'
import type { FeedbackType } from '@/types/feedback'

/**
 * 意见反馈弹窗。
 * 说明：这是唯一一个由组件直接调用 api 层的能力——反馈没有跨页面共享状态，
 * 单独建 store 只为一个 loading 字段没有收益；但仍然通过 src/api/feedback.ts
 * 访问数据（不触碰 mock，也不在本组件里写请求地址），符合分层约定。
 */
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const route = useRoute()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive<{ type: FeedbackType; content: string; contact: string }>({
  type: 'suggestion',
  content: '',
  contact: '',
})

const rules: FormRules = {
  content: [
    { required: true, message: '请填写反馈内容', trigger: 'blur' },
    { min: 5, message: '反馈内容至少 5 个字', trigger: 'blur' },
  ],
}

const typeOptions = computed(() => FEEDBACK_TYPE_OPTIONS)

/** 每次打开都重置表单，避免上次内容残留 */
watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      return
    }
    form.type = 'suggestion'
    form.content = ''
    form.contact = ''
    formRef.value?.clearValidate()
  },
)

function close(): void {
  emit('update:modelValue', false)
}

async function handleSubmit(): Promise<void> {
  if (!formRef.value) {
    return
  }
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await submitFeedback({
      type: form.type,
      content: form.content.trim(),
      contact: form.contact.trim() || undefined,
      page: route.fullPath,
    })
    ElMessage.success('感谢反馈，我们会尽快查看')
    close()
  } catch (error) {
    if (!isNotifiedError(error)) {
      ElMessage.error(error instanceof Error ? error.message : '提交失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="意见反馈"
    width="520px"
    align-center
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="feedback__desc">
      可以反馈功能建议、使用问题，或指出非遗资料中的错误，我们会据此改进。
    </p>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="反馈类型">
        <el-radio-group v-model="form.type">
          <el-radio-button
            v-for="option in typeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="反馈内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="5"
          resize="none"
          maxlength="500"
          show-word-limit
          placeholder="请描述你遇到的问题或建议，越具体越好"
        />
      </el-form-item>

      <el-form-item label="联系方式（可选）">
        <el-input v-model="form.contact" placeholder="邮箱或微信，便于我们回复你" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">提交反馈</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.feedback__desc {
  margin-bottom: var(--sp-5);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-secondary);
}
</style>
