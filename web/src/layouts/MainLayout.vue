<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import PatternBackdrop from '@/components/PatternBackdrop.vue'
</script>

<template>
  <div class="main-layout">
    <PatternBackdrop class="main-layout__texture" variant="grid" />
    <AppHeader />
    <main class="main-layout__main">
      <RouterView v-slot="{ Component }">
        <Transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

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
    padding-bottom: var(--sp-24);
  }
}
</style>
