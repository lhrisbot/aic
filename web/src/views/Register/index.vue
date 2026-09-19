<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { type FormInstance, type FormRules } from 'element-plus'
import { Lock, Message, User } from '@element-plus/icons-vue'
import { PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN } from '@/config/constants'
import { useUserStore } from '@/stores/user'

/**
 * 注册页。
 * 字段：用户名、邮箱、密码、确认密码；校验包含长度、邮箱格式与两次密码一致性。
 * 注册成功后自动进入登录态（与后端约定一致的便捷处理）。
 */
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

function validateConfirm(
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
): void {
  if (!value) {
    callback(new Error('请再次输入密码'))
    return
  }
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
    return
  }
  callback()
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: USERNAME_MIN,
      max: USERNAME_MAX,
      message: `用户名长度 ${USERNAME_MIN}-${USERNAME_MAX} 个字符`,
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: PASSWORD_MIN, message: `密码至少 ${PASSWORD_MIN} 位`, trigger: 'blur' },
  ],
  confirmPassword: [{ validator: validateConfirm, trigger: 'blur' }],
}

async function handleSubmit(): Promise<void> {
  if (!formRef.value) {
    return
  }
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const succeed = await userStore.register({
    username: form.username.trim(),
    email: form.email.trim(),
    password: form.password,
    confirmPassword: form.confirmPassword,
  })

  if (succeed) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  }
}
</script>

<template>
  <div class="auth-card">
    <h1 class="auth-card__title">注册</h1>
    <p class="auth-card__subtitle">创建账号后即可保存创作与视频作品</p>

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
          placeholder="2-20 个字符"
          :prefix-icon="User"
          autocomplete="username"
        />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          size="large"
          placeholder="用于账号联系"
          :prefix-icon="Message"
          autocomplete="email"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          size="large"
          :placeholder="`至少 ${PASSWORD_MIN} 位`"
          :prefix-icon="Lock"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          size="large"
          placeholder="请再次输入密码"
          :prefix-icon="Lock"
          show-password
          autocomplete="new-password"
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
        注册并登录
      </el-button>
    </el-form>

    <p class="auth-card__footer">
      已有账号？
      <RouterLink class="auth-card__link" to="/login">去登录</RouterLink>
    </p>
    <p class="auth-card__footer">
      <RouterLink class="auth-card__link" to="/">返回首页</RouterLink>
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/auth-card';
</style>
