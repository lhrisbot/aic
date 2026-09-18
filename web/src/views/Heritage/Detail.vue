<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, MagicStick, Refresh } from '@element-plus/icons-vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { fetchHeritageById, fetchHeritages } from '@/api/heritage'
import { APP_NAME } from '@/config/constants'
import type { Heritage } from '@/types/heritage'
import HeritageCard from '@/components/HeritageCard.vue'
import SourceCard from '@/components/SourceCard.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import EmptyState from '@/components/EmptyState.vue'
import HeritageDetailHero from './components/HeritageDetailHero.vue'
import HeritageSection from './components/HeritageSection.vue'
import HeritageToc from './components/HeritageToc.vue'

const route = useRoute()
const router = useRouter()

const heritage = ref<Heritage | null>(null)
const related = ref<Heritage[]>([])
const loading = ref(true)
const failed = ref(false)

const id = computed(() => String(route.params.id ?? ''))

/** 目录与正文板块一一对应 */
const SECTIONS = [
  { id: 'intro', title: '非遗简介' },
  { id: 'history', title: '历史渊源' },
  { id: 'features', title: '艺术特色' },
  { id: 'technique', title: '制作 / 表演技艺' },
  { id: 'culture-value', title: '文化价值' },
  { id: 'stories', title: '相关故事' },
  { id: 'sources', title: '参考资料' },
]

