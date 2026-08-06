import { createClient } from '@supabase/supabase-js'

// Supabase 客户端
// 环境变量在 .env 配置（本地）和 Vercel 项目设置（线上）中填入
const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const fetchWithTimeout: typeof fetch = (input, init = {}) => {
  if (init.signal) return fetch(input, init)
  return fetch(input, {
    ...init,
    // 8 秒超时：比浏览器默认 30s 快很多，失败时能更快给用户反馈
    signal: AbortSignal.timeout(8_000),
  })
}

if (!url || !anonKey) {
  console.warn('[supabase] 未配置 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anonKey, {
  global: { fetch: fetchWithTimeout },
  auth: {
    // 前台不需要自动刷新 token 的轮询，减少后台请求
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
