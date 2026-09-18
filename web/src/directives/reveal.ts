import type { Directive } from 'vue'

/**
 * 滚动入场指令：`v-reveal` / `v-reveal="120"`（数值为延迟毫秒）。
 *
 * 实现说明（为什么不用 IntersectionObserver）：
 * IntersectionObserver 只报告"状态发生变化"的元素——如果用户一次性跳到页面底部
 * （锚点跳转、浏览器恢复滚动位置、脚本滚动），中间被"跨过"的区块从没进入过视口，
 * 就永远不会被标记为已显示，页面会留白。这里改用 rAF 节流的滚动检查：
 * 只要元素顶端已越过视口下沿（含"已经被滚过头"的情况）就立即显示。
 * 待显示元素通常不超过 30 个，每帧最多几十次 getBoundingClientRect，开销可忽略，
 * 且全部显示完后会自动摘掉监听。
 *
 * 降级：系统开启"减少动态效果"时直接显示，不做位移与淡入。
 */
type RevealElement = HTMLElement

const pending = new Set<RevealElement>()
let scheduled = false
let listening = false

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function revealVisible(): void {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const threshold = viewportHeight * 0.92

  for (const el of [...pending]) {
    const rect = el.getBoundingClientRect()
    if (rect.top < threshold) {
      el.classList.add('is-revealed')
      pending.delete(el)
    }
  }

  if (pending.size === 0) {
    stopListening()
  }
}

function schedule(): void {
  if (scheduled) {
    return
  }
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    revealVisible()
  })
}

function startListening(): void {
  if (listening) {
    return
  }
  listening = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

function stopListening(): void {
  if (!listening) {
    return
  }
  listening = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
}

export const vReveal: Directive<RevealElement, number | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal')

    const delay = Number(binding.value ?? 0)
    if (delay > 0) {
      el.style.setProperty('--reveal-delay', `${delay}ms`)
    }

    if (prefersReducedMotion()) {
      el.classList.add('is-revealed')
      return
    }

    pending.add(el)
    startListening()
    schedule()
  },
  unmounted(el) {
    pending.delete(el)
    if (pending.size === 0) {
      stopListening()
    }
  },
}

declare module 'vue' {
  export interface GlobalDirectives {
    vReveal: typeof vReveal
  }
}
