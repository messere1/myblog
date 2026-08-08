-- 为文章列表添加摘要列，避免首页下载所有文章正文。
-- 在 Supabase Dashboard -> SQL Editor 中运行一次。

alter table posts add column if not exists excerpt text not null default '';

update posts
set excerpt = left(regexp_replace(content, E'[\\n\\r\\t]+', ' ', 'g'), 180)
where excerpt = '';
