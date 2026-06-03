/**
 * RSS feed 生成脚本
 * 构建时自动运行，从 mock/db.json 读取文章生成 feed.xml
 * 也可单独运行：npm run rss
 *
 * ⚠️ 请将 SITE.link 改为你的真实线上地址
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE = {
  title: '墨笺',
  description: '一隅清净，长存于此。记录代码与热爱的山水之间。',
  link: 'https://your-domain.com',   // ← ⚠️ 改成你的真实域名
  language: 'zh-CN',
  author: '墨笺',
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatRfc822(iso) {
  const d = new Date(iso)
  return d.toUTCString()
}

function generate() {
  const dbPath = resolve(__dirname, '../mock/db.json')
  const db = JSON.parse(readFileSync(dbPath, 'utf-8'))
  const posts = db.posts || []
  const categories = db.categories || []

  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]))

  const sorted = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const items = sorted.map(post => {
    const catName = catMap[post.categoryId] || ''
    const link = `${SITE.link}/post/${post.id}`
    const desc = post.content
      .replace(/[#*`>\-\[\]!]/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .slice(0, 200)

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(desc)}</description>
      ${catName ? `<category>${escapeXml(catName)}</category>` : ''}
      ${(post.tags || []).map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')}
      <pubDate>${formatRfc822(post.createdAt)}</pubDate>
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <link>${escapeXml(SITE.link)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(SITE.link)}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`

  const distDir = resolve(__dirname, '../dist')
  mkdirSync(distDir, { recursive: true })
  const outPath = resolve(distDir, 'feed.xml')
  writeFileSync(outPath, xml, 'utf-8')
  console.log(`✅ RSS feed generated: ${outPath} (${sorted.length} posts)`)
}

generate()
