<template>
  <div class="py-8">
    <UContainer class="max-w-6xl">
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin text-primary-500"
        />
      </div>

      <div
        v-else-if="profileUser"
        v-motion
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-8"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      >
        <div
          class="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700"
        >
          <div
            class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200')] bg-cover bg-center opacity-20"
          />
        </div>

        <div class="px-8 pb-8">
          <div
            class="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 relative"
          >
            <UAvatar
              :src="profileUser.avatar || 'https://i.pravatar.cc/150'"
              :alt="
                profileUser.firstName + ' ' + profileUser.lastName ||
                'User Avatar'
              "
              size="2xl"
              class="ring-4 ring-white dark:ring-gray-800"
            />

            <div class="flex-1">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {{ profileUser.firstName + ' ' + profileUser.lastName }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mb-3">
                @{{ profileUser.username }}
              </p>
              <p class="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                {{ profileUser.bio || 'No bio available' }}
              </p>

              <div class="flex flex-wrap gap-4 text-sm">
                <div
                  class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                >
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  <span
                    >Joined
                    {{
                      new DateTime(profileUser.createdAt).formatMessageTime()
                    }}</span
                  >
                </div>
                <div
                  v-if="profileUser.location"
                  class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                >
                  <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                  <span>{{ profileUser.location }}</span>
                </div>
                <div v-if="profileUser.website" class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-link"
                    class="w-4 h-4 text-gray-600 dark:text-gray-400"
                  />
                  <a
                    :href="profileUser.website"
                    target="_blank"
                    class="text-primary-600 hover:underline"
                  >
                    {{ profileUser.website.replace('https://', '') }}
                  </a>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <UButton
                v-if="!isOwnProfile"
                :color="isFollowing ? 'neutral' : 'primary'"
                @click="toggleFollow"
              >
                {{ isFollowing ? 'Following' : 'Follow' }}
              </UButton>
              <UButton v-if="isOwnProfile" to="/settings" variant="outline">
                Edit Profile
              </UButton>
            </div>
          </div>

          <div
            class="flex gap-8 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ userStats.posts }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Posts</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ userStats.followers }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Followers</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ userStats.following }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Following</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatNumber(userStats.totalViews) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Views
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">User not found</p>
      </div>

      <div v-if="profileUser" class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1">
          <UTabs v-model="activeTab" :items="tabs" :content="true" class="mb-6">
            <template #posts>
              <div class="grid grid-cols-1 gap-6">
                <UCard
                  v-for="post in userPosts"
                  :key="post.id"
                  v-motion
                  class="hover:shadow-lg transition-shadow cursor-pointer"
                  :initial="{ opacity: 0, y: 20 }"
                  :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
                  @click="navigateTo(`/blogs/${post.slug}`)"
                >
                  <div class="flex gap-4">
                    <img
                      v-if="post.coverImage"
                      :src="post.coverImage"
                      :alt="post.title || ''"
                      class="w-48 h-32 object-cover rounded-lg hidden sm:block"
                    />
                    <div class="flex-1 space-y-2">
                      <div
                        class="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <span>{{
                          new DateTime(post.publishedAt).formatChatTime()
                        }}</span>
                        <span>•</span>
                        <UBadge variant="subtle" size="xs">{{
                          post.category
                        }}</UBadge>
                      </div>
                      <h2
                        class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition"
                      >
                        {{ post.title }}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {{ post.excerpt }}
                      </p>
                      <div class="flex items-center justify-between pt-2">
                        <div
                          class="flex items-center gap-4 text-sm text-gray-500"
                        >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-heart" />
                            {{ post.likes }}</span
                          >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-chat-bubble-left" />
                            {{ post.commentsCount }}</span
                          >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-eye" />
                            {{ post.views }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>

              <div v-if="userPosts.length === 0" class="text-center py-12">
                <UIcon
                  name="i-heroicons-document-text"
                  class="w-16 h-16 mx-auto text-gray-400 mb-4"
                />
                <h3
                  class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  No posts yet
                </h3>
                <p class="text-gray-500">
                  {{ isOwnProfile ? "You haven't" : "This user hasn't" }}
                  published any posts yet
                </p>
              </div>
            </template>

            <template #liked>
              <div class="grid grid-cols-1 gap-6">
                <UCard
                  v-for="post in likedPosts"
                  :key="post.id"
                  v-motion
                  class="hover:shadow-lg transition-shadow cursor-pointer"
                  :initial="{ opacity: 0, y: 20 }"
                  :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
                  @click="navigateTo(`/blogs/${post.slug}`)"
                >
                  <div class="flex gap-4">
                    <img
                      v-if="post.coverImage"
                      :src="post.coverImage"
                      :alt="post.title || ''"
                      class="w-48 h-32 object-cover rounded-lg hidden sm:block"
                    />
                    <div class="flex-1 space-y-2">
                      <div
                        class="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <span>{{
                          new DateTime(post.publishedAt).formatChatTime()
                        }}</span>
                        <span>•</span>
                        <UBadge variant="subtle" size="xs">{{
                          post.category
                        }}</UBadge>
                      </div>
                      <h2
                        class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition"
                      >
                        {{ post.title }}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {{ post.excerpt }}
                      </p>
                      <div class="flex items-center justify-between pt-2">
                        <div
                          class="flex items-center gap-4 text-sm text-gray-500"
                        >
                          <span class="flex items-center gap-1 text-red-500"
                            ><UIcon name="i-heroicons-heart-solid" />
                            {{ post.likes }}</span
                          >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-chat-bubble-left" />
                            {{ post.commentsCount }}</span
                          >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-eye" />
                            {{ post.views }}</span
                          >
                        </div>
                        <span class="text-xs text-gray-400"
                          >Liked by {{ profileUser?.firstName }}</span
                        >
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>

              <div v-if="likedPosts.length === 0" class="text-center py-12">
                <UIcon
                  name="i-heroicons-heart"
                  class="w-16 h-16 mx-auto text-gray-400 mb-4"
                />
                <h3
                  class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  No liked posts
                </h3>
                <p class="text-gray-500">
                  Posts this user has liked will appear here
                </p>
              </div>
            </template>

            <template #saved>
              <div
                v-if="isOwnProfile || savedPosts.length > 0"
                class="grid grid-cols-1 gap-6"
              >
                <UCard
                  v-for="post in savedPosts"
                  :key="post.id"
                  v-motion
                  class="hover:shadow-lg transition-shadow cursor-pointer"
                  :initial="{ opacity: 0, y: 20 }"
                  :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
                  @click="navigateTo(`/blogs/${post.slug}`)"
                >
                  <div class="flex gap-4">
                    <img
                      v-if="post.coverImage"
                      :src="post.coverImage"
                      :alt="post.title || ''"
                      class="w-48 h-32 object-cover rounded-lg hidden sm:block"
                    />
                    <div class="flex-1 space-y-2">
                      <div
                        class="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <span>{{
                          new DateTime(post.publishedAt).formatChatTime()
                        }}</span>
                        <span>•</span>
                        <UBadge variant="subtle" size="xs">{{
                          post.category
                        }}</UBadge>
                      </div>
                      <h2
                        class="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition"
                      >
                        {{ post.title }}
                      </h2>
                      <p class="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {{ post.excerpt }}
                      </p>
                      <div class="flex items-center justify-between pt-2">
                        <div
                          class="flex items-center gap-4 text-sm text-gray-500"
                        >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-heart" />
                            {{ post.likes }}</span
                          >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-chat-bubble-left" />
                            {{ post.commentsCount }}</span
                          >
                          <span class="flex items-center gap-1"
                            ><UIcon name="i-heroicons-eye" />
                            {{ post.views }}</span
                          >
                        </div>
                        <UIcon
                          name="i-heroicons-bookmark-solid"
                          class="text-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </UCard>
              </div>

              <div v-if="savedPosts.length === 0" class="text-center py-12">
                <UIcon
                  name="i-heroicons-bookmark"
                  class="w-16 h-16 mx-auto text-gray-400 mb-4"
                />
                <h3
                  class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  No saved posts
                </h3>
                <p class="text-gray-500">Bookmarked posts will appear here</p>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { getUserByUsername } from '~/scripts/backend/user/userOperations'
