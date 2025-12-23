export interface Tags {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface PostTags {
  postId: string
  tagId: string
}
