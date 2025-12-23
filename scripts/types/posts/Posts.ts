export interface Posts {
  id: string
  authorId: string
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  category: string | null
  status: 'draft' | 'published' | 'archived'
  views: number
  likes: number
  commentsEnabled: boolean
  commentsCount: number
  publishedAt: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface PostRequest {
  title: string
  slug?: string
  excerpt: string
  content: string
  coverImage?: string | null
  category?: string | null
  status?: string
  commentsEnabled?: boolean
}
