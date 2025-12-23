import type { RuntimeConfig } from 'nuxt/schema'
import type { User } from '~/scripts/types/user/User'

export interface UserRequest {
  username?: string
  email?: string
  oauthProvider?: string
  oauthId?: string
  firstName?: string
  lastName?: string
  avatar?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
}
export interface UserUpdateRequest {
  username: string
  bio: string | null
  location: string | null
  website: string | null
  avatar: string | null
}

export interface UserUpdatePreferencesRequest {
  emailNotifications: boolean
  newsletter: boolean
  publicProfile: boolean
  showEmail: boolean
}

export async function createUser(
  config: RuntimeConfig,
  userData: UserRequest,
): Promise<{ success: boolean; message: string; userId?: string }> {
  return await $fetch<{ success: boolean; message: string; userId?: string }>(
    `${config.public.backend}/api/user/create`,
    {
      method: 'POST',
      body: userData,
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error creating user:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getUser(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  const cacheKey = `user-${userId}`

  const { updatedAt } = await getUserUpdatedAt(config, userId)

  const { data, error } = await useFetch<{
    success: boolean
    message: string
    user?: User
  }>(`${config.public.backend}/api/user/get`, {
    method: 'GET',
    key: cacheKey,
    params: { id: userId },
    getCachedData(key, nuxtApp) {
      const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key]

      if (!cachedData) {
        return
      }

      if (!updatedAt) {
        return
      }

      if (cachedData.user?.userTimestamps?.updatedAt) {
        const cachedTime = new Date(
          cachedData.user.userTimestamps.updatedAt,
        ).getTime()
        const serverTime = new Date(updatedAt).getTime()

        if (serverTime > cachedTime) {
          return
        }
      }

      return cachedData
    },
  })

  if (error.value) {
    console.error('Error fetching user:', error.value)
    return {
      success: false,
      message:
        error.value.statusMessage || error.value.message || 'Unknown error',
    }
  }

  return (
    data.value || { success: false, message: 'No data returned from server' }
  )
}
export async function getUserByEmail(
  config: RuntimeConfig,
  email: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  return await $fetch<{ success: boolean; message: string; user?: User }>(
    `${config.public.backend}/api/user/getByEmail`,
    {
      method: 'GET',
      params: { email },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching user by email:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getUserByUsername(
  config: RuntimeConfig,
  username: string,
): Promise<{ success: boolean; message: string; user?: User }> {
  return await $fetch<{ success: boolean; message: string; user?: User }>(
    `${config.public.backend}/api/user/getByUsername`,
    {
      method: 'GET',
      params: { username },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching user by username:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function getUserUpdatedAt(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string; updatedAt?: string }> {
  return await $fetch<{
    success: boolean
    message: string
    updatedAt?: string
  }>(`${config.public.backend}/api/user/getUpdatedAt`, {
    method: 'GET',
    params: { id: userId },
  })
    .then((res) => res)
    .catch((error) => {
      console.error('Error fetching user updatedAt:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function updateUserSettings(
  config: RuntimeConfig,
  userId: string,
  userData: UserUpdateRequest,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/user/updateSettingsUser`,
    {
      method: 'PUT',
      query: { id: userId },
      body: userData,
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error updating user:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function updateUserSettingsPreferences(
  config: RuntimeConfig,
  userId: string,
  userData: UserUpdatePreferencesRequest,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/user/updateSettingsPreferences`,
    {
      method: 'PUT',
      query: { id: userId },
      body: userData,
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error updating user:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function deleteUser(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  return await $fetch<{ success: boolean; message: string }>(
    `${config.public.backend}/api/user/delete`,
    {
      method: 'DELETE',
      query: { id: userId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error deleting user:', error)
      return {
        success: false,
        message: error.statusMessage || error.message || 'Unknown error',
      }
    })
}

export async function isValidUser(
  config: RuntimeConfig,
  userId: string,
): Promise<{ success: boolean; isValid: boolean }> {
  return await $fetch<{ success: boolean; isValid: boolean }>(
    `${config.public.backend}/api/user/isValid`,
    {
      method: 'GET',
      params: { id: userId },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error checking if user is valid:', error)
      return {
        success: false,
        isValid: false,
      }
    })
}

export async function isValidUserByEmail(
  config: RuntimeConfig,
  email: string,
): Promise<{ success: boolean; isValid: boolean }> {
  return await $fetch<{ success: boolean; isValid: boolean }>(
    `${config.public.backend}/api/user/isValidByEmail`,
    {
      method: 'GET',
      params: { email },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error checking if user is valid by email:', error)
      return {
        success: false,
        isValid: false,
      }
    })
}

export async function isValidUserByUsername(
  config: RuntimeConfig,
  username: string,
): Promise<{ success: boolean; isValid: boolean }> {
  return await $fetch<{ success: boolean; isValid: boolean }>(
    `${config.public.backend}/api/user/isValidByUsername`,
    {
      method: 'GET',
      params: { username },
    },
  )
    .then((res) => res)
    .catch((error) => {
      console.error('Error checking if user is valid by username:', error)
      return {
        success: false,
        isValid: false,
      }
    })
}
