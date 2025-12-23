<template>
  <div class="py-8">
    <UContainer class="space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard v-for="stat in stats" :key="stat.label">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {{ stat.label }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ stat.value }}
              </p>
            </div>
            <div :class="`p-2 rounded-lg ${stat.colorBg}`">
              <UIcon :name="stat.icon" :class="`w-6 h-6 ${stat.colorText}`" />
            </div>
          </div>
        </UCard>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div
          class="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4 items-center"
        >
          <div class="relative w-full sm:w-72">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Search posts..."
              size="md"
            />
          </div>
          <UButton
            to="/dashboard/create"
            icon="i-heroicons-plus"
            size="md"
            color="primary"
          >
            Create New Post
          </UButton>
        </div>

        <UTable
          :data="filteredRows"
          :columns="columns"
          :loading="loading"
          class="w-full"
        >
          <template #title-cell="{ row }">
            <div class="flex flex-col">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ row.original.title }}
              </span>
              <span class="text-xs text-gray-500">
                /{{ row.original.slug }}
              </span>
            </div>
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :color="
                row.original.status === 'published' ? 'primary' : 'neutral'
              "
              variant="subtle"
              size="xs"
              class="capitalize"
            >
              {{ row.original.status }}
            </UBadge>
          </template>

          <template #date-cell="{ row }">
            <span class="text-sm text-gray-500">
              {{ new DateTime(row.original.date).formatMessageTime() }}
            </span>
          </template>

          <template #actions-cell="{ row }">
            <div class="text-right">
              <UDropdownMenu
                :items="getItems(row.original)"
                :content="{ align: 'end' }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal"
                />
              </UDropdownMenu>
            </div>
          </template>
        </UTable>

        <div
          class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end"
        >
          <UPagination v-model="page" :total="posts.length" :page-count="5" />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPostsByAuthor } from '~/scripts/backend/posts/postsOperations'
import { DateTime } from '~/scripts/DateTime'

const { user } = useUserSession()
const config = useRuntimeConfig()
const currentUserStore = useCurrentUserStore()
const toast = useToast()

const fetchUserData = async () => {
  if (!user.value?.userId) return null
  return await currentUserStore.fetchCurrentUser(
    config,
    user.value.userId,
    true,
  )
}

interface BackendPost {
  id: string
  title: string
  slug: string
  status: string
  views: number
  publishedAt?: string
  createdAt: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft' | 'archived'
  views: number
  date: string
}

const search = ref('')
const page = ref(1)
const loading = ref(true)

const stats = computed(() => {
  const totalPosts = posts.value.length
  const totalViews = posts.value.reduce(
    (sum, post) => sum + (post.views || 0),
    0,
  )
  const publishedPosts = posts.value.filter(
    (p) => p.status === 'published',
  ).length

  return [
    {
      label: 'Total Posts',
      value: totalPosts.toString(),
      icon: 'i-heroicons-document-text',
      colorText: 'text-blue-600',
      colorBg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Total Views',
      value:
        totalViews > 1000
          ? `${(totalViews / 1000).toFixed(1)}k`
          : totalViews.toString(),
      icon: 'i-heroicons-eye',
      colorText: 'text-green-600',
      colorBg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Published',
      value: publishedPosts.toString(),
      icon: 'i-heroicons-check-circle',
      colorText: 'text-amber-600',
      colorBg: 'bg-amber-100 dark:bg-amber-900/20',
    },
    {
      label: 'Drafts',
      value: (totalPosts - publishedPosts).toString(),
      icon: 'i-heroicons-pencil-square',
      colorText: 'text-purple-600',
      colorBg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]
})

const columns: TableColumn<BlogPost>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'views',
    header: 'Views',
  },
  {
    accessorKey: 'date',
    header: 'Published Date',
  },
  {
    id: 'actions',
    header: '',
  },
]

const posts = ref<BlogPost[]>([])

onMounted(async () => {
  await fetchUserData()
  const userId = currentUserStore.currentUser?.id

  if (!userId) {
    loading.value = false
    return
  }

  try {
    const backendPosts = await getPostsByAuthor(config, userId)

    if (backendPosts.success && backendPosts.posts) {
      posts.value = (backendPosts.posts as BackendPost[]).map((post) => ({
        id: post.id,
        title: post.title || 'Untitled',
        slug: post.slug || '',
        status: (post.status as 'published' | 'draft' | 'archived') || 'draft',
        views: post.views || 0,
        date: post.publishedAt || post.createdAt || new Date().toISOString(),
      }))
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load posts',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
})

const filteredRows = computed(() => {
  if (!search.value) return posts.value
  return posts.value.filter((post) => {
    return Object.values(post).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase())
    })
  })
})

const getItems = (row: BlogPost) => [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    onSelect: () => navigateTo(`/dashboard/edit/${row.id}`),
  },
  {
    label: 'View Live',
    icon: 'i-heroicons-arrow-top-right-on-square',
    onSelect: () => window.open(`/blogs/${row.slug}`, '_blank'),
  },
  {
    type: 'separator' as const,
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    color: 'error' as const,
    onSelect: () => handleDelete(row),
  },
]

async function handleDelete(post: BlogPost) {
  const confirmed = confirm(
    'Are you sure you want to delete this post? This cannot be undone.',
  )
  if (confirmed) {
    try {
      await $fetch('/api/content/delete', {
        method: 'POST',
        body: {
          slug: post.slug,
          postId: post.id,
        },
      })

      toast.add({
        title: 'Deleted',
        description: 'Post removed.',
        color: 'success',
      })
    } catch (err: any) {
      toast.add({
        title: 'Error',
        description: 'Failed to delete.',
        color: 'error',
      })
    }
  }
}

definePageMeta({
  middleware: 'auth',
})

useHead({ title: 'Dashboard - JavaBlog' })
</script>
