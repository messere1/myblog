import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupGuard } from './guard'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, saved) {
    return saved || { top: 0 }
  },
})

setupGuard(router)
export default router
