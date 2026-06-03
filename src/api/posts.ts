import request from './request'
import type { Post } from '@/types'

export const getPosts = (params?: { q?: string; categoryId?: number }) =>
  request.get<Post[], Post[]>('/posts', { params })

export const getPost = (id: number) =>
  request.get<Post, Post>(`/posts/${id}`)

export const createPost = (data: Partial<Post>) =>
  request.post<Post, Post>('/posts', data)

export const updatePost = (id: number, data: Partial<Post>) =>
  request.put<Post, Post>(`/posts/${id}`, data)

export const deletePost = (id: number) =>
  request.delete(`/posts/${id}`)
