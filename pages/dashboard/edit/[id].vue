<template>
  <div
    class="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900"
  >
    <div
      v-if="loading"
      class="flex-1 flex flex-col items-center justify-center min-h-[60vh]"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 animate-spin text-primary-500 mb-4"
      />
      <p class="text-gray-500 animate-pulse">Loading your story...</p>
    </div>

    <template v-else>
      <header
        class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800"
      >
        <UContainer class="flex items-center justify-between h-16 gap-4">
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <UButton
              to="/dashboard"
              icon="i-heroicons-arrow-left"
              variant="ghost"
              color="neutral"
              class="shrink-0"
            />
            <div class="h-8 w-px bg-gray-200 dark:bg-gray-800 shrink-0" />
            <input
              v-model="form.title"
              type="text"
              placeholder="Post Title"
              class="bg-transparent border-none focus:ring-0 text-lg md:text-xl font-bold text-gray-900 dark:text-white w-full placeholder-gray-400"
              @input="onTitleInput"
            />
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <div
              v-if="isDirty"
              class="text-xs text-amber-500 font-medium mr-2 hidden sm:block"
            >
              ● Unsaved changes
            </div>

            <UButton
              :icon="showPreview ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              color="neutral"
              variant="ghost"
              class="hidden sm:flex"
              @click="togglePreview"
            >
              {{ showPreview ? 'Edit Only' : 'Preview' }}
            </UButton>

            <UButton
              variant="ghost"
              color="neutral"
              :loading="savingDraft"
              @click="handleAction('draft')"
            >
              Save Draft
            </UButton>

            <UButton
              color="primary"
              icon="i-heroicons-arrow-path"
              :loading="updating"
              @click="handleAction('published')"
            >
              Update
            </UButton>

            <UButton
              :icon="
                showSidebar
                  ? 'i-heroicons-chevron-double-right'
                  : 'i-heroicons-chevron-double-left'
              "
              color="neutral"
              variant="soft"
              class="ml-2"
              @click="showSidebar = !showSidebar"
            />
          </div>
        </UContainer>
      </header>

      <main class="flex-1 flex overflow-hidden">
        <div class="flex-1 flex flex-col min-w-0">
          <div
            class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-hide"
          >
            <UTooltip text="Bold (Cmd+B)">
              <UButton
                icon="i-heroicons-bold"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('**', '**')"
              />
            </UTooltip>
            <UTooltip text="Italic (Cmd+I)">
              <UButton
                icon="i-heroicons-italic"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('*', '*')"
              />
            </UTooltip>
            <div class="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
            <UTooltip text="Heading 2">
              <UButton
                label="H2"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('## ', '')"
              />
            </UTooltip>
            <UTooltip text="Heading 3">
              <UButton
                label="H3"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('### ', '')"
              />
            </UTooltip>
            <div class="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
            <UTooltip text="Code Block">
              <UButton
                icon="i-heroicons-code-bracket"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('```\n', '\n```')"
              />
            </UTooltip>
            <UTooltip text="Link">
              <UButton
                icon="i-heroicons-link"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('[', '](url)')"
              />
            </UTooltip>
            <UTooltip text="Image">
              <UButton
                icon="i-heroicons-photo"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('![alt text](', ')')"
              />
            </UTooltip>
            <div class="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2" />
            <UTooltip text="Quote">
              <UButton
                icon="i-heroicons-chat-bubble-bottom-center-text"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('> ', '')"
              />
            </UTooltip>
            <UTooltip text="List">
              <UButton
                icon="i-heroicons-list-bullet"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertMarkdown('- ', '')"
              />
            </UTooltip>
            <UTooltip text="Table">
              <UButton
                icon="i-heroicons-table-cells"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="insertTable"
              />
            </UTooltip>
          </div>

          <div class="flex-1 flex overflow-hidden relative">
            <div
              ref="editorContainerRef"
              :class="[
                'h-full overflow-y-auto bg-white dark:bg-gray-900 scroll-smooth',
                showPreview
                  ? 'w-1/2 border-r border-gray-200 dark:border-gray-800 hidden md:block'
                  : 'w-full',
              ]"
              @scroll="handleScroll('editor')"
            >
              <textarea
                ref="editorRef"
                v-model="form.content"
                class="w-full h-full p-6 resize-none focus:outline-none bg-transparent font-mono text-sm leading-relaxed dark:text-gray-200"
                placeholder="# Start writing your story..."
                @input="handleInput"
                @keydown.meta.b.prevent="insertMarkdown('**', '**')"
                @keydown.ctrl.b.prevent="insertMarkdown('**', '**')"
                @keydown.meta.i.prevent="insertMarkdown('*', '*')"
                @keydown.ctrl.i.prevent="insertMarkdown('*', '*')"
                @keydown.tab.prevent="insertTab"
              ></textarea>
            </div>

            <div
              v-show="showPreview"
              ref="previewContainerRef"
              class="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 md:p-12 scroll-smooth"
              @scroll="handleScroll('preview')"
            >
              <div
                class="prose dark:prose-invert max-w-none prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-img:rounded-lg"
              >
                <h1 v-if="form.title" class="mb-8">{{ form.title }}</h1>

                <div
                  v-if="!form.content && !form.title"
                  class="text-gray-400 italic flex flex-col items-center justify-center h-64"
                >
                  <UIcon
                    name="i-heroicons-eye"
                    class="w-12 h-12 mb-2 opacity-30"
                  />
                  Start typing to see preview
                </div>

                <ContentRenderer
                  v-else-if="parsedContent"
                  :value="parsedContent"
                />
              </div>
            </div>

            <div
              class="absolute bottom-4 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-xs text-gray-500 pointer-events-none z-10"
            >
              {{ wordCount }} words
            </div>
          </div>
        </div>

        <aside
          v-if="showSidebar"
          class="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto p-4 flex flex-col gap-6 shrink-0 transition-all"
        >
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
              Post Settings
            </h3>
            <div class="space-y-5">
              <div
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm space-y-2"
              >
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Views</span>
                  <span class="font-medium flex items-center gap-1"
                    ><UIcon name="i-heroicons-eye" />
                    {{ postStats.views }}</span
                  >
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Likes</span>
                  <span class="font-medium flex items-center gap-1"
                    ><UIcon name="i-heroicons-heart" />
                    {{ postStats.likes }}</span
                  >
                </div>
                <div
                  class="text-xs text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700"
                >
                  Updated:
                  {{ new DateTime(postStats.updatedAt).formatChatTime() }}
                </div>
              </div>

              <div class="space-y-1">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >Slug</label
                >
                <UInput
                  v-model="form.slug"
                  icon="i-heroicons-link"
                  placeholder="post-url-slug"
                  color="neutral"
                />
                <p v-if="errors.slug" class="text-xs text-red-500">
                  {{ errors.slug }}
                </p>
              </div>

              <div class="space-y-1">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >Description</label
                >
                <UTextarea
                  v-model="form.description"
                  placeholder="SEO description..."
                  :rows="3"
                  @input="isDirty = true"
                />
              </div>

              <div class="space-y-1">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >Category</label
                >
                <USelectMenu
                  v-model="form.category"
                  :items="availableCategories"
                  placeholder="Select or type category"
                  icon="i-heroicons-folder"
                  create-item
                  @create="onCreateCategory"
                />
                <p class="text-xs text-gray-500">
                  Select from list or type a new category
                </p>
              </div>

              <div class="space-y-2">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >Tags</label
                >

                <!-- Selected Tags -->
                <div
                  v-if="selectedTags.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <UBadge
                    v-for="tag in selectedTags"
                    :key="tag"
                    variant="subtle"
                    class="cursor-pointer group"
                  >
                    <span>{{ tag }}</span>
                    <UIcon
                      name="i-heroicons-x-mark"
                      class="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100"
                      @click="removeTag(tag)"
                    />
                  </UBadge>
                </div>

                <!-- Add Tag Input -->
                <div class="flex gap-2">
                  <UInput
                    v-model="newTagInput"
                    placeholder="Add a tag..."
                    icon="i-heroicons-tag"
                    class="flex-1"
                    @keydown.enter.prevent="handleAddNewTag"
                  />
                  <UButton
                    icon="i-heroicons-plus"
                    color="primary"
                    variant="soft"
                    :loading="isCreatingTag"
                    @click="handleAddNewTag"
                  />
                </div>

                <!-- Available Tags -->
                <div v-if="availableTags.length > 0" class="space-y-1">
                  <p class="text-xs text-gray-500">Quick add:</p>
                  <div class="flex flex-wrap gap-1">
                    <UButton
                      v-for="tag in availableTags.filter(
                        (t) => !selectedTags.includes(t.name),
                      )"
                      :key="tag.id"
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      @click="addTag(tag.name)"
                    >
                      {{ tag.name }}
                    </UButton>
                  </div>
                </div>
              </div>

              <div class="space-y-1">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >Cover Image</label
                >
                <UInput
                  v-model="form.coverImage"
                  icon="i-heroicons-photo"
                  placeholder="https://..."
                />
                <div
                  v-if="form.coverImage"
                  class="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video relative group"
                >
                  <img
                    :src="form.coverImage"
                    class="w-full h-full object-cover"
                    onerror="this.style.display = 'none'"
                  />
                </div>
              </div>

              <UDivider class="my-4" />

              <UButton
                block
                color="error"
                variant="outline"
                icon="i-heroicons-trash"
                @click="handleDelete"
              >
                Delete Post
              </UButton>
            </div>
          </div>
        </aside>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { getPost } from '~/scripts/backend/posts/postsOperations'
