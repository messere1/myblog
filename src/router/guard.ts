import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuard(router: Router) {
  router.beforeEach(async (to) => {
    const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : ''
    document.title = pageTitle ? `${pageTitle} | Messere` : 'Messere | Backend Engineer'

    if (to.meta.requiresAuth) {
      const auth = useAuthStore()
      try {
        await auth.restore()
      } catch {
        // 会话恢复失败按未登录处理；登录页会给出明确反馈。
      }
      if (!auth.isLoggedIn) {
        return { name: 'admin-login', query: { redirect: to.fullPath } }
      }
    }
    return true
  })
}
