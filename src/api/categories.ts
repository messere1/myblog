import request from './request'
import type { Category } from '@/types'

export const getCategories = () =>
  request.get<Category[], Category[]>('/categories')

export const createCategory = (data: Partial<Category>) =>
  request.post<Category, Category>('/categories', data)

export const updateCategory = (id: number, data: Partial<Category>) =>
  request.put<Category, Category>(`/categories/${id}`, data)

export const deleteCategory = (id: number) =>
  request.delete(`/categories/${id}`)
