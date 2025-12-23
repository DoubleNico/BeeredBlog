<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <div v-if="!post" class="flex items-center justify-center min-h-[60vh]">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 animate-spin text-primary-500"
      />
    </div>

    <article v-else class="py-12 grow">
      <UContainer>
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          <div class="mb-10 text-center md:text-left">
            <div
              class="flex flex-wrap gap-2 mb-6 justify-center md:justify-start"
            >
              <UBadge
                v-for="tag in post.tags"
                :key="tag"
                variant="subtle"
                size="sm"
                class="capitalize"
              >
                {{ tag }}
              </UBadge>
            </div>

            <h1
              class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {{ post.title }}
            </h1>

            <div
              class="flex flex-col md:flex-row items-center gap-6 border-b border-gray-200 dark:border-gray-800 pb-8"
            >
              <div class="flex items-center gap-3">
                <UAvatar
                  :src="author?.avatar || 'https://i.pravatar.cc/150'"
                  :alt="author?.username || 'Author'"
                  size="md"
                  class="ring-2 ring-white dark:ring-gray-900"
                />
                <div class="text-left">
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{
                      author
                        ? author.firstName + ' ' + author.lastName
                        : 'Unknown Author'
                    }}
                  </p>
                  <p class="text-sm text-gray-500">
                    @{{ author?.username?.toLowerCase().replace(/\s/g, '') }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  {{ new DateTime(post.date).formatMessageTime() }}
                </span>
                <span>•</span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                  {{ readingTime }} min read
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="post.coverImage"
            class="rounded-xl overflow-hidden shadow-lg mb-10 border border-gray-200 dark:border-gray-800"
          >
            <img
              :src="post.coverImage"
              :alt="post.title"
              class="w-full h-auto object-cover max-h-[500px]"
            />
          </div>

          <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ContentRenderer :value="post" />
          </div>

          <div
            class="flex items-center justify-between py-6 border-y border-gray-200 dark:border-gray-800 mb-12"
          >
            <div class="flex gap-4">
              <UButton
                :color="isLiked ? 'error' : 'neutral'"
                variant="ghost"
                icon="i-heroicons-heart"
                @click="toggleLike()"
              >
                {{ dynamicStats.likes }} Likes
              </UButton>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-chat-bubble-left"
                @click="scrollToComments"
              >
                {{ dynamicStats.commentsCount }} Comments
              </UButton>
            </div>

            <div class="flex gap-2">
              <UButton
                :icon="
                  isBookmarkedState
                    ? 'i-heroicons-bookmark-solid'
                    : 'i-heroicons-bookmark'
                "
                color="neutral"
                variant="ghost"
                @click="toggleBookmark()"
              />
              <UButton
                icon="i-heroicons-share"
                color="neutral"
                variant="ghost"
                @click="sharePost"
              />
            </div>
          </div>
        </div>

        <div ref="commentsRef" class="scroll-mt-24">
          <h3
            class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-chat-bubble-left-right"
              class="text-primary-500"
            />
            Comments ({{ comments.length }})
          </h3>

          <div v-if="user" class="mb-10 flex gap-4">
            <UAvatar
              :src="
                currentUserStore.currentUser?.avatar ||
                'https://i.pravatar.cc/150'
              "
              size="md"
              class="mt-1"
            />
            <div class="flex-1 space-y-3">
              <UTextarea
                v-model="newCommentContent"
                placeholder="Join the discussion..."
                :rows="3"
                class="w-full"
              />
              <div class="flex justify-end">
                <UButton
                  color="primary"
                  :loading="postingComment"
                  :disabled="!newCommentContent.trim()"
                  @click="handlePostComment"
                >
                  Post Comment
                </UButton>
              </div>
            </div>
          </div>
          <div
            v-else
            class="mb-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
          >
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Log in to join the conversation.
            </p>
            <UButton to="/login" color="primary" variant="soft">Log In</UButton>
          </div>

          <div v-if="loadingComments" class="space-y-4">
            <USkeleton v-for="i in 3" :key="i" class="h-24 w-full" />
          </div>

          <div v-else-if="comments.length > 0" class="space-y-6">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <UAvatar
                :src="comment.author?.avatar || 'https://i.pravatar.cc/150'"
                :alt="
                  comment.author?.firstName + ' ' + comment.author?.lastName ||
                  'User'
                "
                size="md"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{
                      comment.author?.firstName +
                        ' ' +
                        comment.author?.lastName || 'Anonymous'
                    }}
                  </span>
                  <span class="text-xs text-gray-500"
                    >•
                    {{ new DateTime(comment.createdAt).formatChatTime() }}</span
                  >
                </div>
                <p
                  class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                >
                  {{ comment.content }}
                </p>

                <div class="flex items-center gap-4 mt-3">
                  <button
                    class="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-500 transition"
                    @click="handleLikeComment(comment.id)"
                  >
                    <UIcon name="i-heroicons-heart" />
                    {{ comment.likes }}
                  </button>
                  <button
                    class="text-xs text-gray-500 hover:text-primary-500 transition"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700"
          >
            <UIcon
              name="i-heroicons-chat-bubble-oval-left"
              class="w-12 h-12 text-gray-400 mb-2 mx-auto"
            />
            <p class="text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        </div>
      </UContainer>
    </article>
  </div>
