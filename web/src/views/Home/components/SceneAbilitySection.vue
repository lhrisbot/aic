<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'
import SceneAbilityCard from '@/components/SceneAbilityCard.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { SCENE_META } from '@/config/constants'
</script>

<template>
  <section class="scene-ability">
    <div class="u-container">
      <SectionTitle
        eyebrow="场景能力"
        title="一个非遗项目，多种传播方式"
        subtitle="同一个非遗项目，可以生成不同平台、不同场景需要的内容，让宣传素材一次成型。"
      >
        <template #extra>
          <RouterLink class="scene-ability__more" to="/creation">
            进入 AI 创作
            <el-icon :size="14"><ArrowRight /></el-icon>
          </RouterLink>
        </template>
      </SectionTitle>

      <div class="scene-ability__grid">
        <SceneAbilityCard
          v-for="(scene, index) in SCENE_META"
          :key="scene.type"
          :scene="scene"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.scene-ability {
  padding-block: var(--sp-16);

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--sp-6);

    @include below($bp-xl) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include below($bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__more {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    font-size: var(--fs-sm);
    color: var(--color-primary);
    transition: gap var(--duration) var(--ease-out);

    &:hover {
      gap: var(--sp-2);
    }
  }
}
</style>