import {
  getTagsByPost,
  getAllTags,
  createTag as createTagAPI,
} from '~/scripts/backend/tags/tagsOperations'
import type { Tags } from '~/scripts/types/tags/Tags'
import 'highlight.js/styles/atom-one-dark.css'
import { DateTime } from '~/scripts/DateTime'

definePageMeta({
  middleware: 'auth',
  layout: false,
})

useHead({ title: 'Edit Post - JavaBlog' })

const route = useRoute()
const router = useRouter()
const { user } = useUserSession()
const toast = useToast()
const config = useRuntimeConfig()
const currentUserStore = useCurrentUserStore()

const slugParam = route.params.id as string
const backendPostId = ref<string>('')
const originalSlug = ref<string>('')

const editorContainerRef = ref<HTMLElement | null>(null)
const previewContainerRef = ref<HTMLElement | null>(null)
const editorRef = ref<HTMLTextAreaElement | null>(null)
const isScrolling = ref(false)

const loading = ref(true)
const showPreview = ref(true)
const showSidebar = ref(true)
const isDirty = ref(false)
const savingDraft = ref(false)
const updating = ref(false)
const parsedContent = ref<any>(null)

const availableTags = ref<Tags[]>([])
const selectedTags = ref<string[]>([])
const newTagInput = ref('')
const isCreatingTag = ref(false)

