import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as postsApi from '@/api/posts'
import type { Post } from '@/types'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const keyword = ref('')
  const currentCategoryId = ref<number | null>(null)

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
          p.content.toLowerCase().includes(kw)
      )
    }
    return list
  })

  async function fetchAll() {
    loading.value = true
    try {
      posts.value = await postsApi.getPosts()
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
    posts, loading, keyword, currentCategoryId, filtered,
    fetchAll, create, update, remove,
  }
})
