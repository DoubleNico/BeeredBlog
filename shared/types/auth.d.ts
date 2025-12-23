declare module '#auth-utils' {
  interface User {
    userId: string
  }

  interface UserSession {
    user: User
    loggedInAt?: number
  }
}