const form = reactive({
  title: '',
  slug: '',
  coverImage: '',
  category: 'Technology',
  content: '',
  description: '',
  status: 'draft',
})

const availableCategories = [
  'Technology',
  'Java',
  'Nuxt',
  'Web Development',
  'DevOps',
  'Tutorial',
  'Other',
]

const postStats = reactive({
  views: 0,
  likes: 0,
  updatedAt: '',
})

const errors = reactive({
  title: '',
  slug: '',
  content: '',
})

const wordCount = computed(() => {
  if (!form.content) return 0
  return form.content.trim().split(/\s+/).length
})

const updatePreview = useDebounceFn(async (content: string) => {
  if (!content) {
    parsedContent.value = null
    return
  }
  try {
    parsedContent.value = await parseMarkdown(content)
  } catch (e) {
    console.error('Markdown parsing failed', e)
  }
}, 300)

const handleInput = () => {
  isDirty.value = true
  errors.content = ''
  updatePreview(form.content)
}

const onTitleInput = () => {
  isDirty.value = true
  errors.title = ''

  if (!form.slug || form.slug === generateSlug(form.title.slice(0, -1))) {
    form.slug = generateSlug(form.title)
  }
}

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
  if (showPreview.value) updatePreview(form.content)
}

const onCreateCategory = (newCategory: string) => {
  if (
    !availableCategories.includes(newCategory) &&
    newCategory.trim().length > 0
  ) {
    availableCategories.push(newCategory)
  }
}

