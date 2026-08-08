export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  categoryId: number
  tags: string[]
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface UserInfo {
  id: number
  email: string
}
