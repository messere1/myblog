// 生成 RSS 订阅文件 feed.xml —— 构建时从 Supabase 拉取文章
// 用法：node scripts/gen-rss.mjs（已接入 npm run build）
// 需要环境变量 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const SITE = {
  title: '墨笺',
  description: '一隅清净，长存于此。记录代码与热爱的山水之间。',
  link: 'https://your-domain.com',   // ← 部署后改成你的真实域名
  language: 'zh-CN',
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

async function fetchPosts() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[rss] 缺少 Supabase 环境变量，生成空 feed')
    return []
  }
  const url = `${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc&limit=20`
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) {
    console.warn('[rss] 拉取文章失败:', res.status)
    return []
  }
  return res.json()
}

const posts = await fetchPosts()

const items = posts.map(p => {
  const desc = String(p.content || '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/[#*`>\-\[\]!]/g, '')
    .slice(0, 200)
  return `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE.link}/post/${p.id}</link>
      <guid isPermaLink="false">post-${p.id}</guid>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
    </item>`
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.title)}</title>
    <link>${esc(SITE.link)}</link>
    <description>${esc(SITE.description)}</description>
    <language>${SITE.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${esc(SITE.link)}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

const targets = [resolve(root, 'public/feed.xml')]
if (existsSync(resolve(root, 'dist'))) targets.push(resolve(root, 'dist/feed.xml'))
for (const t of targets) {
  mkdirSync(dirname(t), { recursive: true })
  writeFileSync(t, xml, 'utf-8')
  console.log('[rss] 已生成', t, `(${posts.length} 篇)`)
}
