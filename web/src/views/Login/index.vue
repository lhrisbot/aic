<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { DEMO_ACCOUNT, PASSWORD_MIN } from '@/config/constants'
import { useUserStore } from '@/stores/user'

/**
 * 登录页。
 * 表单校验交由 el-form 规则处理；提交走 stores/user 的 login 动作（内部调用 api/auth）。
 * 登录成功后回到 redirect 指定的页面（如从非遗详情点 AI 创作被拦截进来的地址）。
 */
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: '',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: PASSWORD_MIN, message: `密码至少 ${PASSWORD_MIN} 位`, trigger: 'blur' },
  ],
}

async function redirectAfterAuth(): Promise<void> {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  await router.replace(redirect)
}

async function handleSubmit(): Promise<void> {
  if (!formRef.value) {
    return
  }
  try {
    await formRef.value.validate()
  } catch {
    // 校验未通过：错误信息已由表单项展示
    return
  }

  const succeed = await userStore.login({
    username: form.username.trim(),
    password: form.password,
  })
  if (succeed) {
    await redirectAfterAuth()
  }
}

/** 一键填入演示账号并提交：让评委不必记账号，同时仍走完整的登录链路 */
async function handleDemoLogin(): Promise<void> {
  form.username = DEMO_ACCOUNT.username
  form.password = DEMO_ACCOUNT.password
  ElMessage.info('已填入演示账号，正在登录…')
  await handleSubmit()
}
</script>

<template>
  <div class="auth-card">
    <h1 class="auth-card__title">登录</h1>
    <p class="auth-card__subtitle">登录后可使用 AI 创作、视频创作与我的作品功能</p>

    <el-form
      ref="formRef"
      class="auth-card__form"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          size="large"
          placeholder="请输入用户名"
          :prefix-icon="User"
          autocomplete="username"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          size="large"
          placeholder="请输入密码"
          :prefix-icon="Lock"
          show-password
          autocomplete="current-password"
          @keyup.enter="handleSubmit"
        />
      </el-form-item>

      <el-button
        type="primary"
        size="large"
        class="auth-card__form-submit"
        :loading="userStore.loading"
        @click="handleSubmit"
      >
        登录
      </el-button>
    </el-form>

    <div class="auth-card__demo">
      <p class="auth-card__demo-text">
        演示账号：<span class="auth-card__demo-code">{{ DEMO_ACCOUNT.username }}</span>
        / <span class="auth-card__demo-code">{{ DEMO_ACCOUNT.password }}</span>
        <br />
        首次体验可直接一键填入并登录。
      </p>

      <div class="auth-card__demo-actions">
        <el-button size="small" :disabled="userStore.loading" @click="handleDemoLogin">
          使用演示账号登录
        </el-button>
      </div>
    </div>

    <p class="auth-card__footer">
      还没有账号？
      <RouterLink class="auth-card__link" to="/register">去注册</RouterLink>
    </p>
    <p class="auth-card__footer">
      <RouterLink class="auth-card__link" to="/">返回首页</RouterLink>
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/auth-card';
</style>
