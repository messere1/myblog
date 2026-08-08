import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import type { LoginPayload } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const userEmail = ref<string>('')
  const initialized = ref(false)
  let restorePromise: Promise<void> | null = null

  const isLoggedIn = computed(() => !!token.value)

  function applySession(session: Session | null) {
    token.value = session?.access_token || ''
    userEmail.value = session?.user.email || ''
  }

  // token 刷新、跨标签页登录/退出时同步 Pinia 状态，避免守卫使用过期状态。
  supabase.auth.onAuthStateChange((_event, session) => {
    applySession(session)
    initialized.value = true
  })

  // 启动时恢复已有会话（Supabase 会把 session 存在 localStorage）
  async function restore() {
    if (initialized.value) return
    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        applySession(data.session)
      } finally {
        initialized.value = true
        restorePromise = null
      }
    })()
    return restorePromise
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
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    applySession(null)
  }

  return { token, userEmail, initialized, isLoggedIn, login, logout, restore }
})
