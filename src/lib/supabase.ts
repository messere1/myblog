import { createClient } from '@supabase/supabase-js'

// Supabase 客户端
// 环境变量在 .env 配置（本地）和 Vercel 项目设置（线上）中填入
const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey) {
  console.warn('[supabase] 未配置 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anonKey)
