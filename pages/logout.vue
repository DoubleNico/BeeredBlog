<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--color-primary-500),0.05)_0%,transparent_100%)]"
    />

    <UCard class="w-full max-w-md relative shadow-2xl">
      <div class="text-center space-y-6">
        <div
          class="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto"
        >
          <UIcon
            name="i-heroicons-arrow-right-on-rectangle"
            class="w-10 h-10 text-primary-500"
          />
        </div>

        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Logging Out...
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Please wait while we securely log you out
          </p>
        </div>

        <div class="flex justify-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 text-primary-500 animate-spin"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { clear } = useUserSession()
const userStore = useCurrentUserStore()

onMounted(async () => {
  try {
    await $fetch('/api/logout', {
      method: 'POST',
    })

    await clear()

    userStore.clearCurrentUser()

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
    await navigateTo('/')
  }
})

useHead({
  title: 'Logging Out - JavaBlog',
})
</script>
