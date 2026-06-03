import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { LoginPayload } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const userEmail = ref<string>('')

  const isLoggedIn = computed(() => !!token.value)

  // 启动时恢复已有会话（Supabase 会把 session 存在 localStorage）
  async function restore() {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      token.value = data.session.access_token
      userEmail.value = data.session.user.email || ''
    }
  }

  async function login(payload: LoginPayload) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    })
    if (error) throw error
    token.value = data.session?.access_token || ''
    userEmail.value = data.user?.email || ''
  }

  async function logout() {
    await supabase.auth.signOut()
    token.value = ''
    userEmail.value = ''
  }

  return { token, userEmail, isLoggedIn, login, logout, restore }
})
