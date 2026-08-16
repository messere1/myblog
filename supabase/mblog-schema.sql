-- Messere Blog: full Next.js backend schema for Supabase PostgreSQL.
-- Run once in Supabase Dashboard -> SQL Editor.
-- Existing public.posts/public.categories data is copied into the isolated mblog schema.

create schema if not exists mblog;

create table if not exists mblog.admin_users (
  id text primary key,
  username text not null unique,
  password_hash text not null default 'supabase-auth',
  is_active integer not null default 1,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mblog.admin_login_failures (
  id text primary key,
  rate_key text not null,
  attempted_at timestamptz not null
);

create table if not exists mblog.public_users (
  id text primary key,
  username text not null,
  email text not null,
  password_hash text not null,
  avatar_url text,
  status text not null default 'active',
  muted_until timestamptz,
  session_version integer not null default 1,
  must_change_password integer not null default 0,
  last_login_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);
create unique index if not exists public_users_username_lower_unique on mblog.public_users (lower(username)) where deleted_at is null;
create unique index if not exists public_users_email_lower_unique on mblog.public_users (lower(email)) where deleted_at is null;

create table if not exists mblog.public_auth_events (
  id text primary key,
  purpose text not null,
  rate_key text not null,
  attempted_at timestamptz not null
);

create table if not exists mblog.categories (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists mblog.tags (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists mblog.posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  summary text,
  content text not null,
  cover_url text,
  category_id text references mblog.categories(id) on delete set null,
  status text not null default 'draft',
  is_pinned integer not null default 0,
  view_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create table if not exists mblog.post_tags (
  post_id text not null references mblog.posts(id) on delete cascade,
  tag_id text not null references mblog.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists mblog.post_comments (
  id text primary key,
  post_id text not null references mblog.posts(id) on delete cascade,
  parent_id text references mblog.post_comments(id) on delete cascade,
  public_user_id text references mblog.public_users(id) on delete set null,
  admin_user_id text references mblog.admin_users(id) on delete set null,
  content text not null,
  status text not null default 'visible',
  edited_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  check ((public_user_id is not null) <> (admin_user_id is not null))
);

create table if not exists mblog.comment_likes (
  comment_id text not null references mblog.post_comments(id) on delete cascade,
  public_user_id text not null references mblog.public_users(id) on delete cascade,
  created_at timestamptz not null,
  primary key (comment_id, public_user_id)
);

create table if not exists mblog.moments (
  id text primary key,
  content text not null,
  mood text,
  weather text,
  location text,
  status text not null default 'published',
  published_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create table if not exists mblog.projects (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text,
  content text,
  project_url text,
  github_url text,
  status text not null default 'published',
  sort_order integer not null default 0,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create table if not exists mblog.friends (
  id text primary key,
  name text not null,
  url text not null unique,
  avatar_url text,
  description text,
  site_title text,
  status text not null default 'approved',
  sort_order integer not null default 0,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  approved_at timestamptz,
  deleted_at timestamptz
);

create table if not exists mblog.messages (
  id text primary key,
  author text not null,
  content text not null,
  status text not null default 'pending',
  created_at timestamptz not null,
  updated_at timestamptz not null,
  approved_at timestamptz,
  deleted_at timestamptz
);

create table if not exists mblog.albums (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text,
  cover_url text,
  location text,
  status text not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create table if not exists mblog.photos (
  id text primary key,
  album_id text not null references mblog.albums(id) on delete cascade,
  title text,
  description text,
  image_url text not null,
  thumbnail_url text,
  preview_url text,
  width integer,
  height integer,
  sort_order integer not null default 0,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create table if not exists mblog.songs (
  id text primary key,
  title text not null,
  artist text not null,
  album text not null default '',
  pic text not null default '',
  url text not null,
  lrc text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create index if not exists idx_posts_status_published_at on mblog.posts(status, published_at);
create index if not exists idx_posts_category on mblog.posts(category_id);
create index if not exists idx_posts_pinned on mblog.posts(is_pinned, published_at);
create index if not exists idx_moments_status_published_at on mblog.moments(status, published_at);
create index if not exists idx_projects_status_sort on mblog.projects(status, sort_order);
create index if not exists idx_friends_status_sort on mblog.friends(status, sort_order);
create index if not exists idx_messages_status_created on mblog.messages(status, created_at);
create index if not exists idx_albums_status_sort on mblog.albums(status, sort_order);
create index if not exists idx_photos_album_sort on mblog.photos(album_id, sort_order);
create index if not exists idx_admin_login_failures_key_time on mblog.admin_login_failures(rate_key, attempted_at);
create index if not exists idx_public_auth_events_key_time on mblog.public_auth_events(purpose, rate_key, attempted_at);
create index if not exists idx_post_comments_post_created on mblog.post_comments(post_id, parent_id, status, created_at);

-- Copy the existing Vue/Supabase blog content without deleting or changing it.
insert into mblog.categories (id, name, slug, description, sort_order, created_at, updated_at)
select id::text, name, 'category-' || id::text, description, id::integer, now(), now()
from public.categories
on conflict (id) do update set name = excluded.name, description = excluded.description, updated_at = now();

insert into mblog.posts (id, title, slug, summary, content, cover_url, category_id, status, is_pinned, view_count, published_at, created_at, updated_at)
select id::text, title, 'post-' || id::text, excerpt, content, cover, category_id::text, 'published', 0, 0, created_at, created_at, updated_at
from public.posts
on conflict (id) do update set title = excluded.title, summary = excluded.summary, content = excluded.content, cover_url = excluded.cover_url, category_id = excluded.category_id, updated_at = excluded.updated_at;

insert into mblog.tags (id, name, slug, created_at, updated_at)
select md5(tag), tag, 'tag-' || substr(md5(tag), 1, 12), now(), now()
from (select distinct unnest(tags) as tag from public.posts) source
where tag is not null and btrim(tag) <> ''
on conflict (id) do nothing;

insert into mblog.post_tags (post_id, tag_id)
select post.id::text, md5(tag)
from public.posts post cross join lateral unnest(post.tags) as tag
on conflict do nothing;

-- The Auth account password remains managed by Supabase Auth. Membership is checked
-- through public.blog_admins during login; no password is copied into mblog tables.
