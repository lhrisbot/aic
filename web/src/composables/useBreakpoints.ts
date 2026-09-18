import { computed, onBeforeUnmount, onMounted, ref, type ComputedRef, type Ref } from 'vue'

/**
 * 视口断点（与设计规范 §7.4 一致）。
 * 用于「同一份内容在不同宽度下换一种承载方式」的场景：
 * 例如创作页在窄屏下把右侧参考知识收进抽屉、把左侧参数收进折叠面板。
 */
export interface Breakpoints {
  /** 当前视口宽度 */
  width: Ref<number>
  /** < 1400px：右栏收窄 */
  isBelowXl: ComputedRef<boolean>
  /** < 1200px：右栏折叠为抽屉 */
  isBelowLg: ComputedRef<boolean>
  /** < 1024px：左栏折叠为顶部面板 */
  isBelowMd: ComputedRef<boolean>
}

export function useBreakpoints(): Breakpoints {
  const width = ref(typeof window === 'undefined' ? 1440 : window.innerWidth)

  function handleResize(): void {
    width.value = window.innerWidth
  }

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    width,
    isBelowXl: computed(() => width.value < 1400),
    isBelowLg: computed(() => width.value < 1200),
    isBelowMd: computed(() => width.value < 1024),
  }
}
