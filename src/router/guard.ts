import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    document.title = `${to.meta.title || ''} | 墨笺`

    if (to.meta.requiresAuth) {
      const auth = useAuthStore()
      if (!auth.isLoggedIn) {
        next({ name: 'admin-login', query: { redirect: to.fullPath } })
        return
      }
    }
    next()
  })
}
