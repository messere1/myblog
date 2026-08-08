import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { getSingletonHighlighter, type Highlighter } from 'shiki'

// ── Shiki 高亮器（单例，按需加载语言）──
// 首次只加载最常用的基础语言，其余语言在使用时异步按需加载。
// 这样 Rollup 会将每种语言的语法文件拆分成独立 chunk，
// 首屏（首页）不会下载任何 Shiki 语言包。
const CORE_LANGS = ['js', 'ts', 'json', 'bash', 'html', 'css', 'md']
const EXTRA_LANGS = ['jsx', 'tsx', 'vue', 'scss', 'shell', 'python', 'sql']
const ALL_KNOWN_LANGS = [...CORE_LANGS, ...EXTRA_LANGS]

let highlighter: Highlighter | null = null
let initPromise: Promise<Highlighter> | null = null

export async function initHighlighter() {
  if (highlighter) return highlighter
  if (initPromise) return initPromise

  initPromise = (async () => {
    highlighter = await getSingletonHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: CORE_LANGS,
    })
    // 异步加载其余语言，不阻塞首次渲染
    EXTRA_LANGS.forEach(lang => {
      highlighter!.loadLanguage(lang as any).catch(() => {})
    })
    return highlighter
  })()

  return initPromise
}

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  // 同步高亮：highlighter 就绪后用 Shiki，否则回退为转义纯文本
  highlight(code: string, lang: string): string {
    if (highlighter) {
      const known = ALL_KNOWN_LANGS.includes(lang) ? lang : 'text'
      const loaded = highlighter.getLoadedLanguages().includes(known as any) ? known : 'text'
      try {
        // 同时输出明暗双主题，由 CSS 控制显示哪个
        return highlighter.codeToHtml(code, {
          lang: loaded,
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        })
      } catch {
        /* 落到下面的转义 */
      }
    }
    return `<pre class="shiki-fallback"><code>${md.utils.escapeHtml(code)}</code></pre>`
  },
})

// 给 h1~h3 自动加 id 锚点，供目录跳转
const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')

const defaultHeadingOpen =
  md.renderer.rules.heading_open ||
  ((tokens: any, idx: number, options: any, _env: any, self: any) => self.renderToken(tokens, idx, options))

md.renderer.rules.heading_open = (tokens: any, idx: number, options: any, env: any, self: any) => {
  const inline = tokens[idx + 1]
  const text = inline && inline.type === 'inline' ? inline.content : ''
  const base = slugify(text) || 'section'
  const counts: Map<string, number> = env.headingSlugCounts || (env.headingSlugCounts = new Map())
  const count = counts.get(base) || 0
  counts.set(base, count + 1)
  const id = count === 0 ? base : `${base}-${count + 1}`
  tokens[idx].attrSet('id', id)
  return defaultHeadingOpen(tokens, idx, options, env, self)
}

export function renderMd(content: string): string {
  const rendered = md.render(content, { headingSlugCounts: new Map<string, number>() })
  return DOMPurify.sanitize(rendered, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  })
}

export interface TocItem {
  level: number
  text: string
  anchor: string
}

// 从 markdown 文本提取目录（h1~h3）
export function extractToc(content: string): TocItem[] {
  const lines = content.split('\n')
  const toc: TocItem[] = []
  const slugCounts = new Map<string, number>()
  let inCode = false
  for (const line of lines) {
    if (/^```/.test(line.trim())) { inCode = !inCode; continue }
    if (inCode) continue
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (m) {
      const text = m[2].trim()
      const base = slugify(text) || 'section'
      const count = slugCounts.get(base) || 0
      slugCounts.set(base, count + 1)
      toc.push({
        level: m[1].length,
        text,
        anchor: count === 0 ? base : `${base}-${count + 1}`,
      })
    }
  }
  return toc
}