</template>

<script setup lang="ts">
import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from '~/scripts/backend/bookmarks/bookmarksOperations'
import { likePost, unlikePost } from '~/scripts/backend/likes/likesOperations'
import {
  getPostStats,
  incrementViews,
} from '~/scripts/backend/posts/postsOperations'
import { getUser } from '~/scripts/backend/user/userOperations'
import {
  getCommentsByPost,
  createComment,
  likeComment,
} from '~/scripts/backend/comments/commentsOperations'
import type { User } from '~/scripts/types/user/User'
import type { Comments } from '~/scripts/types/comments/Comments'
import { DateTime } from '~/scripts/DateTime'

interface EnrichedComment extends Comments {
  author?: User
}

const route = useRoute()
const config = useRuntimeConfig()
const toast = useToast()
const { user } = useUserSession()
const author = ref<User>()
const currentUserStore = useCurrentUserStore()
const commentsRef = ref<HTMLElement | null>(null)

const slug = route.params.slug as string
const contentPath = `/blogs/${slug}`

const { data: post } = await useAsyncData(`blogs-${slug}`, () => {
  return queryCollection('blogs').path(contentPath).first()
})

const isLiked = ref(false)
const isBookmarkedState = ref(false)
const comments = ref<EnrichedComment[]>([])
const loadingComments = ref(true)
const newCommentContent = ref('')
const postingComment = ref(false)

const dynamicStats = ref({
  views: 0,
  likes: 0,
  commentsCount: 0,
})

const readingTime = computed(() => {
  if (!post.value?.body) return 0
  const text = JSON.stringify(post.value.body)
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
})

const fetchComments = async (postId: string) => {
  loadingComments.value = true
  try {
    const res = await getCommentsByPost(config, postId)
    if (res.success && res.comments) {
      const hydrated = await Promise.all(
        res.comments.map(async (c) => {
          const authorRes = await getUser(config, c.authorId)
          return {
            ...c,
            author: authorRes.success ? authorRes.user : undefined,
          }
        }),
      )
      comments.value = hydrated
    }
  } catch (e) {
    console.error('Failed to load comments', e)
  } finally {
    loadingComments.value = false
  }
}

const handlePostComment = async () => {
  if (!user.value?.userId) return

  const postId = post.value?.postId

  if (!postId) {
    console.error('Cannot post comment: Missing Post ID')
    return
  }

  postingComment.value = true
  try {
    const res = await createComment(config, {
      content: newCommentContent.value,
      authorId: user.value.userId,
      postId: postId,
      parentCommentId: null,
    })

    if (res.success) {
      newCommentContent.value = ''
      dynamicStats.value.commentsCount++
      await fetchComments(postId)
    }
  } catch (e) {
    console.error('Error posting comment', e)
  } finally {
    postingComment.value = false
  }
}

const handleLikeComment = async (commentId: string) => {
  if (!user.value) return navigateTo('/login')

  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    const liked = await likeComment(config, commentId)
    if (liked.success) {
      toast.add({
        title: 'You liked a comment!',
        description:
          'You have liked the comment made by ' + comment.author?.username,
        color: 'success',
      })
      comment.likes++
    } else {
      toast.add({
        title: 'Could not like a post',
        description:
          'Could not like the comment made by ' +
          comment.author?.username +
          ' because of the error: ' +
          liked.message,
        color: 'error',
      })
    }
  }
}

