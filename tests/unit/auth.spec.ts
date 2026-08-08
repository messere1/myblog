import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(() =>
        Promise.resolve({
          data: { session: { access_token: 'fake-token' }, user: { email: 'a@b.com' } },
          error: null,
        })
      ),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初始状态应为未登录', () => {
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
  })

  it('恢复会话后应标记初始化完成', async () => {
    const auth = useAuthStore()
    await auth.restore()
    expect(auth.initialized).toBe(true)
  })

  it('登录成功后应保存 token', async () => {
    const auth = useAuthStore()
    await auth.login({ email: 'a@b.com', password: '123456' })
    expect(auth.token).toBe('fake-token')
    expect(auth.isLoggedIn).toBe(true)
  })

  it('退出后应清空状态', async () => {
    const auth = useAuthStore()
    await auth.login({ email: 'a@b.com', password: '123456' })
    await auth.logout()
    expect(auth.token).toBe('')
    expect(auth.isLoggedIn).toBe(false)
  })
})
