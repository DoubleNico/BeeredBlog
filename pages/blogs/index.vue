<template>
  <div class="py-8">
    <UContainer>
      <div class="mb-8">
        <h1
          v-motion
          class="text-4xl font-bold text-gray-900 dark:text-white mb-2"
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          Discover Stories
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Explore thousands of articles from our community
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="lg:w-64 space-y-6">
          <UCard>
            <template #header>
              <h3 class="font-semibold">Filters</h3>
            </template>

            <div class="space-y-4">
              <div>
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Search
                </label>
                <UInput
                  v-model="searchQuery"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Search posts..."
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Category
                </label>
                <USelectMenu
                  v-model="selectedCategory"
                  :items="categories"
                  placeholder="All Categories"
                />
              </div>

              <div>
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Sort By
                </label>
                <USelectMenu v-model="sortBy" :items="sortOptions" />
              </div>
            </div>
          </UCard>

          <UCard v-if="popularTags.length > 0">
            <template #header>
              <h3 class="font-semibold">Popular Tags</h3>
            </template>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in popularTags"
                :key="tag"
                variant="subtle"
                class="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900"
                @click="searchQuery = tag"
              >
                {{ tag }}
              </UBadge>
            </div>
          </UCard>
        </aside>

        <div class="flex-1">
          <div v-if="loading" class="flex justify-center py-12">
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-10 h-10 animate-spin text-primary-500"
            />
          </div>

          <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
            <UIcon
              name="i-heroicons-document-magnifying-glass"
              class="w-16 h-16 mx-auto text-gray-400 mb-4"
            />
            <h3
              class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              No posts found
            </h3>
            <p class="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard
              v-for="post in paginatedPosts"
              :key="post.id"
              v-motion
              class="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
              @click="navigateTo(`/blogs/${post.slug}`)"
            >
              <div class="space-y-3 flex-1 flex flex-col">
                <img
                  :src="
                    post.coverImage ||
                    'https://placehold.co/600x400?text=No+Image'
                  "
                  :alt="post.title"
                  class="w-full h-48 object-cover rounded-lg"
                />

                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">
                    {{ new DateTime(post.publishedAt).formatMessageTime() }}
                  </span>
                  <span v-if="post.category" class="text-gray-400">•</span>
                  <UBadge v-if="post.category" variant="subtle" size="xs">
                    {{ post.category }}
                  </UBadge>
                </div>

                <!-- Display tags if available -->
                <div
                  v-if="post.tags && post.tags.length > 0"
                  class="flex flex-wrap gap-1"
                >
                  <UBadge
                    v-for="tag in post.tags.slice(0, 3)"
                    :key="tag"
                    variant="soft"
                    size="xs"
                    class="text-xs"
                  >
                    {{ tag }}
                  </UBadge>
                  <UBadge
                    v-if="post.tags.length > 3"
                    variant="soft"
                    size="xs"
                    class="text-xs"
                  >
                    +{{ post.tags.length - 3 }}
                  </UBadge>
                </div>

                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {{ post.title }}
                </h2>

                <p class="text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                  {{ post.excerpt }}
                </p>

                <div
                  class="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-800"
                >
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <UIcon name="i-heroicons-heart" />
                      {{ post.likes || 0 }}
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="i-heroicons-chat-bubble-left" />
                      {{ post.commentsCount || 0 }}
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="i-heroicons-eye" />
                      {{ post.views || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <div
            v-if="filteredPosts.length > 0 && !loading"
            class="flex justify-center mt-8"
          >
            <UPagination
              v-model="currentPage"
              :page-count="pageSize"
              :total="filteredPosts.length"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { getPublishedPosts } from '~/scripts/backend/posts/postsOperations'
import { getTagsByPost } from '~/scripts/backend/tags/tagsOperations'
import { DateTime } from '~/scripts/DateTime'
import type { Posts } from '~/scripts/types/posts/Posts'

interface PostWithTags extends Posts {
  tags?: string[]
}

const { user } = useUserSession()
const currentUser = useCurrentUserStore()
const config = useRuntimeConfig()

const allPosts = ref<PostWithTags[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('All')
const sortBy = ref('Latest')
const currentPage = ref(1)
const pageSize = 12
const popularTags = ref<string[]>([])

const fetchUserData = async () => {
  if (!user.value?.userId) return null
  return await currentUser.fetchCurrentUser(config, user.value.userId, true)
}

const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await getPublishedPosts(config)
    if (response.success && response.posts) {
      const postsWithTags = await Promise.all(
        response.posts.map(async (post) => {
          const tagsResponse = await getTagsByPost(config, post.id)
          return {
            ...post,
            tags:
              tagsResponse.success && tagsResponse.tags
                ? tagsResponse.tags.map((t) => t.name)
                : [],
          }
        }),
      )
      allPosts.value = postsWithTags
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

const categories = computed(() => {
  const cats = new Set(['All'])
  allPosts.value.forEach((post) => {
    if (post.category) cats.add(post.category)
  })
  return Array.from(cats)
})

const filteredPosts = computed(() => {
  let filtered = [...allPosts.value]

  if (selectedCategory.value && selectedCategory.value !== 'All') {
    filtered = filtered.filter(
      (post) => post.category === selectedCategory.value,
    )
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        post.category?.toLowerCase().includes(query),
    )
  }

  if (sortBy.value === 'Popular') {
    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  } else if (sortBy.value === 'Trending') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() -
        new Date(a.publishedAt || 0).getTime(),
    )
  }

  return filtered
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPosts.value.slice(start, end)
})

const sortOptions = ['Latest', 'Popular', 'Trending']

const fetchPopularTags = async () => {
  const tagCount = new Map<string, number>()

  allPosts.value.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
      })
    }
  })

  popularTags.value = Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag)
}

onMounted(async () => {
  await fetchUserData()
  await fetchPosts()
  fetchPopularTags()
})
</script>
