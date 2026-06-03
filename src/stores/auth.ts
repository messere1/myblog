import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, type LoginPayload } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userEmail = ref<string>(localStorage.getItem('userEmail') || '')

  const isLoggedIn = computed(() => !!token.value)

  async function login(payload: LoginPayload) {
    const { accessToken } = await loginApi(payload)
    token.value = accessToken
    userEmail.value = payload.email
    localStorage.setItem('token', accessToken)
    localStorage.setItem('userEmail', payload.email)
  }

  function logout() {
    token.value = ''
    userEmail.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
  }

  return { token, userEmail, isLoggedIn, login, logout }
})
