<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import PatternBackdrop from '@/components/PatternBackdrop.vue'

const route = useRoute()
const layout = computed(() => String(route.meta.layout ?? 'public'))
const layoutClass = computed(() => `is-${layout.value}`)
const showFooter = computed(() => !['studio', 'production'].includes(layout.value))
</script>

<template>
  <div class="main-layout" :class="layoutClass">
    <PatternBackdrop class="main-layout__texture" variant="grid" />
    <AppHeader />
    <main class="main-layout__main">
      <RouterView v-slot="{ Component, route: viewRoute }">
        <Transition :name="String(viewRoute.meta.transition ?? 'page')" mode="default">
          <div :key="viewRoute.path" class="main-layout__page">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);
  transition: background-color var(--duration-slow) var(--ease-out);

  &__texture {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  &__main {
    position: relative;
    z-index: 1;
    flex: 1 0 auto;
    min-height: calc(100vh - var(--header-height));
    padding-bottom: var(--sp-24);
    overflow: hidden;
  }

  &__page {
    position: relative;
    min-height: calc(100vh - var(--header-height));
  }

  &.is-discovery {
    --pattern-opacity: 0.022;
  }

  &.is-editorial {
    background: linear-gradient(180deg, #f7f2ea 0%, var(--bg-page) 360px);
  }

  &.is-studio {
    background:
      radial-gradient(900px 420px at 52% 0%, rgba(63, 107, 115, 0.08), transparent 72%),
      var(--bg-page);
  }

  &.is-production {
    background:
      radial-gradient(820px 380px at 82% 0%, rgba(192, 80, 60, 0.1), transparent 72%),
      var(--bg-page);
  }

  &.is-studio,
  &.is-production {
    .main-layout__main {
      padding-bottom: var(--sp-12);
    }
  }
}
</style>