onMounted(async () => {
  if (user.value?.userId) {
    await currentUserStore.fetchCurrentUser(config, user.value.userId, true)
  }

  if (!post.value) return
  console.log('id', post.value?.postId)

  if (post.value.authorId) {
    const authorData = await getUser(config, post.value.authorId)
    if (authorData.success) author.value = authorData.user
  }

  try {
    await incrementViews(config, post.value.postId || '', slug)

    const statsResponse = await getPostStats(config, slug)
    if (statsResponse.success && statsResponse.stats) {
      dynamicStats.value = {
        views: statsResponse.stats.views,
        likes: statsResponse.stats.likes,
        commentsCount: statsResponse.stats.commentsCount,
      }
      if (post.value.postId) {
        await fetchComments(post.value.postId)
        const bookmarkRes = await isBookmarked(
          config,
          user.value?.userId || '',
          post.value.postId,
        )
        if (bookmarkRes.success) {
          isBookmarkedState.value = bookmarkRes.isBookmarked
        }
      }
    }
  } catch (error) {
    console.error('Error syncing with backend:', error)
  }
})

async function toggleLike() {
  if (!user.value?.userId) return navigateTo('/login')

  if (isLiked.value) {
    const liked = await likePost(
      config,
      user.value.userId,
      post.value?.postId || '',
    )
    if (liked.success) {
      toast.add({
        title: 'You liked a post!',
        description: 'You have liked the post ' + post.value?.title,
        color: 'success',
      })
      dynamicStats.value.likes += isLiked.value ? 1 : -1
      isLiked.value = !isLiked.value
    } else {
      toast.add({
        title: 'Could not like a post',
        description:
          'You could not like the post ' +
          post.value?.title +
          ' because of the error: ' +
          liked.message,
        color: 'error',
      })
    }
  } else {
    const liked = await unlikePost(
      config,
      user.value.userId,
      post.value?.postId || '',
    )
    if (liked.success) {
      toast.add({
        title: 'You unliked a post!',
        description: 'You have unliked the post ' + post.value?.title,
        color: 'success',
      })
      dynamicStats.value.likes += isLiked.value ? 1 : -1
      isLiked.value = !isLiked.value
    } else {
      toast.add({
        title: 'Could not unlike a post',
        description:
          'You could not unlike the post ' +
          post.value?.title +
          ' because of the error: ' +
          liked.message,
        color: 'error',
      })
    }
  }
}

async function toggleBookmark() {
  if (!user.value?.userId) return navigateTo('/login')
  isBookmarkedState.value = !isBookmarkedState.value

  if (isBookmarkedState.value) {
    const bookmark = await addBookmark(
      config,
      user.value.userId,
      post.value?.postId || '',
    )
    if (bookmark.success) {
      toast.add({
        title: 'You added a bookmark!',
        description: 'Bookmark has been added in the post ' + post.value?.title,
        color: 'success',
      })
    } else {
      toast.add({
        title: 'Could not add a bookmark!',
        description:
          'Bookmark has not been added in the post ' +
          post.value?.title +
          ' because of the error: ' +
          bookmark.message,
        color: 'error',
      })
    }
  } else {
    const bookmark = await removeBookmark(
      config,
      user.value.userId,
      post.value?.postId || '',
    )
    if (bookmark.success) {
      toast.add({
        title: 'You removed a bookmark!',
        description:
          'Bookmark has been removed in the post ' + post.value?.title,
        color: 'success',
      })
    } else {
      toast.add({
        title: 'Could not remove a bookmark!',
        description:
          'Bookmark has not been removed in the post ' +
          post.value?.title +
          ' because of the error: ' +
          bookmark.message,
        color: 'error',
      })
    }
  }
}

function sharePost() {
  if (navigator.share) {
    navigator.share({
      title: post.value?.title,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    toast.add({
      title: 'Succesfully copied to the clipboard!',
      color: 'success',
    })
  }
}

function scrollToComments() {
  commentsRef.value?.scrollIntoView({ behavior: 'smooth' })
}

useHead({
  title: post.value?.title,
  meta: [
    { name: 'description', content: post.value?.description },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:image', content: post.value?.coverImage },
  ],
})
</script>

<style scoped>
@reference 'tailwindcss';
@reference '@nuxt/ui';

.prose :deep(h1) {
  @apply text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4;
}
.prose :deep(h2) {
  @apply text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4;
}
.prose :deep(p) {
  @apply text-gray-700 dark:text-gray-300 mb-6 leading-relaxed;
}
.prose :deep(img) {
  @apply rounded-lg shadow-md my-8;
}
.prose :deep(pre) {
  @apply bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto mb-6 border border-gray-800;
}
</style>
