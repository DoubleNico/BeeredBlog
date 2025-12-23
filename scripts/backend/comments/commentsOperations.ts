import type { RuntimeConfig } from 'nuxt/schema'
import type {
  Comments,
  CommentRequest,
} from '~/scripts/types/comments/Comments'

export async function createComment(
  config: RuntimeConfig,
  commentData: CommentRequest,
): Promise<{ success: boolean; message: string; commentId?: string }> {
  return await $fetch<{
    success: boolean
    message: string
    commentId?: string
  }>(`${config.public.backend}/api/comments/create`, {
    method: 'POST',
    body: commentData,
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error creating comment:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getComment(
  config: RuntimeConfig,
  commentId: string,
): Promise<{ success: boolean; message: string; comment?: Comments }> {
  return await $fetch<{
    success: boolean
    message: string
    comment?: Comments
  }>(`${config.public.backend}/api/comments/get`, {
    method: 'GET',
    params: { id: commentId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching comment:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getCommentsByPost(
  config: RuntimeConfig,
  postId: string,
): Promise<{ success: boolean; message: string; comments?: Comments[] }> {
  return await $fetch<{
    success: boolean
    message: string
    comments?: Comments[]
  }>(`${config.public.backend}/api/comments/getByPost`, {
    method: 'GET',
    params: { postId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching comments by post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getCommentsByAuthor(
  config: RuntimeConfig,
  authorId: string,
): Promise<{ success: boolean; message: string; comments?: Comments[] }> {
  return await $fetch<{
    success: boolean
    message: string
    comments?: Comments[]
  }>(`${config.public.backend}/api/comments/getByAuthor`, {
    method: 'GET',
    params: { authorId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching comments by author:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getRepliesByParentComment(
  config: RuntimeConfig,
  parentCommentId: string,
): Promise<{ success: boolean; message: string; replies?: Comments[] }> {
  return await $fetch<{
    success: boolean
    message: string
    replies?: Comments[]
  }>(`${config.public.backend}/api/comments/getReplies`, {
    method: 'GET',
    params: { parentCommentId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching replies:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function updateComment(
  config: RuntimeConfig,
  commentId: string,
  commentData: CommentRequest,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/comments/update`,
    {
      method: 'PUT',
      query: { id: commentId },
      body: commentData,
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error updating comment:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function deleteComment(
  config: RuntimeConfig,
  commentId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/comments/delete`,
    {
      method: 'DELETE',
      query: { id: commentId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error deleting comment:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function likeComment(
  config: RuntimeConfig,
  commentId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/comments/like`,
    {
      method: 'POST',
      query: { id: commentId },
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
  commentId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/comments/unlike`,
    {
      method: 'POST',
      query: { id: commentId },
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
