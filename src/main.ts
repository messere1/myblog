import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import '@/assets/styles/main.scss'

const app = createApp(App)
app.use(createPinia())
app.use(createHead())
app.use(router)

// Do not make the public site wait for an optional remote auth refresh.
// A paused or unreachable Supabase project used to leave visitors staring at
// a blank page until the network request timed out.
app.mount('#app')

const auth = useAuthStore()
auth.restore().catch((error) => {
  console.warn('[auth] Session restore failed:', error)
})
