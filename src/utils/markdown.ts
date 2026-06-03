import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})

export function renderMd(content: string): string {
  return md.render(content)
}
