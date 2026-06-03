import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
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
