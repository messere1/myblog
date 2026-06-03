import { describe, it, expect } from 'vitest'
import { renderMd } from '@/utils/markdown'

describe('renderMd', () => {
  it('应能渲染标题', () => {
    const html = renderMd('# Hello')
    expect(html).toContain('<h1>')
  })

  it('应能渲染二级标题', () => {
    const html = renderMd('## Section')
    expect(html).toContain('<h2>')
  })

  it('应能渲染代码块', () => {
    const html = renderMd('```js\nconst x = 1\n```')
    expect(html).toContain('<pre>')
    expect(html).toContain('<code')
  })

  it('应能渲染行内代码', () => {
    const html = renderMd('use `const` keyword')
    expect(html).toContain('<code>')
  })

  it('应能自动转换链接', () => {
    const html = renderMd('https://example.com')
    expect(html).toContain('<a')
  })

  it('应能渲染加粗文字', () => {
    const html = renderMd('**bold**')
    expect(html).toContain('<strong>')
  })

  it('应能渲染引用块', () => {
    const html = renderMd('> quote')
    expect(html).toContain('<blockquote>')
  })
})
