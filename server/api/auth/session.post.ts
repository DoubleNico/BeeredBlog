export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  await setUserSession(event, {
    user: {
      userId: body.userId,
    },
    loggedInAt: Date.now(),
  })

  return {
    success: true,
    message: 'Session created',
  }
})
