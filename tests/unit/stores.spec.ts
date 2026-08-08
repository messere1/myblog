import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '@/stores/post'

vi.mock('@/api/posts', () => ({
  getPostSummaries: vi.fn(() => Promise.resolve([
    { id: 1, title: 'Vue', content: '', excerpt: 'vue content', categoryId: 1, tags: ['vue'], createdAt: '', updatedAt: '' },
    { id: 2, title: 'React', content: '', excerpt: 'react content', categoryId: 2, tags: ['react'], createdAt: '', updatedAt: '' },
  ])),
  createPost: vi.fn((data) => Promise.resolve({ id: 3, ...data })),
  updatePost: vi.fn((id, data) => Promise.resolve({ id, ...data })),
  deletePost: vi.fn(() => Promise.resolve()),
}))

describe('usePostStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('应能加载文章列表', async () => {
    const store = usePostStore()
    await store.fetchAll()
    expect(store.posts).toHaveLength(2)
  })

  it('应能按分类筛选', async () => {
    const store = usePostStore()
    await store.fetchAll()
    store.currentCategoryId = 1
    expect(store.filtered).toHaveLength(1)
    expect(store.filtered[0].title).toBe('Vue')
  })

  it('应能按关键词搜索', async () => {
    const store = usePostStore()
    await store.fetchAll()
    store.keyword = 'react'
    expect(store.filtered).toHaveLength(1)
  })

  it('创建文章后应添加到列表头部', async () => {
    const store = usePostStore()
    await store.fetchAll()
    await store.create({ title: 'New Post', content: 'content', categoryId: 1, tags: [] })
    expect(store.posts[0].title).toBe('New Post')
    expect(store.posts).toHaveLength(3)
  })

  it('删除文章后应从列表移除', async () => {
    const store = usePostStore()
    await store.fetchAll()
    await store.remove(1)
    expect(store.posts.find(p => p.id === 1)).toBeUndefined()
    expect(store.posts).toHaveLength(1)
  })
})