async function load(): Promise<void> {
  loading.value = true
  failed.value = false
  heritage.value = null
  related.value = []

  try {
    const data = await fetchHeritageById(id.value)
    heritage.value = data
    document.title = `${data.name} · ${APP_NAME}`

    // 同类非遗推荐（非必需信息，失败时静默忽略，不影响主内容）
    try {
      const result = await fetchHeritages({ category: data.category, pageSize: 4 })
      related.value = result.list.filter((item) => item.id !== data.id).slice(0, 3)
    } catch {
      related.value = []
    }
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

function goCreation(): void {
  if (!heritage.value) {
    return
  }
  router.push({
    path: '/creation',
    query: { heritageId: heritage.value.id },
  })
}

watch(id, () => void load(), { immediate: true })
</script>

<template>
  <div class="heritage-detail">
    <!-- 加载中 -->
    <template v-if="loading">
      <div class="heritage-detail__band-skeleton" />
      <div class="u-container">
        <div class="heritage-detail__loading">
          <SkeletonBlock variant="text" :rows="2" />
          <SkeletonBlock variant="text" :rows="5" />
        </div>
      </div>
    </template>

    <!-- 加载失败 / 未找到 -->
    <div v-else-if="failed || !heritage" class="u-container">
      <div class="heritage-detail__empty">
        <EmptyState
          title="没有找到这个非遗项目"
          description="该项目可能已下线，或地址中的编号不正确。你可以回到探索页重新选择。"
        >
          <el-button type="primary" @click="router.push('/heritage')">返回非遗探索</el-button>
          <el-button :icon="Refresh" @click="load">重新加载</el-button>
        </EmptyState>
      </div>
    </div>

    <!-- 正文 -->
    <template v-else>
      <nav class="heritage-detail__breadcrumb u-container" aria-label="面包屑">
        <RouterLink class="heritage-detail__crumb-link" to="/heritage">
          <el-icon :size="14"><ArrowLeft /></el-icon>
          非遗探索
        </RouterLink>
        <span class="heritage-detail__crumb-sep">/</span>
        <span class="heritage-detail__crumb-current">{{ heritage.name }}</span>
      </nav>

      <HeritageDetailHero :heritage="heritage" />

      <div class="u-container">
        <div class="heritage-detail__body">
          <aside class="heritage-detail__aside">
            <HeritageToc :items="SECTIONS" />
          </aside>

          <main class="heritage-detail__main">
            <HeritageSection id="intro" title="非遗简介" :index="1">
              <p>{{ heritage.summary }}</p>
              <p class="heritage-detail__extra">
                {{ heritage.name }}属于{{ heritage.category }}类，主要流布地区为{{
                  heritage.region
                }}<template v-if="heritage.level">，已列入{{ heritage.level }}非物质文化遗产代表性项目名录</template>。
              </p>
            </HeritageSection>

            <HeritageSection id="history" title="历史渊源" :index="2">
              <p>{{ heritage.history }}</p>
            </HeritageSection>

            <HeritageSection id="features" title="艺术特色" :index="3">
              <p>{{ heritage.features }}</p>
            </HeritageSection>

            <HeritageSection id="technique" title="制作 / 表演技艺" :index="4">
              <p>{{ heritage.technique }}</p>
            </HeritageSection>

            <HeritageSection id="culture-value" title="文化价值" :index="5">
              <p>{{ heritage.cultureValue }}</p>
            </HeritageSection>

            <HeritageSection id="stories" title="相关故事" :index="6">
              <div class="heritage-detail__stories">
                <article
                  v-for="(story, index) in heritage.stories ?? []"
                  :key="story.title"
                  class="heritage-detail__story"
                >
                  <span class="heritage-detail__story-no">
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <h3 class="heritage-detail__story-title">{{ story.title }}</h3>
                  <p class="heritage-detail__story-text">{{ story.content }}</p>
                </article>

                <p v-if="!heritage.stories?.length" class="heritage-detail__empty-text">
                  该项目暂未收录相关故事。
                </p>
              </div>
            </HeritageSection>

            <HeritageSection id="sources" title="参考资料" :index="7">
              <p class="heritage-detail__sources-note">
                以下资料来自非遗知识库检索结果，本次共命中
                <strong>{{ heritage.sources.length }}</strong>
                条，AI 创作时会以此为事实依据，并标注来源与相关度。
              </p>

              <div class="heritage-detail__sources">
                <SourceCard
                  v-for="(source, index) in heritage.sources"
                  :key="source.id"
                  :source="source"
                  :index="index + 1"
                />
              </div>
            </HeritageSection>

            <!-- 正文底部主 CTA -->
            <section class="heritage-detail__cta">
              <div class="heritage-detail__cta-text">
                <p class="heritage-detail__cta-eyebrow">下一步</p>
                <h2 class="heritage-detail__cta-title">使用该非遗进行 AI 创作</h2>
                <p class="heritage-detail__cta-desc">
                  带着{{ heritage.name }}的
                  {{ heritage.sources.length }}
                  条可信资料进入创作页，生成文旅推文、短视频脚本、直播话术或文创包装文案。
                </p>
              </div>

              <el-button type="primary" size="large" :icon="MagicStick" @click="goCreation">
                使用该非遗进行 AI 创作
              </el-button>
            </section>

            <!-- 同类非遗推荐 -->
            <section v-if="related.length" class="heritage-detail__related">
              <div class="heritage-detail__related-head">
                <h2 class="heritage-detail__related-title">同类非遗</h2>
                <RouterLink class="heritage-detail__related-more" to="/heritage">
                  查看全部
                  <el-icon :size="14"><ArrowRight /></el-icon>
                </RouterLink>
              </div>

              <div class="heritage-detail__related-grid">
                <HeritageCard
                  v-for="(item, index) in related"
                  :key="item.id"
                  v-reveal="index * 70"
                  :heritage="item"
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.heritage-detail {
  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    padding-block: var(--sp-6);
    font-size: var(--fs-sm);
    color: var(--text-tertiary);
  }

  &__crumb-link {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    color: var(--text-secondary);

    &:hover {
      color: var(--color-primary);
    }
  }

  &__crumb-current {
    color: var(--text-primary);
  }

  &__band-skeleton {
    height: 320px;
    background: var(--bg-subtle);
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: var(--sp-8);
    max-width: 860px;
    padding-block: var(--sp-12);
  }

  &__empty {
    padding-block: var(--sp-16);
  }

  &__body {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: var(--sp-12);
    padding-block: var(--sp-12) var(--sp-8);

    @include below($bp-xl) {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--sp-8);
    }

    @include below($bp-lg) {
      padding-block: var(--sp-8);
    }
  }

  &__aside {
    @include below($bp-xl) {
      display: none;
    }
  }

  &__main {
    min-width: 0;
    max-width: 860px;
  }

  &__extra {
    margin-top: var(--sp-4);
    color: var(--text-tertiary);
    font-size: var(--fs-sm);
  }

  &__stories {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp-5);

    @include below($bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__story {
    padding: var(--sp-5);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    box-shadow: var(--shadow-xs);
  }

  &__story-no {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--color-primary);
  }

  &__story-title {
    margin-top: var(--sp-2);
    margin-bottom: var(--sp-3);
    font-size: var(--fs-md);
  }

  &__story-text {
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__empty-text {
    font-size: var(--fs-sm);
    color: var(--text-tertiary);
  }

  &__sources-note {
    margin-bottom: var(--sp-5);
    font-size: var(--fs-sm);
    color: var(--text-tertiary);

    strong {
      color: var(--color-ai);
      font-family: var(--font-serif);
    }
  }

  &__sources {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-8);
    margin-top: var(--sp-12);
    padding: var(--sp-8) var(--sp-10);
    background:
      radial-gradient(100% 120% at 6% 10%, var(--color-primary-soft), transparent 60%),
      var(--bg-card);
    border: 1px solid var(--color-primary-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);

    @include below($bp-lg) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-6);
      padding: var(--sp-6);
    }
  }

  &__cta-eyebrow {
    font-size: var(--fs-xs);
    letter-spacing: 2px;
    color: var(--color-primary);
  }

  &__cta-title {
    margin-top: var(--sp-2);
    font-size: var(--fs-2xl);
  }

  &__cta-desc {
    margin-top: var(--sp-3);
    max-width: 560px;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__related {
    margin-top: var(--sp-16);
    padding-top: var(--sp-10);
    border-top: 1px dashed var(--border-color);
  }

  &__related-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sp-4);
    margin-bottom: var(--sp-6);
  }

  &__related-title {
    font-size: var(--fs-xl);
  }

  &__related-more {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-1);
    font-size: var(--fs-sm);
    color: var(--color-primary);
  }

  &__related-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--sp-6);

    @include below($bp-lg) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include below($bp-md) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
