<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchHeritages } from '@/api/heritage'
import type { Heritage } from '@/types/heritage'

/**
 * 非遗词条走马灯。
 * 作用有两个：一是把"知识库有 12 个项目"这件事可视化，二是给首页中段增加横向动感，
 * 避免各分区都是"标题 + 卡片"的同一节奏。
 * 悬停暂停（便于点击进入详情），系统开启"减少动态效果"时退化为可手动横向滚动。
 */
const items = ref<Heritage[]>([])

onMounted(async () => {
  try {
    const page = await fetchHeritages({ page: 1, pageSize: 100 })
    items.value = page.list
  } catch {
    items.value = []
  }
})
</script>

<template>
  <section v-if="items.length" class="marquee" aria-label="非遗知识库项目">
    <div class="marquee__track">
      <ul v-for="copy in 2" :key="copy" class="marquee__list" :aria-hidden="copy === 2">
        <li v-for="item in items" :key="`${copy}-${item.id}`" class="marquee__item">
          <RouterLink class="marquee__link" :to="`/heritage/${item.id}`">
            <span class="marquee__name">{{ item.name }}</span>
            <span class="marquee__meta">{{ item.region }} · {{ item.category }}</span>
          </RouterLink>
          <i class="marquee__dot" aria-hidden="true" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.marquee {
  position: relative;
  overflow: hidden;
  padding-block: var(--sp-5);
  border-block: 1px solid var(--border-color);
  background: var(--bg-card);
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 6%,
    #000 94%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 6%,
    #000 94%,
    transparent 100%
  );

  &__track {
    display: flex;
    width: max-content;
    animation: marquee-scroll 52s linear infinite;
  }

  &:hover &__track {
    animation-play-state: paused;
  }

  &__list {
    display: flex;
    align-items: center;
    flex: none;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-6);
    padding-inline: var(--sp-6);
  }

  &__link {
    display: inline-flex;
    align-items: baseline;
    gap: var(--sp-3);
    white-space: nowrap;

    &:hover .marquee__name {
      color: var(--color-primary);
    }
  }

  &__name {
    font-family: var(--font-serif);
    font-size: var(--fs-lg);
    color: var(--text-primary);
    transition: color var(--duration) var(--ease-out);
  }

  &__meta {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }

  &__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary);
    opacity: 0.35;
  }

  @include reduced-motion {
    overflow-x: auto;
    mask-image: none;
    -webkit-mask-image: none;

    .marquee__track {
      animation: none;
    }
  }
}
</style>
