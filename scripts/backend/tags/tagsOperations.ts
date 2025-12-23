import type { RuntimeConfig } from 'nuxt/schema'
import type { Tags } from '~/scripts/types/tags/Tags'

export async function createTag(
  config: RuntimeConfig,
  name: string,
): Promise<{ success: boolean; message: string; tagId?: string }> {
  return await $fetch<{ success: boolean; message: string; tagId?: string }>(
    `${config.public.backend}/api/tags/create`,
    {
      method: 'POST',
      query: { name },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error creating tag:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getTag(
  config: RuntimeConfig,
  tagId: string,
): Promise<{ success: boolean; message: string; tag?: Tags }> {
  return await $fetch<{ success: boolean; message: string; tag?: Tags }>(
    `${config.public.backend}/api/tags/get`,
    {
      method: 'GET',
      params: { id: tagId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching tag:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getTagByName(
  config: RuntimeConfig,
  name: string,
): Promise<{ success: boolean; message: string; tag?: Tags }> {
  return await $fetch<{ success: boolean; message: string; tag?: Tags }>(
    `${config.public.backend}/api/tags/getByName`,
    {
      method: 'GET',
      params: { name },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching tag by name:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getTagBySlug(
  config: RuntimeConfig,
  slug: string,
): Promise<{ success: boolean; message: string; tag?: Tags }> {
  return await $fetch<{ success: boolean; message: string; tag?: Tags }>(
    `${config.public.backend}/api/tags/getBySlug`,
    {
      method: 'GET',
      params: { slug },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching tag by slug:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getAllTags(
  config: RuntimeConfig,
): Promise<{ success: boolean; message: string; tags?: Tags[] }> {
  return await $fetch<{ success: boolean; message: string; tags?: Tags[] }>(
    `${config.public.backend}/api/tags/getAll`,
    {
      method: 'GET',
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching all tags:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function deleteTag(
  config: RuntimeConfig,
  tagId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/tags/delete`,
    {
      method: 'DELETE',
      query: { id: tagId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error deleting tag:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function addTagToPost(
  config: RuntimeConfig,
  postId: string,
  tagId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/tags/addToPost`,
    {
      method: 'POST',
      query: { postId, tagId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error adding tag to post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function removeTagFromPost(
  config: RuntimeConfig,
  postId: string,
  tagId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/tags/removeFromPost`,
    {
      method: 'DELETE',
      query: { postId, tagId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error removing tag from post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getTagsByPost(
  config: RuntimeConfig,
  postId: string,
): Promise<{ success: boolean; message: string; tags?: Tags[] }> {
  return await $fetch<{ success: boolean; message: string; tags?: Tags[] }>(
    `${config.public.backend}/api/tags/getByPost`,
    {
      method: 'GET',
      params: { postId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching tags by post:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getPostsByTag(
  config: RuntimeConfig,
  tagId: string,
): Promise<{ success: boolean; message: string; postIds?: string[] }> {
  return await $fetch<{
    success: boolean
    message: string
    postIds?: string[]
  }>(`${config.public.backend}/api/tags/getPostsByTag`, {
    method: 'GET',
    params: { tagId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching posts by tag:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}
