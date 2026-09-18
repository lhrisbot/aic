<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  Collection,
  Menu,
  SwitchButton,
  User,
} from '@element-plus/icons-vue'
import { APP_NAME, APP_SUBTITLE, NAV_ITEMS } from '@/config/constants'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

/** 滚动后为导航栏加上描边与阴影，避免与内容粘连 */
const scrolled = ref(false)
/** 移动端抽屉 */
const drawerVisible = ref(false)
/** 个人中心弹窗 */
const profileVisible = ref(false)

/** 当前高亮的导航项（详情页也高亮所属主菜单） */
const activeMenu = computed(() => route.meta.activeMenu ?? '')

function handleScroll(): void {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

function closeDrawer(): void {
  drawerVisible.value = false
}

/** 未登录时点击需登录的入口，先带 redirect 去登录页 */
function goLogin(): void {
  closeDrawer()
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

function goRegister(): void {
  closeDrawer()
  router.push({ path: '/register' })
}

function goWorks(): void {
  closeDrawer()
  profileVisible.value = false
  router.push('/works')
}

function openProfile(): void {
  closeDrawer()
  profileVisible.value = true
}

async function handleLogout(): Promise<void> {
  try {
    await ElMessageBox.confirm(
      '退出后需要重新登录才能使用创作与作品功能，确认退出登录吗？',
      '退出登录',
      {
        confirmButtonText: '确认退出',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
  } catch {
    return
  }

  userStore.logout()
  profileVisible.value = false
  drawerVisible.value = false
  ElMessage.success('已退出登录')

  if (route.meta.requiresAuth) {
    router.push('/')
  }
}

function handleCommand(command: string | number | object): void {
  switch (String(command)) {
    case 'works':
      goWorks()
      break
    case 'profile':
      openProfile()
      break
    case 'logout':
      void handleLogout()
      break
    default:
      break
  }
}
</script>

<template>
  <header class="app-header" :class="{ 'is-scrolled': scrolled }">
    <div class="app-header__inner u-container">
      <RouterLink to="/" class="app-header__brand" @click="closeDrawer">
        <span class="app-header__mark">遗</span>
        <span class="app-header__brand-text">
          <strong>{{ APP_NAME }}</strong>
          <em>{{ APP_SUBTITLE }}</em>
        </span>
      </RouterLink>

      <nav class="app-header__nav" aria-label="主导航">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.key"
          :to="item.path"
          class="app-header__link"
          :class="{ 'is-active': activeMenu === item.key }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="app-header__actions">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown trigger="click" @command="handleCommand">
            <button class="user-trigger" type="button">
              <el-avatar
                :size="30"
                :src="userStore.user?.avatar"
                class="user-trigger__avatar"
              >
                {{ userStore.avatarText }}
              </el-avatar>
              <span class="user-trigger__name">{{ userStore.displayName }}</span>
              <el-icon class="user-trigger__arrow"><ArrowDown /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="works" :icon="Collection">
                  我的作品
                </el-dropdown-item>
                <el-dropdown-item command="profile" :icon="User">
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton" divided>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

        <template v-else>
          <el-button text @click="goLogin">登录</el-button>
          <el-button type="primary" @click="goRegister">注册</el-button>
        </template>
      </div>

      <button
        class="app-header__menu-btn"
        type="button"
        aria-label="打开导航菜单"
        @click="drawerVisible = true"
      >
        <el-icon :size="20"><Menu /></el-icon>
      </button>
    </div>
  </header>

  <!-- 移动端导航抽屉 -->
  <el-drawer v-model="drawerVisible" direction="rtl" size="280px" :with-header="false">
    <div class="drawer">
      <div class="drawer__brand">
        <span class="app-header__mark">遗</span>
        <span class="app-header__brand-text">
          <strong>{{ APP_NAME }}</strong>
          <em>{{ APP_SUBTITLE }}</em>
        </span>
      </div>

      <nav class="drawer__nav" aria-label="移动端主导航">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.key"
          :to="item.path"
          class="drawer__link"
          :class="{ 'is-active': activeMenu === item.key }"
          @click="closeDrawer"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="drawer__footer">
        <template v-if="userStore.isLoggedIn">
          <div class="drawer__user">
            <el-avatar :size="34" :src="userStore.user?.avatar">
              {{ userStore.avatarText }}
            </el-avatar>
            <span class="drawer__user-name">{{ userStore.displayName }}</span>
          </div>
          <el-button class="drawer__btn" @click="goWorks">我的作品</el-button>
          <el-button class="drawer__btn" @click="openProfile">个人中心</el-button>
          <el-button class="drawer__btn" type="primary" plain @click="handleLogout">
            退出登录
          </el-button>
        </template>

        <template v-else>
          <el-button class="drawer__btn" @click="goLogin">登录</el-button>
          <el-button class="drawer__btn" type="primary" @click="goRegister">注册</el-button>
        </template>
      </div>
    </div>
  </el-drawer>

  <!-- 个人中心（当前以弹窗承载；如需独立页面，仅需补充路由并改为跳转） -->
  <el-dialog v-model="profileVisible" title="个人信息" width="400px" align-center>
    <div class="profile">
      <el-avatar :size="56" :src="userStore.user?.avatar" class="profile__avatar">
        {{ userStore.avatarText }}
      </el-avatar>
      <p class="profile__name">{{ userStore.displayName }}</p>
      <p class="profile__email">{{ userStore.user?.email || '未填写邮箱' }}</p>
      <p class="profile__bio">
        {{ userStore.user?.bio || '还没有填写个人简介' }}
      </p>
    </div>

    <template #footer>
      <div class="profile__actions">
        <el-button @click="goWorks">查看我的作品</el-button>
        <el-button type="primary" plain @click="handleLogout">退出登录</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--bg-header);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out);

  &.is-scrolled {
    border-bottom-color: var(--border-color);
    box-shadow: var(--shadow-sm);
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: var(--sp-6);
    height: 100%;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-3);
    flex: none;
  }

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: var(--radius-sm);
    background: var(--color-primary);
    color: var(--text-inverse);
    font-family: var(--font-serif);
    font-size: var(--fs-md);
  }

  &__brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;

    strong {
      font-family: var(--font-serif);
      font-size: var(--fs-md);
      font-weight: var(--fw-semibold);
      letter-spacing: 2px;
      color: var(--text-primary);
    }

    em {
      font-size: 11px;
      font-style: normal;
      color: var(--text-tertiary);
      letter-spacing: 0.5px;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    margin-left: var(--sp-6);

    @include below($bp-lg) {
      display: none;
    }
  }

  &__link {
    position: relative;
    padding: 7px 14px;
    border-radius: var(--radius-pill);
    font-size: var(--fs-base);
    color: var(--text-secondary);
    transition: color var(--duration) var(--ease-out),
      background-color var(--duration) var(--ease-out);

    &:hover {
      color: var(--text-primary);
      background: var(--bg-subtle);
    }

    &.is-active {
      color: var(--color-primary);
      background: var(--color-primary-soft);
      font-weight: var(--fw-medium);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-left: auto;

    @include below($bp-lg) {
      display: none;
    }
  }

  &__menu-btn {
    display: none;
    margin-left: auto;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    color: var(--text-secondary);
    cursor: pointer;

    @include below($bp-lg) {
      display: inline-flex;
    }
  }
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 4px 10px 4px 4px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  background: var(--bg-card);
  cursor: pointer;
  transition: border-color var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out);

  &:hover {
    border-color: var(--border-color-strong);
    box-shadow: var(--shadow-xs);
  }

  &__avatar {
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-family: var(--font-serif);
  }

  &__name {
    max-width: 96px;
    font-size: var(--fs-base);
    color: var(--text-primary);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__arrow {
    color: var(--text-tertiary);
    font-size: 12px;
  }
}

