import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { translatePostgresSql } from '../lib/db.ts';

test('database adapter translates libSQL statements for the isolated Supabase schema', () => {
  assert.equal(
    translatePostgresSql('SELECT * FROM posts WHERE id = ?'),
    'SELECT * FROM mblog.posts WHERE id = $1',
  );
  assert.match(
    translatePostgresSql('SELECT * FROM public_users WHERE username = ? COLLATE NOCASE'),
    /FROM mblog\.public_users WHERE LOWER\(username\) = LOWER\(\$1\)/,
  );
  assert.match(
    translatePostgresSql('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)'),
    /^INSERT INTO mblog\.post_tags[\s\S]+ON CONFLICT DO NOTHING$/,
  );
});

test('Supabase schema preserves old public content and provisions the complete MBlog backend', async () => {
  const schema = await readFile('supabase/mblog-schema.sql', 'utf8');
  assert.match(schema, /create schema if not exists mblog/i);
  assert.match(schema, /create table if not exists mblog\.posts/i);
  assert.match(schema, /create table if not exists mblog\.post_comments/i);
  assert.match(schema, /from public\.posts/i);
  assert.match(schema, /from public\.categories/i);
  assert.doesNotMatch(schema, /drop table/i);
});

test('administrator login delegates passwords to Supabase Auth and enforces blog_admins membership', async () => {
  const route = await readFile('app/api/admin/login/route.ts', 'utf8');
  assert.match(route, /\/auth\/v1\/token\?grant_type=password/);
  assert.match(route, /\/rest\/v1\/blog_admins/);
  assert.match(route, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.doesNotMatch(route, /verifyPassword|password_hash as string/);
});

test('GLM relay uses the server-side OpenAI-compatible endpoint', async () => {
  const [route, client] = await Promise.all([
    readFile('app/api/chat/route.ts', 'utf8'),
    readFile('components/CyberCat.tsx', 'utf8'),
  ]);
  assert.match(route, /GLM_API_KEY/);
  assert.match(route, /glm-5\.3/);
  assert.match(route, /reasoning_effort: 'low'/);
  assert.match(route, /\/v1\/chat\/completions/);
  assert.doesNotMatch(route, /AI_GATEWAY_MODEL|OPENAI_API_KEY|api\.openai\.com/);
  assert.doesNotMatch(client, /apiKey|输入 API Key|Gemini|Vercel AI Gateway/);
});
