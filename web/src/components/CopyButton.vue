<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import { copyText } from '@/utils/clipboard'

/** 复制按钮：封装剪贴板降级方案与结果提示 */
const props = withDefaults(
  defineProps<{
    text: string
    label?: string
    size?: 'small' | 'default' | 'large'
    /** 复制成功后的提示文案 */
    successText?: string
    disabled?: boolean
  }>(),
  {
    label: '复制',
    size: 'default',
    successText: '已复制到剪贴板',
    disabled: false,
  },
)

const copying = ref(false)

async function handleCopy(): Promise<void> {
  if (copying.value) {
    return
  }
  copying.value = true
  const succeed = await copyText(props.text)
  copying.value = false

  if (succeed) {
    ElMessage.success(props.successText)
  } else {
    ElMessage.error('复制失败，请手动选择内容后复制')
  }
}
</script>

<template>
  <el-button
    :size="size"
    :icon="DocumentCopy"
    :disabled="disabled || !text"
    :loading="copying"
    @click="handleCopy"
  >
    {{ label }}
  </el-button>
</template>
