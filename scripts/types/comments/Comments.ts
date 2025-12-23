export interface Comments {
  id: string
  postId: string
  authorId: string
  parentCommentId: string | null
  content: string
  likes: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CommentRequest {
  postId: string
  authorId: string
  parentCommentId?: string | null
  content: string
}
