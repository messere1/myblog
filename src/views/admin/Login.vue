<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
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
    errorMsg.value = e?.message || '登录失败，请检查邮箱密码'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="seal">墨</div>
      <h2 class="title">后台登录</h2>
      <p class="subtitle">墨笺 · 管理</p>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>邮箱</label>
          <input v-model="form.email" type="email" autocomplete="username" placeholder="请输入邮箱" />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="form.password" type="password" autocomplete="current-password" placeholder="请输入密码" />
        </div>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <button type="submit" :disabled="loading" class="submit">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <p class="hint">使用 Supabase 后台创建的账号登录</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: $bg;
  padding: 16px;
}
.login-card {
  width: 100%;
  max-width: 380px;
  padding: 40px 32px;
  background: $card;
  border-radius: $radius-card;
  border: 1px solid $line;
  text-align: center;

  .seal {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border: 2px solid $dai;
    border-radius: 4px;
    font-family: $serif;
    font-size: 24px;
    font-weight: 700;
    color: $dai;
    margin-bottom: 16px;
  }
  .title {
    margin: 0 0 4px;
    font-family: $serif;
    font-size: 22px;
    color: $ink;
  }
  .subtitle {
    margin: 0 0 28px;
    font-size: 13px;
    color: $ink-faint;
    letter-spacing: 0.15em;
  }

  .field {
    margin-bottom: 16px;
    text-align: left;
    label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      color: $ink-soft;
    }
    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid $line;
      border-radius: $radius;
      background: $bg;
      color: $ink;
      box-sizing: border-box;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      &:focus { border-color: $dai; }
      &::placeholder { color: $ink-faint; }
    }
  }
  .error { color: $danger; font-size: 13px; margin: 8px 0; }
  .submit {
    width: 100%;
    padding: 12px;
    background: $dai;
    color: $card;
    border: none;
    border-radius: $radius;
    font-size: 15px;
    font-family: $serif;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s;
    &:disabled { opacity: .6; cursor: not-allowed; }
    &:hover:not(:disabled) { background: $dai-deep; }
  }
  .hint {
    margin-top: 20px;
    font-size: 12px;
    color: $ink-faint;
  }
}

html.dark {
  .login-page { background: #1a1916; }
  .login-card {
    background: #242220;
    border-color: #3a3630;
    .seal { border-color: #4a6b5c; color: #7d9471; }
    .title { color: #d4cfc4; }
    .subtitle { color: #6a6458; }
    .field {
      label { color: #9a9488; }
      input { background: #1a1916; border-color: #3a3630; color: #d4cfc4; &::placeholder { color: #6a6458; } &:focus { border-color: #4a6b5c; } }
    }
    .submit { background: #3a5c4c; &:hover:not(:disabled) { background: #2e4a3c; } }
    .hint { color: #6a6458; }
  }
}
</style>