/* ---------- 移动端抽屉 ---------- */
.drawer {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
  height: 100%;

  &__brand {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  &__link {
    padding: 10px 14px;
    border-radius: var(--radius);
    color: var(--text-secondary);

    &.is-active {
      background: var(--color-primary-soft);
      color: var(--color-primary);
      font-weight: var(--fw-medium);
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    margin-top: auto;
    padding-top: var(--sp-5);
    border-top: 1px solid var(--border-color);
  }

  &__user {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  &__user-name {
    font-size: var(--fs-md);
    color: var(--text-primary);
  }

  &__btn {
    width: 100%;
    margin-left: 0 !important;
  }
}

/* ---------- 个人中心 ---------- */
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) 0 var(--sp-4);

  &__avatar {
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-family: var(--font-serif);
    font-size: var(--fs-xl);
  }

  &__name {
    font-family: var(--font-serif);
    font-size: var(--fs-lg);
    color: var(--text-primary);
  }

  &__email {
    font-size: var(--fs-sm);
    color: var(--text-tertiary);
  }

  &__bio {
    margin-top: var(--sp-2);
    padding: var(--sp-3) var(--sp-4);
    width: 100%;
    border-radius: var(--radius);
    background: var(--bg-subtle);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    text-align: center;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: var(--sp-2);
  }
}
</style>
