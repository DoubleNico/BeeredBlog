export interface User {
  id: string
  username: string
  email: string
  oauthProvider: number[]
  googleId: string
  githubId: string
  firstName: string
  lastName: string
  avatar: string | null
  bio: string | null
  location: string | null
  website: string | null
  joinedAt: string
  emailVerified: boolean
  emailNotifications: boolean
  newsletter: boolean
  publicProfile: boolean
  showEmail: boolean
  totalFollowers: number
  totalFollowing: number
  totalPosts: number
  totalLikes: number
  createdAt: string
  updatedAt: string
}
