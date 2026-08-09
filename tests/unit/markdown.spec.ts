import { describe, it, expect } from 'vitest'
import { renderMd } from '@/utils/markdown'
import { readingMinutes } from '@/utils/format'

describe('renderMd', () => {
  it('应能渲染标题', () => {
    const html = renderMd('# Hello')
    expect(html).toContain('<h1 id="hello">')
  })

  it('应能渲染二级标题', () => {
    const html = renderMd('## Section')
    expect(html).toContain('<h2 id="section">')
  })

  it('应能渲染代码块', () => {
    const html = renderMd('```js\nconst x = 1\n```')
    expect(html).toContain('<pre class="shiki-fallback">')
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

  it('应移除危险 HTML', () => {
    const html = renderMd('<img src="x" onerror="alert(1)"><script>alert(1)</script>')
    expect(html).toContain('<img src="x">')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('<script')
  })

  it('重复标题应生成唯一锚点', () => {
    const html = renderMd('# Hello\n# Hello')
    expect(html).toContain('id="hello"')
    expect(html).toContain('id="hello-2"')
  })
})

describe('readingMinutes', () => {
  it('短文章至少显示 1 分钟', () => {
    expect(readingMinutes('Hello，世界。')).toBe(1)
  })

  it('分别计算中文字符和英文单词', () => {
    const content = `${'后端工程'.repeat(100)} ${'backend '.repeat(200)}`
    expect(readingMinutes(content)).toBe(3)
  })

  it('忽略代码块内容', () => {
    expect(readingMinutes(`正文\n\n\`\`\`java\n${'code '.repeat(1000)}\n\`\`\``)).toBe(1)
  })
})
