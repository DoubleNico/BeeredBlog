import type { RuntimeConfig } from 'nuxt/schema'
import type { Bookmarks } from '~/scripts/types/bookmarks/Bookmarks'
import type { Posts } from '~/scripts/types/posts/Posts'

export async function addBookmark(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/bookmarks/add`,
    {
      method: 'POST',
      query: { userId, postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error adding bookmark:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getBookmarkedPostsByUser(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; posts?: Posts[] }> {
  return await $fetch<{
    success: boolean
    message: string
    posts?: Posts[]
  }>(`${config.public.backend}/api/bookmarks/getBookmarkedPostsByUser`, {
    method: 'GET',
    params: { userId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching bookmarked posts:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function removeBookmark(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/bookmarks/remove`,
    {
      method: 'DELETE',
      query: { userId, postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error removing bookmark:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getBookmarksByUser(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; bookmarks?: Bookmarks[] }> {
  return await $fetch<{
    success: boolean
    message: string
    bookmarks?: Bookmarks[]
  }>(`${config.public.backend}/api/bookmarks/getByUser`, {
    method: 'GET',
    params: { userId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching bookmarks:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function isBookmarked(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; isBookmarked: boolean }> {
  return await $fetch<{ success: boolean; isBookmarked: boolean }>(
    `${config.public.backend}/api/bookmarks/isBookmarked`,
    {
      method: 'GET',
      params: { userId, postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error checking bookmark status:', error)
      return {
        success: false,
        isBookmarked: false,
      }
    })
}

export async function toggleBookmark(
  config: RuntimeConfig,
  userId: string,
  postId: string,
): Promise<{ success: boolean; message: string; isBookmarked?: boolean }> {
  return await $fetch<{
    success: boolean
    message: string
    isBookmarked?: boolean
  }>(`${config.public.backend}/api/bookmarks/toggle`, {
    method: 'POST',
    query: { userId, postId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error toggling bookmark:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}
