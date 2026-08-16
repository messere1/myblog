import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { signAdminToken, getCookieName, getCookieOptions } from '../../../../lib/admin/auth';
import { loginSchema } from '../../../../lib/admin/validators';
import {
  checkLoginRateLimit,
  clearLoginFailures,
  createLoginRateKey,
  recordLoginFailure,
} from '../../../../lib/admin/login-rate-limit';

function getClientIp(request: NextRequest): string {
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';
}

async function authenticateSupabase(email: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase Auth 未配置');

  const authResponse = await fetch(`${url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });
  if (!authResponse.ok) return null;

  const auth = await authResponse.json() as { access_token?: string; user?: { id?: string; email?: string } };
  if (!auth.access_token || !auth.user?.id) return null;

  const membership = await fetch(`${url.replace(/\/$/, '')}/rest/v1/blog_admins?select=user_id&user_id=eq.${encodeURIComponent(auth.user.id)}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${auth.access_token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });
  if (!membership.ok) return null;
  const rows = await membership.json() as { user_id?: string }[];
  if (!rows.some((row) => row.user_id === auth.user?.id)) return null;

  return { id: auth.user.id, email: auth.user.email || email };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: '请输入邮箱和密码' }, { status: 400 });
    }

    const email = parsed.data.username.trim().toLowerCase();
    const { password } = parsed.data;
    const rateKey = await createLoginRateKey(email, getClientIp(request));
    const rateLimit = await checkLoginRateLimit(rateKey, Date.now(), db);
    if (!rateLimit.allowed) {
      return NextResponse.json({ ok: false, message: '登录尝试过多，请稍后再试' }, {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      });
    }

    const admin = await authenticateSupabase(email, password);
    if (!admin) {
      await recordLoginFailure(rateKey, Date.now(), db);
      return NextResponse.json({ ok: false, message: '邮箱、密码错误，或账号不在管理员白名单中' }, { status: 401 });
    }

    await clearLoginFailures(rateKey, db);
    const now = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO admin_users (id, username, password_hash, is_active, last_login_at, created_at, updated_at)
            VALUES (?, ?, 'supabase-auth', 1, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET username = excluded.username, is_active = 1, last_login_at = excluded.last_login_at, updated_at = excluded.updated_at`,
      args: [admin.id, admin.email, now, now, now],
    });

    const token = await signAdminToken({ sub: admin.id, username: admin.email });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(getCookieName(), token, getCookieOptions());
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: '服务器配置错误' }, { status: 500 });
  }
}
