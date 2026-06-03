import MarkdownIt from 'markdown-it'
import { createHighlighter, type Highlighter } from 'shiki'

// ── Shiki 高亮器（单例，异步初始化一次）──
// 预加载博客常用语言 + 一个明/暗双主题
const LANGS = ['js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss', 'json', 'bash', 'shell', 'md', 'python', 'sql']
let highlighter: Highlighter | null = null

export async function initHighlighter() {
  if (highlighter) return highlighter
  highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: LANGS,
  })
  return highlighter
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  // 同步高亮：highlighter 就绪后用 Shiki，否则回退为转义纯文本
  highlight(code, lang) {
    if (highlighter) {
      const language = highlighter.getLoadedLanguages().includes(lang as any) ? lang : 'text'
      try {
        // 同时输出明暗双主题，由 CSS 控制显示哪个
        return highlighter.codeToHtml(code, {
          lang: language,
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
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const inline = tokens[idx + 1]
  const text = inline && inline.type === 'inline' ? inline.content : ''
  const id = slugify(text)
  tokens[idx].attrSet('id', id)
  return defaultHeadingOpen(tokens, idx, options, env, self)
}

export function renderMd(content: string): string {
  return md.render(content)
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
  let inCode = false
  for (const line of lines) {
    if (/^```/.test(line.trim())) { inCode = !inCode; continue }
    if (inCode) continue
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (m) {
      const text = m[2].trim()
      toc.push({ level: m[1].length, text, anchor: slugify(text) })
    }
  }
  return toc
}
