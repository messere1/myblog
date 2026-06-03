// 认证已迁移到 Supabase Auth，见 stores/auth.ts
// 此文件保留类型导出以兼容旧引用
export interface LoginPayload {
  email: string
  password: string
}
