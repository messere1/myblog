import { supabase } from '@/lib/supabase'
import type { Post } from '@/types'

// DB 表 posts 用 snake_case 列；这里做 行<->Post 的映射，
// 让 store / 组件继续用 camelCase，无需改动。
interface PostRow {
  id: number
  title: string
  content: string
  category_id: number
  tags: string[] | null
  cover: string | null
  created_at: string
  updated_at: string
}

function rowToPost(r: PostRow): Post {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    categoryId: r.category_id,
    tags: r.tags || [],
    coverImage: r.cover || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

function postToRow(p: Partial<Post>) {
  const row: Record<string, unknown> = {}
  if (p.title !== undefined) row.title = p.title
  if (p.content !== undefined) row.content = p.content
  if (p.categoryId !== undefined) row.category_id = p.categoryId
  if (p.tags !== undefined) row.tags = p.tags
  if (p.coverImage !== undefined) row.cover = p.coverImage || null
  if (p.createdAt !== undefined) row.created_at = p.createdAt
  if (p.updatedAt !== undefined) row.updated_at = p.updatedAt
  return row
}

export const getPosts = async (params?: { q?: string; categoryId?: number }): Promise<Post[]> => {
  let query = supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (params?.categoryId) query = query.eq('category_id', params.categoryId)
  if (params?.q) query = query.ilike('title', `%${params.q}%`)
  const { data, error } = await query
  if (error) throw error
  return (data as PostRow[]).map(rowToPost)
}

export const getPost = async (id: number): Promise<Post> => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
  if (error) throw error
  return rowToPost(data as PostRow)
}

export const createPost = async (data: Partial<Post>): Promise<Post> => {
  const { data: row, error } = await supabase
    .from('posts')
    .insert(postToRow(data))
    .select()
    .single()
  if (error) throw error
  return rowToPost(row as PostRow)
}

export const updatePost = async (id: number, data: Partial<Post>): Promise<Post> => {
  const { data: row, error } = await supabase
    .from('posts')
    .update(postToRow(data))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return rowToPost(row as PostRow)
}

export const deletePost = async (id: number): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}
