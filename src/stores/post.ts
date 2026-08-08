import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as postsApi from '@/api/posts'
import type { Post } from '@/types'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const keyword = ref('')
  const currentCategoryId = ref<number | null>(null)

  // 缓存：已成功加载过就不再重复请求，避免页面切换反复打 Supabase
  let loaded = false

  const filtered = computed(() => {
    let list = posts.value
    if (currentCategoryId.value) {
      list = list.filter(p => p.categoryId === currentCategoryId.value)
    }
    if (keyword.value) {
      const kw = keyword.value.toLowerCase()
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(kw) ||
          p.excerpt.toLowerCase().includes(kw) ||
          p.tags.some(tag => tag.toLowerCase().includes(kw))
      )
    }
    return list
  })

  async function fetchAll(force = false) {
    // 已有缓存且非强制刷新 → 直接返回，避免重复网络请求
    if (loaded && !force) return
    if (loading.value) return // 防止并发重复请求
    loading.value = true
    error.value = null
    try {
      posts.value = await postsApi.getPostSummaries()
      loaded = true
    } catch (e) {
      // 只记录一次错误，不再让上层无限重试
      error.value = (e as Error)?.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function create(data: Partial<Post>) {
    const p = await postsApi.createPost({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    posts.value.unshift(p)
    return p
  }

  async function update(id: number, data: Partial<Post>) {
    const p = await postsApi.updatePost(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
    const idx = posts.value.findIndex(x => x.id === id)
    if (idx > -1) posts.value[idx] = p
    return p
  }

  async function remove(id: number) {
    await postsApi.deletePost(id)
    posts.value = posts.value.filter(x => x.id !== id)
  }

  return {
    posts, loading, error, keyword, currentCategoryId, filtered,
    fetchAll, create, update, remove,
  }
})