import { getPostsByAuthor } from '~/scripts/backend/posts/postsOperations'
import { getLikedPostsByUser } from '~/scripts/backend/likes/likesOperations'
import { getBookmarkedPostsByUser } from '~/scripts/backend/bookmarks/bookmarksOperations'
import {
  follow,
  unfollow,
  isFollowing as checkIsFollowing,
  getFollowersCount,
  getFollowingCount,
} from '~/scripts/backend/followers/followersOperations'
import type { User } from '~/scripts/types/user/User'
import type { Posts } from '~/scripts/types/posts/Posts'
import { DateTime } from '~/scripts/DateTime'

const route = useRoute()
const { user } = useUserSession()
const config = useRuntimeConfig()
const toast = useToast()
const currentUser = useCurrentUserStore()
const username = route.params.username as string

const fetchUserData = async () => {
  if (!user.value?.userId) return null
  return await currentUser.fetchCurrentUser(config, user.value.userId, true)
}

const isFollowing = ref(false)
const loading = ref(true)
const profileUser = ref<User | null>(null)

const isOwnProfile = computed(
  () => user.value?.userId === profileUser.value?.id,
)

const activeTab = ref('posts')
const loadedTabs = ref(new Set())

const tabs = [
  {
    label: 'Posts',
    icon: 'i-heroicons-document-text',
    slot: 'posts',
    value: 'posts',
  },
  { label: 'Liked', icon: 'i-heroicons-heart', slot: 'liked', value: 'liked' },
  {
    label: 'Saved',
    icon: 'i-heroicons-bookmark',
    slot: 'saved',
    value: 'saved',
  },
]

