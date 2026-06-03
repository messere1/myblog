import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/categories'
import type { Category } from '@/types'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  async function fetchAll() {
    categories.value = await api.getCategories()
  }

  async function create(data: Partial<Category>) {
    const c = await api.createCategory(data)
    categories.value.push(c)
    return c
  }

  async function update(id: number, data: Partial<Category>) {
    const c = await api.updateCategory(id, data)
    const idx = categories.value.findIndex(x => x.id === id)
    if (idx > -1) categories.value[idx] = c
  }

  async function remove(id: number) {
    await api.deleteCategory(id)
    categories.value = categories.value.filter(x => x.id !== id)
  }

  return { categories, fetchAll, create, update, remove }
})
