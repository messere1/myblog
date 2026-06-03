import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

interface CategoryRow {
  id: number
  name: string
  description: string | null
}

function rowToCategory(r: CategoryRow): Category {
  return { id: r.id, name: r.name, description: r.description || undefined }
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('id')
  if (error) throw error
  return (data as CategoryRow[]).map(rowToCategory)
}

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const { data: row, error } = await supabase
    .from('categories')
    .insert({ name: data.name, description: data.description || null })
    .select()
    .single()
  if (error) throw error
  return rowToCategory(row as CategoryRow)
}

export const updateCategory = async (id: number, data: Partial<Category>): Promise<Category> => {
  const { data: row, error } = await supabase
    .from('categories')
    .update({ name: data.name, description: data.description || null })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return rowToCategory(row as CategoryRow)
}

export const deleteCategory = async (id: number): Promise<void> => {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
