<template>
  <header
    class="border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm sticky top-0 z-50 bg-white/75 dark:bg-gray-900/75"
  >
    <UContainer class="flex items-center justify-between h-16">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-bold text-xl text-primary-500 hover:text-primary-600 transition"
      >
        <UIcon name="i-heroicons-book-open" class="w-8 h-8" />
        <span>BeeredBlog</span>
      </NuxtLink>

      <div class="flex items-center gap-4">
        <UButton
          variant="ghost"
          color="neutral"
          to="/blogs"
          class="hidden md:flex"
        >
          Read Blogs
        </UButton>

        <div
          v-if="loading"
          class="w-8 h-8 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full"
        ></div>

        <template v-else-if="loggedIn && user">
          <UButton
            to="/dashboard/create"
            icon="i-heroicons-pencil-square"
            color="primary"
            variant="soft"
            class="hidden sm:flex"
          >
            Write
          </UButton>

          <UDropdownMenu
            :items="userMenuItems"
            :popper="{ placement: 'bottom-end' }"
          >
            <UAvatar
              :src="
                currentUserStore.currentUser?.avatar ||
                user.avatar ||
                'https://i.pravatar.cc/150'
              "
              :alt="currentUserStore.currentUser?.username"
              size="sm"
              class="cursor-pointer ring-2 ring-transparent hover:ring-primary-500 transition"
            />
          </UDropdownMenu>
        </template>

        <template v-else>
          <UButton variant="ghost" color="neutral" to="/login">Log in</UButton>
          <UButton color="primary" to="/signup">Get Started</UButton>
        </template>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const { user, loggedIn, clear } = useUserSession()
const currentUserStore = useCurrentUserStore()
const config = useRuntimeConfig()
const loading = ref(true)

onMounted(async () => {
  if (loggedIn.value && user.value?.userId) {
    await currentUserStore.fetchCurrentUser(config, user.value.userId)
  }
  loading.value = false
})

const handleLogout = async () => {
  await clear()
  currentUserStore.clearCurrentUser()
  await navigateTo('/login')
}

const userMenuItems = computed(() => [
  [
    {
      label: 'Signed in as',
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/dashboard',
    },
    {
      label: 'My Profile',
      icon: 'i-heroicons-user',
      to: currentUserStore.currentUser?.username
        ? `/profile/${currentUserStore.currentUser.username}`
        : '/dashboard',
    },
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/settings',
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: handleLogout,
    },
  ],
])
</script>
