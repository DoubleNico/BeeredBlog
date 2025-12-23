import type { RuntimeConfig } from 'nuxt/schema'
import { getUser } from '~/scripts/backend/user/userOperations'
import type { User } from '~/scripts/types/user/User'

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    currentUser: null as User | null,
    isLoading: false,
    lastFetched: null as number | null,
  }),

  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user
      this.lastFetched = Date.now()
    },

    clearCurrentUser() {
      this.currentUser = null
      this.lastFetched = null
    },

    async fetchCurrentUser(
      config: RuntimeConfig,
      userId: string,
      forceRefresh = false,
    ) {
      if (this.currentUser && !forceRefresh) {
        return this.currentUser
      }

      this.isLoading = true
      try {
        const user = await getUser(config, userId)
        console.log('Fetched user:', user)

        if (!user) {
          throw new Error('User not found')
        }
        if (!user.success) {
          throw new Error('Failed to fetch user data')
        }
        if (!user.user) {
          throw new Error('User data is null')
        }
        this.setCurrentUser(user.user)
        return user.user
      } catch (error) {
        console.error('Error fetching current user:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
