<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { APP_NAME, APP_SLOGAN, APP_SUBTITLE, NAV_ITEMS, SCENE_META } from '@/config/constants'
import PatternBackdrop from '@/components/PatternBackdrop.vue'
import FeedbackDialog from '@/components/FeedbackDialog.vue'

/** 平台能力（与首页「核心技术特色」呼应） */
const CAPABILITIES: string[] = [
  '可信非遗知识库检索增强',
  '场景化内容生成',
  '分镜脚本与 AI 视频生成',
  '从知识到多模态作品的一体化链路',
]

const currentYear = new Date().getFullYear()

/** 意见反馈入口（全站页脚可及） */
const feedbackVisible = ref(false)
</script>

<template>
  <footer class="app-footer">
    <PatternBackdrop class="app-footer__texture" variant="cloud" />

    <div class="app-footer__inner u-container">
      <div class="app-footer__grid">
        <section class="app-footer__brand">
          <div class="app-footer__logo">
            <span class="app-footer__mark">遗</span>
            <span class="app-footer__name">{{ APP_NAME }}</span>
          </div>
          <p class="app-footer__slogan">{{ APP_SLOGAN }}</p>
          <p class="app-footer__desc">
            帮助文旅、文化馆与新媒体工作者快速完成非遗资料查询、场景化内容创作，
            以及宣传视频脚本与视频生成。
          </p>
        </section>

        <nav class="app-footer__col" aria-label="功能导航">
          <h3 class="app-footer__col-title">功能导航</h3>
          <ul>
            <li v-for="item in NAV_ITEMS" :key="item.key">
              <RouterLink class="app-footer__link" :to="item.path">
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <nav class="app-footer__col" aria-label="创作场景">
          <h3 class="app-footer__col-title">创作场景</h3>
          <ul>
            <li v-for="scene in SCENE_META" :key="scene.type">
              <RouterLink
                class="app-footer__link"
                :to="{ path: '/creation', query: { scene: scene.type } }"
              >
                {{ scene.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <section class="app-footer__col">
          <h3 class="app-footer__col-title">平台能力</h3>
          <ul>
            <li v-for="item in CAPABILITIES" :key="item" class="app-footer__capability">
              {{ item }}
            </li>
          </ul>
        </section>
      </div>

      <div class="app-footer__bottom">
        <p class="app-footer__copyright">
          © {{ currentYear }} {{ APP_NAME }} · {{ APP_SUBTITLE }}
        </p>
        <p class="app-footer__note">
          当前为前端演示版本，页面中的非遗资料与参考资料均为示例数据，不代表官方认定结论。
          <el-button link type="primary" size="small" @click="feedbackVisible = true">
            意见反馈
          </el-button>
        </p>
      </div>
    </div>

    <FeedbackDialog v-model="feedbackVisible" />
  </footer>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.app-footer {
  position: relative;
  z-index: 1;
  flex: none;
  border-top: 1px solid var(--border-color);
  background: var(--bg-subtle);
  overflow: hidden;

  &__texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    --pattern-opacity: 0.05;
  }

  &__inner {
    position: relative;
    z-index: 1;
    padding-block: var(--sp-12) var(--sp-6);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
    gap: var(--sp-10);

    @include below($bp-xl) {
      grid-template-columns: 1.4fr 1fr 1fr;
    }

    @include below($bp-md) {
      grid-template-columns: 1fr 1fr;
      gap: var(--sp-8) var(--sp-6);
    }

    @include below($bp-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__brand {
    @include below($bp-xl) {
      grid-column: 1 / -1;
    }

    @include below($bp-md) {
      grid-column: 1 / -1;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    color: var(--text-inverse);
    font-family: var(--font-serif);
    font-size: var(--fs-base);
  }

  &__name {
    font-family: var(--font-serif);
    font-size: var(--fs-lg);
    letter-spacing: 2px;
    color: var(--text-primary);
  }

  &__slogan {
    margin-top: var(--sp-4);
    font-family: var(--font-serif);
    font-size: var(--fs-md);
    color: var(--text-primary);
  }

  &__desc {
    margin-top: var(--sp-2);
    max-width: 360px;
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }

  &__col-title {
    margin-bottom: var(--sp-4);
    font-family: var(--font-sans);
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
  }

  &__col ul {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  &__link {
    font-size: var(--fs-sm);
    color: var(--text-secondary);

    &:hover {
      color: var(--color-primary);
    }
  }

  &__capability {
    position: relative;
    padding-left: var(--sp-4);
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 9px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--color-ai);
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-4);
    margin-top: var(--sp-10);
    padding-top: var(--sp-5);
    border-top: 1px solid var(--border-color);

    @include below($bp-md) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-2);
    }
  }

  &__copyright {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }

  &__note {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
  }
}
</style>
