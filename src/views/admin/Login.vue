<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: 'admin@blog.com',
  password: '123456',
})

const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!form.email || !form.password) {
    errorMsg.value = '邮箱和密码不能为空'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(form)
    const redirect = (route.query.redirect as string) || '/admin/dashboard'
    router.replace(redirect)
  } catch (e: any) {
    errorMsg.value = e.response?.data || '登录失败，请检查邮箱密码'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">后台登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>邮箱</label>
          <input v-model="form.email" type="email" autocomplete="username" />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="form.password" type="password" autocomplete="current-password" />
        </div>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <button type="submit" :disabled="loading" class="submit">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <p class="hint">测试账号：admin@blog.com / 123456</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f5f7fa, #e8ecf3);
  padding: 16px;
}
.login-card {
  width: 100%;
  max-width: 380px;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  .title { margin: 0 0 24px; text-align: center; }
  .field {
    margin-bottom: 16px;
    label { display: block; margin-bottom: 6px; font-size: 14px; color: #555; }
    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 14px;
      &:focus { outline: none; border-color: #4a90e2; }
    }
  }
  .error { color: #e74c3c; font-size: 13px; margin: 8px 0; }
  .submit {
    width: 100%;
    padding: 12px;
    background: #4a90e2;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
    margin-top: 8px;
    &:disabled { opacity: .6; cursor: not-allowed; }
    &:hover:not(:disabled) { background: #3a7bc8; }
  }
  .hint {
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
}
</style>
