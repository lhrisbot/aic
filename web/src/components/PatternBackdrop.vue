<script setup lang="ts">
import { computed } from 'vue'

/**
 * 极淡的传统纹样背景层。
 * 只做装饰，不接收指针事件；强度由 --pattern-opacity 控制。
 */
const props = withDefaults(
  defineProps<{
    /** 纹样类型：经纬格 / 冰裂纹 / 回纹 / 云纹 */
    variant?: 'grid' | 'crackle' | 'fret' | 'cloud'
  }>(),
  {
    variant: 'grid',
  },
)

const className = computed(() => `pattern-${props.variant}`)
</script>

<template>
  <div class="pattern-backdrop" :class="className" aria-hidden="true" />
</template>

<style scoped lang="scss">
/* 强度由纹样类中的 --pattern-opacity 决定，此处不覆盖 opacity，
   以便父级通过自定义属性调整深浅（如深色 Banner 上提高对比）。 */
.pattern-backdrop {
  width: 100%;
  height: 100%;
}
</style>
