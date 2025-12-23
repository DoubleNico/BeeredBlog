export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user?.userId) {
    return {
      success: false,
      message: 'No active session',
    }
  }

  return {
    success: true,
    message: 'Session is valid',
    userId: session.user.userId,
  }
})