const handleScroll = (source: 'editor' | 'preview') => {
  if (isScrolling.value) return
  isScrolling.value = true

  const editor = editorContainerRef.value
  const preview = previewContainerRef.value

  if (editor && preview) {
    if (source === 'editor') {
      const percentage =
        editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
      preview.scrollTop =
        percentage * (preview.scrollHeight - preview.clientHeight)
    } else {
      const percentage =
        preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
      editor.scrollTop =
        percentage * (editor.scrollHeight - editor.clientHeight)
    }
  }

  setTimeout(() => {
    isScrolling.value = false
  }, 50)
}

const insertTab = () => {
  if (!editorRef.value) return
  const start = editorRef.value.selectionStart
  const end = editorRef.value.selectionEnd
  form.content =
    form.content.substring(0, start) + '  ' + form.content.substring(end)
  nextTick(() => {
    editorRef.value!.selectionStart = editorRef.value!.selectionEnd = start + 2
    handleInput()
  })
}

const insertMarkdown = (prefix: string, suffix: string) => {
  if (!editorRef.value) return
  const start = editorRef.value.selectionStart
  const end = editorRef.value.selectionEnd
  const text = form.content
  const selectedText = text.substring(start, end)

  form.content =
    text.substring(0, start) +
    prefix +
    selectedText +
    suffix +
    text.substring(end)

  nextTick(() => {
    editorRef.value?.focus()
    const newPos =
      selectedText.length > 0
        ? end + prefix.length + suffix.length
        : start + prefix.length
    editorRef.value?.setSelectionRange(newPos, newPos)
    handleInput()
  })
}

