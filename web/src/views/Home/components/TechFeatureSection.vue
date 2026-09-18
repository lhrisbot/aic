<script setup lang="ts">
import { Film, MagicStick, Reading } from '@element-plus/icons-vue'
import FeatureCard from '@/components/FeatureCard.vue'
import SectionTitle from '@/components/SectionTitle.vue'

/** 三项核心技术特色（提示词指定） */
const FEATURES = [
  {
    title: '可信知识',
    description: '基于非遗知识库进行检索增强生成，降低事实错误。',
    icon: Reading,
    tone: 'ai' as const,
    points: ['先检索、再生成，内容有出处可查', '每条结果标注资料来源与相关度'],
  },
  {
    title: '场景化创作',
    description: '针对公众号、直播、短视频、文创等场景进行针对性生成。',
    icon: MagicStick,
    tone: 'primary' as const,
    points: ['按平台、人群与语气调整结构', '同一项目可产出多套场景文案'],
  },
  {
    title: '多模态生成',
    description: '从文化知识到文案、脚本、分镜和视频的一体化创作。',
    icon: Film,
    tone: 'ai' as const,
    points: ['文案可直接转为分镜脚本', '分镜逐镜生成并合成宣传视频'],
  },
]
</script>

<template>
  <section class="tech-feature">
    <div class="u-container">
      <SectionTitle
        eyebrow="核心技术特色"
        title="让 AI 少编，让内容可用"
        subtitle="区别于普通 AI 写作工具：内容来自非遗知识库的检索结果，而不是模型的自由发挥。"
      />

      <div class="tech-feature__grid">
        <FeatureCard
          v-for="feature in FEATURES"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          :points="feature.points"
          :tone="feature.tone"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.tech-feature {
  padding-block: var(--sp-16);

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--sp-6);

    @include below($bp-lg) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
