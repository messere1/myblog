import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import '@/assets/styles/main.scss'

const app = createApp(App)
app.use(createPinia())
app.use(createHead())
app.use(router)

// 恢复 Supabase 登录会话后再挂载，避免刷新后误判未登录
const auth = useAuthStore()
auth.restore().finally(() => {
  app.mount('#app')
})