const insertTable = () => {
  const tableTemplate = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`
  insertMarkdown(tableTemplate, '')
}

const fetchAvailableTags = async () => {
  const response = await getAllTags(config)
  if (response.success && response.tags) {
    availableTags.value = response.tags
  }
}

const addTag = (tagName: string) => {
  const trimmed = tagName.trim()
  if (trimmed && !selectedTags.value.includes(trimmed)) {
    selectedTags.value.push(trimmed)
    isDirty.value = true
  }
}

const removeTag = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tagName)
  isDirty.value = true
}

const handleAddNewTag = async () => {
  if (!newTagInput.value.trim()) return

  const tagName = newTagInput.value.trim()

  const existingTag = availableTags.value.find(
    (t) => t.name.toLowerCase() === tagName.toLowerCase(),
  )

  if (existingTag) {
    addTag(existingTag.name)
    newTagInput.value = ''
    return
  }

  isCreatingTag.value = true
  try {
    const response = await createTagAPI(config, tagName)
    if (response.success) {
      await fetchAvailableTags()
      addTag(tagName)
      toast.add({
        title: 'Tag created',
        description: `Tag "${tagName}" has been created`,
        color: 'success',
      })
    } else {
      toast.add({
        title: 'Error',
        description: response.message || 'Failed to create tag',
        color: 'error',
      })
    }
  } catch (error: any) {
    console.error('Error creating tag:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to create tag',
      color: 'error',
    })
  } finally {
    isCreatingTag.value = false
    newTagInput.value = ''
  }
}

const validate = () => {
  let isValid = true
  errors.title = ''
  errors.slug = ''
  errors.content = ''

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }
  if (!form.slug.trim()) {
    errors.slug = 'Slug is required'
    isValid = false
  }
  if (!form.content.trim()) {
    errors.content = 'Content is empty'
    isValid = false
  }

  return isValid
}

const handleAction = async (status: 'draft' | 'published') => {
  if (!validate()) {
    toast.add({ title: 'Validation Error', color: 'error' })
    if (!showSidebar.value) showSidebar.value = true
    return
  }

  const currentUser = currentUserStore.currentUser
  if (!currentUser) return

  if (status === 'draft') savingDraft.value = true
  else updating.value = true

  try {
    const description =
      form.description || form.content.substring(0, 200).trim() + '...'

    await $fetch('/api/content/update', {
      method: 'POST',
      body: {
        postId: backendPostId.value,
        oldSlug: originalSlug.value,
        title: form.title,
        slug: form.slug,
        description,
        content: form.content,
        author:
          currentUser.username ||
          currentUser.firstName + ' ' + currentUser.lastName ||
          'Anonymous',
        authorId: currentUser.id,
        coverImage: form.coverImage || '',
        category: form.category,
        tags: selectedTags.value,
        status,
        date: new Date().toISOString().split('T')[0],
      },
    })

    originalSlug.value = form.slug

    if (slugParam !== form.slug) {
      await router.replace(`/dashboard/edit/${form.slug}`)
    }

    isDirty.value = false
    toast.add({
      title: 'Success',
      description:
        status === 'draft' ? 'Draft saved.' : 'Post updated successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error: any) {
    console.error('Update error:', error)
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to update',
      color: 'error',
    })
  } finally {
    savingDraft.value = false
    updating.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure? This cannot be undone.')) return

  try {
    await $fetch('/api/content/delete', {
      method: 'POST',
      body: {
        slug: form.slug,
        postId: backendPostId.value,
      },
    })

    toast.add({
      title: 'Deleted',
      description: 'Post removed.',
      color: 'success',
    })
    router.push('/dashboard')
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete.',
      color: 'error',
    })
  }
}

watch(form, () => (isDirty.value = true), { deep: true })

onMounted(async () => {
  if (user.value?.userId) {
    await currentUserStore.fetchCurrentUser(config, user.value.userId, true)
  }

  try {
    await fetchAvailableTags()

    const postData = await getPost(config, slugParam)
    if (!postData.success || !postData.post) {
      throw new Error('Post not found')
    }

    const currentUserId = currentUserStore.currentUser?.id
    if (!currentUserId || postData.post.authorId !== currentUserId) {
      toast.add({
        title: 'Unauthorized',
        description: 'Access denied.',
        color: 'error',
      })
      return navigateTo('/dashboard')
    }

    backendPostId.value = postData.post.id
    originalSlug.value = postData.post.slug
    form.title = postData.post.title
    form.slug = postData.post.slug
    form.description = postData.post.excerpt || ''
    form.coverImage = postData.post.coverImage || ''
    form.category = postData.post.category || 'Technology'
    form.status = postData.post.status

    postStats.views = postData.post.views
    postStats.likes = postData.post.likes
    postStats.updatedAt = postData.post.updatedAt

    const tagsResponse = await getTagsByPost(config, postData.post.id)
    if (
      tagsResponse.success &&
      tagsResponse.tags &&
      tagsResponse.tags.length > 0
    ) {
      selectedTags.value = tagsResponse.tags.map((t) => t.name)
    }

    const contentResponse = await $fetch<{ success: boolean; content: string }>(
      '/api/content/read',
      {
        method: 'GET',
        params: { slug: postData.post.slug },
      },
    )

    if (contentResponse.success) {
      form.content = contentResponse.content
    }

    updatePreview(form.content)
  } catch (error) {
    console.error('Error loading post:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load post',
      color: 'error',
    })
    navigateTo('/dashboard')
  } finally {
    loading.value = false
  }
})

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    const confirmed = confirm('You have unsaved changes. Leave anyway?')
    next(confirmed)
  } else {
    next()
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style>
