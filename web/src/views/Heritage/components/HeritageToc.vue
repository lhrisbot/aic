<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 详情页目录（滚动跟随）。
 * - 点击平滑滚动到对应板块，并自动扣掉吸顶导航的高度；
 * - 使用 IntersectionObserver 高亮当前板块，浏览器不支持时静默降级为不高亮。
 */
const props = defineProps<{
  items: Array<{ id: string; title: string }>
}>()

const activeId = ref(props.items[0]?.id ?? '')
let observer: IntersectionObserver | null = null

function jumpTo(id: string): void {
  const target = document.getElementById(id)
  if (!target) {
    return
  }
  const headerOffset = 88
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
  window.scrollTo({ top, behavior: 'smooth' })
  activeId.value = id
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      const first = visible[0]
      if (first?.target.id) {
        activeId.value = first.target.id
      }
    },
    { rootMargin: '-96px 0px -62% 0px' },
  )

  props.items.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) {
      observer?.observe(element)
    }
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <nav class="detail-toc" aria-label="本页目录">
    <p class="detail-toc__title">目录</p>
    <ul class="detail-toc__list">
      <li v-for="item in items" :key="item.id">
        <a
          class="detail-toc__link"
          :class="{ 'is-active': activeId === item.id }"
          :href="`#${item.id}`"
          @click.prevent="jumpTo(item.id)"
        >
          {{ item.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.detail-toc {
  position: sticky;
  top: calc(var(--header-height) + var(--sp-6));

  &__title {
    margin-bottom: var(--sp-4);
    font-size: var(--fs-xs);
    letter-spacing: 2px;
    color: var(--text-tertiary);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-left: 1px solid var(--border-color);
  }

  &__link {
    display: block;
    padding: 6px 0 6px var(--sp-4);
    margin-left: -1px;
    border-left: 2px solid transparent;
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    transition: color var(--duration) var(--ease-out),
      border-color var(--duration) var(--ease-out);

    &:hover {
      color: var(--text-primary);
    }

    &.is-active {
      border-left-color: var(--color-primary);
      color: var(--color-primary);
      font-weight: var(--fw-medium);
    }
  }
}
</style>
