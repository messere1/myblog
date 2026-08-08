-- 将现有博客从“所有登录用户可写”迁移为“管理员白名单可写”。
-- 在 Supabase Dashboard -> SQL Editor 中运行。

create table if not exists blog_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table blog_admins enable row level security;

drop policy if exists "admin read own membership" on blog_admins;
create policy "admin read own membership" on blog_admins for select
  using (user_id = auth.uid());

drop policy if exists "auth write categories" on categories;
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all
  using (exists (select 1 from blog_admins where user_id = auth.uid()))
  with check (exists (select 1 from blog_admins where user_id = auth.uid()));

drop policy if exists "auth write posts" on posts;
drop policy if exists "admin write posts" on posts;
create policy "admin write posts" on posts for all
  using (exists (select 1 from blog_admins where user_id = auth.uid()))
  with check (exists (select 1 from blog_admins where user_id = auth.uid()));

-- 将下面的邮箱替换为你在 Supabase Authentication 中的管理员邮箱，然后执行：
-- insert into blog_admins (user_id)
-- select id from auth.users where email = 'your-admin@example.com'
-- on conflict (user_id) do nothing;
