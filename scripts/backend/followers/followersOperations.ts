import type { RuntimeConfig } from 'nuxt/schema'

export async function follow(
  config: RuntimeConfig,
  followerId: string,
  followingId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/followers/follow`,
    {
      method: 'POST',
      query: { followerId, followingId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error following user:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function unfollow(
  config: RuntimeConfig,
  followerId: string,
  followingId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/followers/unfollow`,
    {
      method: 'POST',
      query: { followerId, followingId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error unfollowing user:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getFollowers(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; followers?: string[] }> {
  return await $fetch<{
    success: boolean
    message: string
    followers?: string[]
  }>(`${config.public.backend}/api/followers/getFollowers`, {
    method: 'GET',
    params: { userId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching followers:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getFollowing(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; following?: string[] }> {
  return await $fetch<{
    success: boolean
    message: string
    following?: string[]
  }>(`${config.public.backend}/api/followers/getFollowing`, {
    method: 'GET',
    params: { userId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching following:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getFollowersCount(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; count: number }> {
  return await $fetch<{ success: boolean; count: number }>(
    `${config.public.backend}/api/followers/getFollowersCount`,
    {
      method: 'GET',
      params: { userId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching followers count:', error)
      return {
        success: false,
        count: 0,
      }
    })
}

export async function getFollowingCount(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; count: number }> {
  return await $fetch<{ success: boolean; count: number }>(
    `${config.public.backend}/api/followers/getFollowingCount`,
    {
      method: 'GET',
      params: { userId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching following count:', error)
      return {
        success: false,
        count: 0,
      }
    })
}

export async function isFollowing(
  config: RuntimeConfig,
  followerId: string,
  followingId: string,
): Promise<{ success: boolean; isFollowing: boolean }> {
  return await $fetch<{ success: boolean; isFollowing: boolean }>(
    `${config.public.backend}/api/followers/isFollowing`,
    {
      method: 'GET',
      params: { followerId, followingId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error checking if following:', error)
      return {
        success: false,
        isFollowing: false,
      }
    })
}
