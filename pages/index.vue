<template>
  <div class="flex flex-col">
    <section class="py-24 sm:py-32 relative overflow-hidden">
      <div
        class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary-100),white)] opacity-20 dark:bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary-900),var(--color-gray-900))]"
      />

      <UContainer class="text-center">
        <div
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="max-w-2xl mx-auto"
        >
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
          >
            <span v-if="loggedIn && currentUserStore.currentUser">
              Welcome back,
              {{ currentUserStore.currentUser.lastName }}.
            </span>
            <span v-else> Share your story with the world. </span>
          </h1>

          <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            A minimalist platform for developers and writers. Write in Markdown,
            manage your content easily, and build your audience.
          </p>

          <div class="mt-10 flex items-center justify-center gap-x-6">
            <template v-if="loggedIn">
              <UButton size="xl" to="/dashboard" icon="i-heroicons-squares-2x2">
                Go to Dashboard
              </UButton>
              <UButton
                size="xl"
                variant="soft"
                to="/dashboard/create"
                icon="i-heroicons-pencil-square"
              >
                Write New Post
              </UButton>
            </template>

            <template v-else>
              <UButton size="xl" to="/signup" icon="i-heroicons-rocket-launch">
                Start Writing
              </UButton>
              <UButton
                size="xl"
                variant="outline"
                to="/blogs"
                icon="i-heroicons-book-open"
              >
                Read Blogs
              </UButton>
            </template>
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-16 bg-gray-50 dark:bg-gray-900/50">
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UCard
            v-motion-slide-visible-once-bottom
            class="ring-1 ring-gray-200 dark:ring-gray-800 transition-all hover:ring-primary-500 dark:hover:ring-primary-400"
          >
            <template #header>
              <UIcon
                name="i-heroicons-pencil-square"
                class="w-10 h-10 text-primary-500 mb-2"
              />
              <h3 class="text-xl font-semibold">Markdown First</h3>
            </template>
            <p class="text-gray-600 dark:text-gray-400">
              Write exactly how you code. Full Markdown support with syntax
              highlighting out of the box.
            </p>
          </UCard>

          <UCard
            v-motion-slide-visible-once-bottom
            class="ring-1 ring-gray-200 dark:ring-gray-800 transition-all hover:ring-primary-500 dark:hover:ring-primary-400"
            :delay="200"
          >
            <template #header>
              <UIcon
                name="i-heroicons-chat-bubble-left-right"
                class="w-10 h-10 text-primary-500 mb-2"
              />
              <h3 class="text-xl font-semibold">Community Driven</h3>
            </template>
            <p class="text-gray-600 dark:text-gray-400">
              Engage with readers through our integrated comment system and grow
              your following.
            </p>
          </UCard>

          <UCard
            v-motion-slide-visible-once-bottom
            class="ring-1 ring-gray-200 dark:ring-gray-800 transition-all hover:ring-primary-500 dark:hover:ring-primary-400"
            :delay="400"
          >
            <template #header>
              <UIcon
                name="i-heroicons-bolt"
                class="w-10 h-10 text-primary-500 mb-2"
              />
              <h3 class="text-xl font-semibold">Blazing Fast</h3>
            </template>
            <p class="text-gray-600 dark:text-gray-400">
              Powered by Nuxt 4 and a robust Javalin backend, your blogs load
              instantly.
            </p>
          </UCard>
        </div>
      </UContainer>
    </section>

    <section v-if="featuredPosts.length > 0" class="py-16">
      <UContainer>
        <div class="text-center mb-12">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Featured Articles
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover the latest insights from our community
          </p>
        </div>

        <div v-if="loading" class="flex justify-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 animate-spin text-primary-500"
          />
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <UCard
            v-for="post in featuredPosts"
            :key="post.id"
            class="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
            @click="navigateTo(`/blogs/${post.slug}`)"
          >
            <template #header>
              <img
                :src="
                  post.coverImage ||
                  'https://placehold.co/600x400?text=No+Image'
                "
                :alt="post.title"
                class="h-48 object-cover rounded-t-lg -mx-4 -mt-4 w-[calc(100%+2rem)] max-w-[calc(100%+2rem)]"
              />
            </template>

            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2 mb-2">
                <UBadge
                  v-if="post.category"
                  color="primary"
                  variant="subtle"
                  size="xs"
                >
                  {{ post.category }}
                </UBadge>
                <span class="text-xs text-gray-500">{{
                  new DateTime(post.publishedAt).formatChatTime()
                }}</span>
              </div>

              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2"
              >
                {{ post.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">
                {{ post.excerpt }}
              </p>
            </div>

            <template #footer>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-eye" /> {{ post.views }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-heart" /> {{ post.likes }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-chat-bubble-left" />
                  {{ post.commentsCount }}
                </span>
              </div>
            </template>
          </UCard>
        </div>

        <div class="text-center mt-12">
          <UButton
            size="lg"
            variant="outline"
            to="/blogs"
            icon="i-heroicons-arrow-right"
          >
            View All Articles
          </UButton>
        </div>
      </UContainer>
    </section>

    <section v-if="!loggedIn" class="py-24">
      <UContainer class="text-center">
        <h2
          class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          Ready to publish?
        </h2>
        <p
          class="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300"
        >
          Join thousands of other writers. Creating an account is free and
          managing your content is easier than ever.
        </p>
        <div class="mt-10">
          <UButton
            size="lg"
            color="neutral"
            variant="solid"
            icon="i-simple-icons-github"
            @click="handleSocialLogin()"
          >
            Login with GitHub
          </UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getPublishedPosts } from '~/scripts/backend/posts/postsOperations'
import { DateTime } from '~/scripts/DateTime'
import type { Posts } from '~/scripts/types/posts/Posts'

definePageMeta({
  layout: 'default',
})

const { loggedIn, user } = useUserSession()
const config = useRuntimeConfig()
const currentUserStore = useCurrentUserStore()

const featuredPosts = ref<Posts[]>([])
const loading = ref(true)

const fetchUserData = async () => {
  if (loggedIn.value && user.value?.userId) {
    await currentUserStore.fetchCurrentUser(config, user.value.userId, true)
  }
}

const fetchFeaturedPosts = async () => {
  loading.value = true
  try {
    const response = await getPublishedPosts(config)
    if (response.success && response.posts) {
      featuredPosts.value = response.posts.slice(0, 6)
    }
  } catch (error) {
    console.error('Error fetching featured posts:', error)
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = () => {
  return navigateTo('/auth/github', { external: true })
}

onMounted(async () => {
  await Promise.all([fetchUserData(), fetchFeaturedPosts()])
})

useHead({
  title: 'JavaBlog - Write and Share',
  meta: [
    {
      name: 'description',
      content: 'A simple blog platform built with Nuxt and Javalin.',
    },
  ],
})
</script>
