import type { RuntimeConfig } from 'nuxt/schema'
import type { Likes } from '~/scripts/types/likes/Likes'
import type { Posts } from '~/scripts/types/posts/Posts'

export async function likePost(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/likes/likePost`,
    {
      method: 'POST',
      query: { userId, postId },
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

export async function getLikedPostsByUser(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; posts?: Posts[] }> {
  return await $fetch<{
    success: boolean
    message: string
    posts?: Posts[]
  }>(`${config.public.backend}/api/likes/getLikedPostsByUser`, {
    method: 'GET',
    params: { userId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching liked posts:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function unlikePost(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/likes/unlikePost`,
    {
      method: 'POST',
      query: { userId, postId },
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

export async function togglePost(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/likes/togglePost`,
    {
      method: 'POST',
      query: { postId, userId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error toggling post status:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function likeComment(
  config: RuntimeConfig,
  userId: string,
  commentId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/likes/likeComment`,
    {
      method: 'POST',
      query: { userId, commentId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error liking comment:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function unlikeComment(
  config: RuntimeConfig,
  userId: string,
  commentId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/likes/unlikeComment`,
    {
      method: 'POST',
      query: { userId, commentId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error unliking comment:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getLikesByUser(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; likes?: Likes[] }> {
  return await $fetch<{ success: boolean; message: string; likes?: Likes[] }>(
    `${config.public.backend}/api/likes/getByUser`,
    {
      method: 'GET',
      params: { userId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching likes by user:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getLikesByPost(
  config: RuntimeConfig,
  postId: string,
): Promise<{ success: boolean; message: string; likes?: Likes[] }> {
  return await $fetch<{ success: boolean; message: string; likes?: Likes[] }>(
    `${config.public.backend}/api/likes/getByPost`,
    {
      method: 'GET',
      params: { postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching likes by post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getLikesByComment(
  config: RuntimeConfig,
  commentId: string,
): Promise<{ success: boolean; message: string; likes?: Likes[] }> {
  return await $fetch<{ success: boolean; message: string; likes?: Likes[] }>(
    `${config.public.backend}/api/likes/getByComment`,
    {
      method: 'GET',
      params: { commentId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching likes by comment:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function hasUserLikedPost(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; hasLiked: boolean }> {
  return await $fetch<{ success: boolean; hasLiked: boolean }>(
    `${config.public.backend}/api/likes/hasUserLikedPost`,
    {
      method: 'GET',
      params: { userId, postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error checking if user liked post:', error)
      return {
        success: false,
        hasLiked: false,
      }
    })
}

export async function hasUserLikedComment(
  config: RuntimeConfig,
  userId: string,
  commentId: string,
): Promise<{ success: boolean; hasLiked: boolean }> {
  return await $fetch<{ success: boolean; hasLiked: boolean }>(
    `${config.public.backend}/api/likes/hasUserLikedComment`,
    {
      method: 'GET',
      params: { userId, commentId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error checking if user liked comment:', error)
      return {
        success: false,
        hasLiked: false,
      }
    })
}
