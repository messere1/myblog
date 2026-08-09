import dayjs from 'dayjs'

export function formatDate(date: string, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

export function markdownExcerpt(content: string, maxLength = 180): string {
  return content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*`>_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export function readingMinutes(content: string): number {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')

  const chineseCharacters = (plain.match(/[\u3400-\u9fff]/g) || []).length
  const latinWords = (plain.replace(/[\u3400-\u9fff]/g, ' ').match(/[a-zA-Z0-9]+(?:['’-][a-zA-Z0-9]+)*/g) || []).length
  return Math.max(1, Math.ceil(chineseCharacters / 300 + latinWords / 200))
}
