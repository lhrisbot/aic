<script setup lang="ts">
import SectionTitle from '@/components/SectionTitle.vue'
import WorkflowSteps from '@/components/WorkflowSteps.vue'
import PatternBackdrop from '@/components/PatternBackdrop.vue'
import type { WorkflowStep } from '@/types/ui'

/** 产品工作流（提示词指定五步） */
const STEPS: WorkflowStep[] = [
  { title: '寻找非遗', desc: '在非遗知识库中检索项目资料，查看每条资料的来源与相关度。' },
  { title: '选择场景', desc: '文旅推文、短视频脚本、直播话术或文创包装，按传播目标选择。' },
  { title: 'AI 智能创作', desc: '基于检索到的可信资料生成内容，而不是凭空续写。' },
  { title: '人工优化', desc: '在结果区直接编辑，补充本地信息与个人表达。' },
  { title: '视频生成', desc: '由文案得到分镜脚本，再逐镜生成并合成宣传视频。' },
]
</script>

<template>
  <section class="workflow-section">
    <PatternBackdrop class="workflow-section__texture" variant="fret" />

    <div class="workflow-section__inner u-container">
      <SectionTitle
        eyebrow="产品工作流"
        title="从查资料到宣传视频，五步完成"
        subtitle="每一步都围绕可信资料展开，AI 生成的结果随时可以人工修改。"
      />

      <WorkflowSteps :steps="STEPS" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.workflow-section {
  position: relative;
  padding-block: var(--sp-16);
  background: var(--bg-subtle);
  border-block: 1px solid var(--border-color);

  &__texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    --pattern-opacity: 0.04;
  }

  &__inner {
    position: relative;
    z-index: 1;
  }
}
</style>
