export interface GoogleOAuthUser {
  sub: string
  email: string
  name: string
  family_name: string
  given_name: string
  email_verified: boolean
  picture: string
}

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['openid', 'email', 'profile'],
  },

  async onSuccess(event, { user }: { user: GoogleOAuthUser }) {
    console.log('Google OAuth success:', user)

    const config = useRuntimeConfig()

    const query = getQuery(event)
    const state = query.state as string
    const returnTo = state || 'login'

    try {
      const response = await $fetch<{
        success: boolean
        message: string
        requiresCompletion?: boolean
        user?: {
          id: string
          username: string
          email: string
        }
      }>(`${config.public.backend}/api/auth/oauth/google/check`, {
        method: 'POST',
        body: {
          email: user.email,
          name: user.name,
          familyName: user.family_name,
          givenName: user.given_name,
          googleId: user.sub,
          emailVerified: user.email_verified,
        },
      })

      if (response.requiresCompletion) {
        const params = new URLSearchParams({
          email: user.email || '',
          name: response.user?.username || user.name,
          firstName: user.family_name || '',
          lastName: user.given_name || '',
          googleId: user.sub || '',
          emailVerified: String(user.email_verified),
          picture: user.picture || '',
          from: returnTo,
        })

        return sendRedirect(event, `/complete-profile?${params.toString()}`)
      }

      if (response.success && response.user) {
        await setUserSession(event, {
          user: {
            userId: response.user.id,
          },
          loggedInAt: Date.now(),
        })

        return sendRedirect(event, '/home')
      } else {
        throw createError({
          statusCode: 400,
          statusMessage:
            response.message || 'Failed to authenticate with Google',
        })
      }
    } catch (error) {
      console.error('Google OAuth error:', error)
      return sendRedirect(event, `/${returnTo}?error=oauth_failed`)
    }
  },

  onError(event, error) {
    console.error('Google OAuth error handler called')
    console.error('Error details:', error)

    if (
      error.message?.includes('client_secret') ||
      error.message?.includes('credentials')
    ) {
      console.error(
        'Missing or invalid Google OAuth credentials. Check NUXT_OAUTH_GOOGLE_CLIENT_SECRET in .env',
      )
    }

    const query = getQuery(event)
    const state = query.state as string
    const returnTo = state || 'login'

    return sendRedirect(event, `/${returnTo}?error=oauth_failed`)
  },
})
