<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import type { Source } from '@/types/heritage'

/**
 * AI 结果渲染。
 * html: false —— 不解析原始 HTML，避免生成内容里的标签被当作 DOM 注入；
 * linkify: true —— 自动识别正文中的链接；
 * breaks: true  —— 单个换行即换行，符合中文文案的书写习惯。
 */
const props = defineProps<{
  content: string
  sources?: Source[]
}>()

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const html = computed(() => {
  const content = props.content || ''
  const linked = props.sources?.length
    ? content.replace(/\[(\d+)\](?!\()/g, (match, value: string) => {
        const source = props.sources?.[Number(value) - 1]
        return source ? `[${value}](#source-${encodeURIComponent(source.id)})` : match
      })
    : content
  return md.render(linked)
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- 内容已通过 markdown-it 关闭 html 解析并转义 -->
  <div class="markdown-body" v-html="html" />
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.markdown-body {
  font-size: var(--fs-md);
  line-height: var(--lh-relaxed);
  color: var(--text-primary);

  :deep(> *:first-child) {
    margin-top: 0;
  }

  :deep(h1) {
    margin: var(--sp-8) 0 var(--sp-5);
    font-size: var(--fs-2xl);
    line-height: 1.4;
  }

  :deep(h2) {
    position: relative;
    margin: var(--sp-8) 0 var(--sp-4);
    padding-left: var(--sp-4);
    font-size: var(--fs-xl);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.35em;
      width: 3px;
      height: 1em;
      border-radius: var(--radius-pill);
      background: var(--color-primary);
    }
  }

  :deep(h3) {
    margin: var(--sp-6) 0 var(--sp-3);
    font-size: var(--fs-lg);
  }

  :deep(h4) {
    margin: var(--sp-5) 0 var(--sp-2);
    font-size: var(--fs-md);
  }

  :deep(p) {
    margin: var(--sp-4) 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: var(--sp-4) 0;
    padding-left: var(--sp-6);
  }

  :deep(ul) {
    list-style: none;
  }

  :deep(ul > li) {
    position: relative;
    padding-left: var(--sp-4);
    margin: var(--sp-2) 0;
  }

  :deep(ul > li::before) {
    content: '';
    position: absolute;
    left: 0;
    top: 0.75em;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-ai);
    opacity: 0.7;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(ol > li) {
    margin: var(--sp-2) 0;
    padding-left: var(--sp-1);
  }

  :deep(ol > li::marker) {
    color: var(--color-primary);
    font-family: var(--font-mono);
  }

  :deep(strong) {
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
  }

  :deep(blockquote) {
    margin: var(--sp-5) 0;
    padding: var(--sp-4) var(--sp-5);
    border-left: 3px solid var(--color-ai);
    border-radius: 0 var(--radius) var(--radius) 0;
    background: var(--color-ai-soft);
    color: var(--text-secondary);

    p {
      margin: 0;
    }
  }

  :deep(code) {
    padding: 2px 6px;
    border-radius: var(--radius-xs);
    background: var(--bg-subtle);
    font-family: var(--font-mono);
    font-size: 0.9em;
    color: var(--color-ai);
  }

  :deep(pre) {
    margin: var(--sp-5) 0;
    padding: var(--sp-5);
    overflow-x: auto;
    border-radius: var(--radius);
    background: #232220;

    code {
      padding: 0;
      background: transparent;
      color: #f3efe8;
    }
  }

  :deep(table) {
    width: 100%;
    margin: var(--sp-5) 0;
    border-collapse: collapse;
    font-size: var(--fs-sm);
  }

  :deep(th),
  :deep(td) {
    padding: var(--sp-3) var(--sp-4);
    border: 1px solid var(--border-color);
    text-align: left;
    vertical-align: top;
  }

  :deep(th) {
    background: var(--bg-subtle);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
    white-space: nowrap;
  }

  :deep(td) {
    color: var(--text-secondary);
  }

  :deep(hr) {
    margin: var(--sp-8) 0;
    border: none;
    border-top: 1px dashed var(--border-color);
  }

  :deep(a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @include below($bp-md) {
    font-size: var(--fs-base);
  }
}
</style>
