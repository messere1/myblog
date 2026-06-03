import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/api/auth', () => ({
  loginApi: vi.fn(() => Promise.resolve({ accessToken: 'fake-token' })),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('初始状态应为未登录', () => {
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
  })

  it('登录成功后应保存 token', async () => {
    const auth = useAuthStore()
    await auth.login({ email: 'a@b.com', password: '123456' })
    expect(auth.token).toBe('fake-token')
    expect(auth.isLoggedIn).toBe(true)
    expect(localStorage.getItem('token')).toBe('fake-token')
  })

  it('退出后应清空状态', async () => {
    const auth = useAuthStore()
    await auth.login({ email: 'a@b.com', password: '123456' })
    auth.logout()
    expect(auth.token).toBe('')
    expect(auth.isLoggedIn).toBe(false)
  })

  it('退出后 localStorage 应被清空', async () => {
    const auth = useAuthStore()
    await auth.login({ email: 'a@b.com', password: '123456' })
    auth.logout()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
