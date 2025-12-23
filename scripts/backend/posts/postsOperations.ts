import type { RuntimeConfig } from 'nuxt/schema'
import type { Posts, PostRequest } from '~/scripts/types/posts/Posts'
import type { PostStats } from '~/scripts/types/posts/PostStats'

export async function createPost(
  config: RuntimeConfig,
  authorId: string,
  postData: PostRequest,
): Promise<{ success: boolean; message: string; postId?: string }> {
  return await $fetch<{ success: boolean; message: string; postId?: string }>(
    `${config.public.backend}/api/posts/create`,
    {
      method: 'POST',
      query: { authorId },
      body: postData,
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error creating post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getPost(
  config: RuntimeConfig,
  postId: string,
): Promise<{ success: boolean; message: string; post?: Posts }> {
  return await $fetch<{ success: boolean; message: string; post?: Posts }>(
    `${config.public.backend}/api/posts/get`,
    {
      method: 'GET',
      params: { id: postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getPostStats(
  config: RuntimeConfig,
  slug: string,
): Promise<{ success: boolean; message: string; stats?: PostStats }> {
  return await $fetch<{ success: boolean; message: string; stats?: PostStats }>(
    `${config.public.backend}/api/posts/${slug}/stats`,
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching post stats:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getPostBySlug(
  config: RuntimeConfig,
  slug: string,
): Promise<{ success: boolean; message: string; post?: Posts }> {
  return await $fetch<{ success: boolean; message: string; post?: Posts }>(
    `${config.public.backend}/api/posts/getBySlug`,
    {
      method: 'GET',
      params: { slug },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching post by slug:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getPostsByAuthor(
  config: RuntimeConfig,
  authorId: string,
): Promise<{ success: boolean; message: string; posts?: Posts[] }> {
  return await $fetch<{ success: boolean; message: string; posts?: Posts[] }>(
    `${config.public.backend}/api/posts/getByAuthor`,
    {
      method: 'GET',
      params: { authorId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching posts by author:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getPublishedPosts(
  config: RuntimeConfig,
): Promise<{ success: boolean; message: string; posts?: Posts[] }> {
  return await $fetch<{ success: boolean; message: string; posts?: Posts[] }>(
    `${config.public.backend}/api/posts/getPublished`,
    {
      method: 'GET',
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching published posts:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getPostsByCategory(
  config: RuntimeConfig,
  category: string,
): Promise<{ success: boolean; message: string; posts?: Posts[] }> {
  return await $fetch<{ success: boolean; message: string; posts?: Posts[] }>(
    `${config.public.backend}/api/posts/getByCategory`,
    {
      method: 'GET',
      params: { category },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching posts by category:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function updatePost(
  config: RuntimeConfig,
  postId: string,
  postData: PostRequest,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/posts/update`,
    {
      method: 'PUT',
      query: { id: postId },
      body: postData,
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error updating post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function deletePost(
  config: RuntimeConfig,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/posts/delete`,
    {
      method: 'DELETE',
      query: { id: postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error deleting post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function incrementViews(
  config: RuntimeConfig,
  postId: string,
  slug: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/posts/${slug}/increment-view`,
    {
      method: 'POST',
      query: { id: postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error incrementing views:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function likePost(
  config: RuntimeConfig,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/posts/like`,
    {
      method: 'POST',
      query: { id: postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error liking post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function unlikePost(
  config: RuntimeConfig,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/posts/unlike`,
    {
      method: 'POST',
      query: { id: postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error unliking post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}