const userStats = ref({
  posts: 0,
  followers: 0,
  following: 0,
  totalViews: 0,
})

const userPosts = ref<Posts[]>([])
const likedPosts = ref<Posts[]>([])
const savedPosts = ref<Posts[]>([])

async function fetchUserPosts() {
  if (!profileUser.value?.id || loadedTabs.value.has('posts')) return

  try {
    const postsRes = await getPostsByAuthor(config, profileUser.value.id)
    if (postsRes.success && postsRes.posts) {
      userPosts.value = postsRes.posts
      userStats.value.posts = postsRes.posts.length
      userStats.value.totalViews = postsRes.posts.reduce(
        (sum, post) => sum + (post.views || 0),
        0,
      )
      loadedTabs.value.add('posts')
    }
  } catch (error) {
    console.error('Error loading posts:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load posts',
      color: 'error',
    })
  }
}

async function fetchLikedPosts() {
  if (!profileUser.value?.id || loadedTabs.value.has('liked')) return

  try {
    const likedRes = await getLikedPostsByUser(config, profileUser.value.id)
    if (likedRes.success && likedRes.posts) {
      likedPosts.value = likedRes.posts
      loadedTabs.value.add('liked')
    }
  } catch (error) {
    console.error('Error loading liked posts:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load liked posts',
      color: 'error',
    })
  }
}

async function fetchSavedPosts() {
  if (!profileUser.value?.id || loadedTabs.value.has('saved')) return

  try {
    const savedRes = await getBookmarkedPostsByUser(
      config,
      profileUser.value.id,
    )
    if (savedRes.success && savedRes.posts) {
      savedPosts.value = savedRes.posts
      loadedTabs.value.add('saved')
    }
  } catch (error) {
    console.error('Error loading saved posts:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load saved posts',
      color: 'error',
    })
  }
}

watch(activeTab, async (newTab) => {
  if (newTab === 'posts') {
    await fetchUserPosts()
  } else if (newTab === 'liked') {
    await fetchLikedPosts()
  } else if (newTab === 'saved') {
    await fetchSavedPosts()
  }
})

onMounted(async () => {
  await fetchUserData()

  try {
    const userData = await getUserByUsername(config, username)
    if (userData.success && userData.user) {
      profileUser.value = userData.user

      if (userData.user.id) {
        await fetchUserPosts()

        const followersCount = await getFollowersCount(config, userData.user.id)
        if (followersCount.success)
          userStats.value.followers = followersCount.count

        const followingCount = await getFollowingCount(config, userData.user.id)
        if (followingCount.success)
          userStats.value.following = followingCount.count

        if (user.value?.userId && userData.user.id !== user.value.userId) {
          const isFollowingResult = await checkIsFollowing(
            config,
            user.value.userId,
            userData.user.id,
          )
          if (isFollowingResult.success)
            isFollowing.value = isFollowingResult.isFollowing
        }
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load profile',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
})

async function toggleFollow() {
  if (!user.value?.userId || !profileUser.value?.id) {
    toast.add({
      title: 'Error',
      description: 'Please log in to follow users',
      color: 'error',
    })
    return
  }

  try {
    if (isFollowing.value) {
      await unfollow(config, user.value.userId, profileUser.value.id)
      isFollowing.value = false
      userStats.value.followers--
    } else {
      await follow(config, user.value.userId, profileUser.value.id)
      isFollowing.value = true
      userStats.value.followers++
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update follow status',
      color: 'error',
    })
  }
}

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
</script>
