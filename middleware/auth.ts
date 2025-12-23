export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetch } = useUserSession()

  if (!loggedIn.value) {
    await fetch()
  }

  if (!loggedIn.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  if (loggedIn.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
