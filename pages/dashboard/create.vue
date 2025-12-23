<template>
  <div
    class="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900"
  >
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
            placeholder="Enter Post Title..."
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
            variant="ghost"
            color="neutral"
            :loading="savingDraft"
            @click="handleAction('draft')"
          >
            Save Draft
          </UButton>

          <UButton
            color="primary"
            icon="i-heroicons-paper-airplane"
            :loading="publishing"
            @click="handleAction('published')"
          >
            Publish
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
      <div
        class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 relative"
      >
        <UEditor
          ref="editorRef"
          v-slot="{ editor, handlers }"
          v-model="value"
          content-type="markdown"
          :extensions="[
            Emoji,
            TableKit,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
          ]"
          placeholder="Type '/' for commands, ':' for emoji..."
          :handlers="customHandlers"
          class="w-full h-full flex flex-col"
          :ui="{ base: 'px-8 py-4' }"
        >
          <UEditorToolbar
            :editor="editor"
            :items="toolbarItems"
            class="border-b border-gray-200 dark:border-gray-800 px-4 py-2 sticky top-0 bg-white dark:bg-gray-900 z-10 overflow-x-auto"
          >
            <template #link>
              <EditorLinkPopover :editor="editor" auto-open />
            </template>
          </UEditorToolbar>

          <UEditorToolbar
            :editor="editor"
            :items="bubbleToolbarItems"
            layout="bubble"
            :should-show="
              ({ view, state }) => {
                const { selection } = state
                return view.hasFocus() && !selection.empty
              }
            "
          >
            <template #link>
              <EditorLinkPopover :editor="editor" />
            </template>
          </UEditorToolbar>

          <UEditorDragHandle
            v-slot="{ ui, onClick }"
            :editor="editor"
            @node-change="selectedNode = $event"
          >
            <UButton
              icon="i-lucide-plus"
              color="neutral"
              variant="ghost"
              size="sm"
              :class="ui.handle()"
              @click="
                (e) => {
                  e.stopPropagation()

                  const selected = onClick()
                  handlers.suggestion
                    ?.execute(editor, { pos: selected?.pos })
                    .run()
                }
              "
            />

            <UDropdownMenu
              v-slot="{ open }"
              :modal="false"
              :items="handleItems(editor)"
              :content="{ side: 'left' }"
              :ui="{ content: 'w-48', label: 'text-xs' }"
              @update:open="
                editor.chain().setMeta('lockDragHandle', $event).run()
              "
            >
              <UButton
                color="neutral"
                variant="ghost"
                active-variant="soft"
                size="sm"
                icon="i-lucide-grip-vertical"
                :active="open"
                :class="ui.handle()"
              />
            </UDropdownMenu>
          </UEditorDragHandle>

          <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
          <UEditorEmojiMenu
            :editor="editor"
            :items="emojiItems"
            :append-to="appendToBody"
          />
        </UEditor>

        <div
          class="absolute bottom-4 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-xs text-gray-500 pointer-events-none z-10"
        >
          {{ wordCount }} words
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
              <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2">
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
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import type {
  EditorToolbarItem,
  EditorSuggestionMenuItem,
  EditorEmojiMenuItem,
  DropdownMenuItem,
  EditorCustomHandlers,
} from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { TableKit } from '@tiptap/extension-table'
import { TextAlign } from '@tiptap/extension-text-align'
import { upperFirst } from 'scule'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import {
  getAllTags,
  createTag as createTagAPI,
} from '~/scripts/backend/tags/tagsOperations'
import type { Tags } from '~/scripts/types/tags/Tags'

definePageMeta({
  middleware: 'auth',
  layout: false,
})

useHead({ title: 'Create New Post - JavaBlog' })

const { user } = useUserSession()
const toast = useToast()
const currentUserStore = useCurrentUserStore()
const config = useRuntimeConfig()
const lowlight = createLowlight(common)
CodeBlockLowlight.configure({
  lowlight,
})

const editorRef = ref()

const showSidebar = ref(true)
const isDirty = ref(false)
const savingDraft = ref(false)
const publishing = ref(false)

const availableTags = ref<Tags[]>([])
const selectedTags = ref<string[]>([])
const newTagInput = ref('')
const isCreatingTag = ref(false)
const value = ref('# Hello')
const selectedNode = ref<{ node: JSONContent; pos: number }>()
const appendToBody = false ? () => document.body : undefined

const customHandlers = {
  insertTable: {
    canExecute: (editor: Editor) => true,
    execute: (editor: Editor) =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
    isActive: (editor: Editor) => false,
    isDisabled: (editor: Editor) => false,
  } satisfies EditorCustomHandlers,
}

const form = reactive({
  title: '',
  slug: '',
  coverImage: '',
  category: 'Technology',
  description: '',
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

const errors = reactive({
  title: '',
  slug: '',
  content: '',
})

const wordCount = computed(() => {
  if (!value.value) return 0
  return value.value.trim().split(/\s+/).length
})

const toolbarItems: EditorToolbarItem[][] = [
  [
    {
      kind: 'undo',
      icon: 'i-lucide-undo',
      tooltip: { text: 'Undo' },
    },
    {
      kind: 'redo',
      icon: 'i-lucide-redo',
      tooltip: { text: 'Redo' },
    },
  ],
  [
    {
      icon: 'i-lucide-heading',
      tooltip: { text: 'Headings' },
      content: { align: 'start' },
      items: [
        {
          kind: 'heading',
          level: 1,
          icon: 'i-lucide-heading-1',
          label: 'Heading 1',
        },
        {
          kind: 'heading',
          level: 2,
          icon: 'i-lucide-heading-2',
          label: 'Heading 2',
        },
        {
          kind: 'heading',
          level: 3,
          icon: 'i-lucide-heading-3',
          label: 'Heading 3',
        },
      ],
    },
    {
      icon: 'i-lucide-list',
      tooltip: { text: 'Lists' },
      content: { align: 'start' },
      items: [
        {
          kind: 'bulletList',
          icon: 'i-lucide-list',
          label: 'Bullet List',
        },
        {
          kind: 'orderedList',
          icon: 'i-lucide-list-ordered',
          label: 'Ordered List',
        },
      ],
    },
    {
      kind: 'blockquote',
      icon: 'i-lucide-text-quote',
      tooltip: { text: 'Blockquote' },
    },
    {
      icon: 'i-lucide-square-code',
      tooltip: { text: 'Code Block' },
      content: { align: 'start' },
      items: [
        {
          kind: 'codeBlock',
          language: 'javascript',
          icon: 'i-lucide-square-code',
          label: 'JavaScript',
        },
        {
          kind: 'codeBlock',
          language: 'typescript',
          icon: 'i-lucide-square-code',
          label: 'TypeScript',
        },
        {
          kind: 'codeBlock',
          language: 'python',
          icon: 'i-lucide-square-code',
          label: 'Python',
        },
        {
          kind: 'codeBlock',
          language: 'java',
          icon: 'i-lucide-square-code',
          label: 'Java',
        },
        {
          kind: 'codeBlock',
          language: 'html',
          icon: 'i-lucide-square-code',
          label: 'HTML',
        },
        {
          kind: 'codeBlock',
          language: 'css',
          icon: 'i-lucide-square-code',
          label: 'CSS',
        },
        {
          kind: 'codeBlock',
          language: 'bash',
          icon: 'i-lucide-square-code',
          label: 'Bash',
        },
        {
          kind: 'codeBlock',
          icon: 'i-lucide-square-code',
          label: 'Plain Text',
        },
      ],
    },
    {
      kind: 'insertTable',
      icon: 'i-lucide-table',
      tooltip: { text: 'Table' },
    },
  ],
  [
    {
      slot: 'link' as const,
      icon: 'i-lucide-link',
    },
  ],
  [
    {
      icon: 'i-lucide-align-justify',
      tooltip: { text: 'Text Align' },
      content: { align: 'end' },
      items: [
        {
          kind: 'textAlign',
          align: 'left',
          icon: 'i-lucide-align-left',
          label: 'Align Left',
        },
        {
          kind: 'textAlign',
          align: 'center',
          icon: 'i-lucide-align-center',
          label: 'Align Center',
        },
        {
          kind: 'textAlign',
          align: 'right',
          icon: 'i-lucide-align-right',
          label: 'Align Right',
        },
        {
          kind: 'textAlign',
          align: 'justify',
          icon: 'i-lucide-align-justify',
          label: 'Align Justify',
        },
      ],
    },
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: 'i-lucide-bold',
      tooltip: { text: 'Bold' },
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide-italic',
      tooltip: { text: 'Italic' },
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: 'i-lucide-strikethrough',
      tooltip: { text: 'Strikethrough' },
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: 'i-lucide-code',
      tooltip: { text: 'Code' },
    },
  ],
  [
    {
      kind: 'horizontalRule',
      icon: 'i-lucide-separator-horizontal',
      tooltip: { text: 'Horizontal Rule' },
    },
  ],
]

const bubbleToolbarItems: EditorToolbarItem[][] = [
  [
    {
      slot: 'link' as const,
      icon: 'i-lucide-link',
    },
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: 'i-lucide-bold',
      tooltip: { text: 'Bold' },
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide-italic',
      tooltip: { text: 'Italic' },
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: 'i-lucide-strikethrough',
      tooltip: { text: 'Strikethrough' },
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: 'i-lucide-code',
      tooltip: { text: 'Code' },
    },
  ],
  [
    {
      icon: 'i-lucide-align-justify',
      tooltip: { text: 'Text Align' },
      content: { align: 'end' },
      items: [
        {
          kind: 'textAlign',
          align: 'left',
          icon: 'i-lucide-align-left',
          label: 'Align Left',
        },
        {
          kind: 'textAlign',
          align: 'center',
          icon: 'i-lucide-align-center',
          label: 'Align Center',
        },
        {
          kind: 'textAlign',
          align: 'right',
          icon: 'i-lucide-align-right',
          label: 'Align Right',
        },
        {
          kind: 'textAlign',
          align: 'justify',
          icon: 'i-lucide-align-justify',
          label: 'Align Justify',
        },
      ],
    },
  ],
]

const suggestionItems: EditorSuggestionMenuItem[][] = [
  [
    {
      type: 'label',
      label: 'Style',
    },
    {
      kind: 'paragraph',
      label: 'Paragraph',
      icon: 'i-lucide-type',
    },
    {
      kind: 'heading',
      level: 1,
      label: 'Heading 1',
      icon: 'i-lucide-heading-1',
    },
    {
      kind: 'heading',
      level: 2,
      label: 'Heading 2',
      icon: 'i-lucide-heading-2',
    },
    {
      kind: 'heading',
      level: 3,
      label: 'Heading 3',
      icon: 'i-lucide-heading-3',
    },
    {
      kind: 'bulletList',
      label: 'Bullet List',
      icon: 'i-lucide-list',
    },
    {
      kind: 'orderedList',
      label: 'Ordered List',
      icon: 'i-lucide-list-ordered',
    },
    {
      kind: 'blockquote',
      label: 'Blockquote',
      icon: 'i-lucide-text-quote',
    },
    {
      kind: 'codeBlock',
      label: 'Code Block',
      icon: 'i-lucide-square-code',
    },
  ],
  [
    {
      type: 'label',
      label: 'Insert',
    },
    {
      kind: 'emoji',
      label: 'Emoji',
      icon: 'i-lucide-smile-plus',
    },
    {
      kind: 'insertTable',
      label: 'Table',
      icon: 'i-lucide-table',
    },
    {
      kind: 'horizontalRule',
      label: 'Horizontal Rule',
      icon: 'i-lucide-separator-horizontal',
    },
  ],
]

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(
  (emoji) => !emoji.name.startsWith('regional_indicator_'),
)

const handleItems = (editor: Editor): DropdownMenuItem[][] => {
  if (!selectedNode.value?.node?.type) {
    return []
  }

  return mapEditorItems(
    editor,
    [
      [
        {
          type: 'label',
          label: upperFirst(selectedNode.value.node.type),
        },
        {
          label: 'Turn into',
          icon: 'i-lucide-repeat-2',
          children: [
            { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
            {
              kind: 'heading',
              level: 1,
              label: 'Heading 1',
              icon: 'i-lucide-heading-1',
            },
            {
              kind: 'heading',
              level: 2,
              label: 'Heading 2',
              icon: 'i-lucide-heading-2',
            },
            {
              kind: 'heading',
              level: 3,
              label: 'Heading 3',
              icon: 'i-lucide-heading-3',
            },
            {
              kind: 'bulletList',
              label: 'Bullet List',
              icon: 'i-lucide-list',
            },
            {
              kind: 'orderedList',
              label: 'Ordered List',
              icon: 'i-lucide-list-ordered',
            },
            {
              kind: 'blockquote',
              label: 'Blockquote',
              icon: 'i-lucide-text-quote',
            },
            {
              kind: 'codeBlock',
              label: 'Code Block',
              icon: 'i-lucide-square-code',
            },
          ],
        },
        {
          kind: 'clearFormatting',
          pos: selectedNode.value?.pos,
          label: 'Reset formatting',
          icon: 'i-lucide-rotate-ccw',
        },
      ],
      [
        {
          kind: 'duplicate',
          pos: selectedNode.value?.pos,
          label: 'Duplicate',
          icon: 'i-lucide-copy',
        },
        {
          label: 'Copy to clipboard',
          icon: 'i-lucide-clipboard',
          onSelect: async () => {
            if (!selectedNode.value) return

            const pos = selectedNode.value.pos
            const node = editor.state.doc.nodeAt(pos)
            if (node) {
              await navigator.clipboard.writeText(node.textContent)
            }
          },
        },
      ],
      [
        {
          kind: 'moveUp',
          pos: selectedNode.value?.pos,
          label: 'Move up',
          icon: 'i-lucide-arrow-up',
        },
        {
          kind: 'moveDown',
          pos: selectedNode.value?.pos,
          label: 'Move down',
          icon: 'i-lucide-arrow-down',
        },
      ],
      [
        {
          kind: 'delete',
          pos: selectedNode.value?.pos,
          label: 'Delete',
          icon: 'i-lucide-trash',
        },
      ],
    ],
    {},
  ) as DropdownMenuItem[][]
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

const onCreateCategory = (newCategory: string) => {
  if (
    !availableCategories.includes(newCategory) &&
    newCategory.trim().length > 0
  ) {
    availableCategories.push(newCategory)
  }
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
  if (!value.value.trim()) {
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

  await currentUserStore.fetchCurrentUser(
    config,
    user.value?.userId || '',
    true,
  )
  const currentUser = currentUserStore.currentUser

  if (!currentUser) {
    toast.add({
      title: 'Session Error',
      description: 'Please log in again',
      color: 'error',
    })
    return
  }

  if (status === 'draft') {
    savingDraft.value = true
  } else {
    publishing.value = true
  }

  try {
    const description =
      form.description || value.value.substring(0, 150).trim() + '...'

    const response = await $fetch<{ success: boolean; path: string }>(
      '/api/content/create',
      {
        method: 'POST',
        body: {
          ...form,
          content: value.value,
          description,
          tags: selectedTags.value,
          status,
          author:
            currentUser.username ||
            currentUser.firstName + ' ' + currentUser.lastName ||
            'Anonymous',
          authorId: currentUser.id,
          category: form.category,
        },
      },
    )

    if (response.success) {
      isDirty.value = false
      toast.add({
        title: status === 'draft' ? 'Draft Saved' : 'Published!',
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
      if (status === 'published') {
        await navigateTo(response.path)
      } else {
        await navigateTo('/dashboard')
      }
    } else {
      throw new Error('Failed to create post')
    }
  } catch (error: any) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  } finally {
    savingDraft.value = false
    publishing.value = false
  }
}

watch(
  () => value.value,
  () => {
    isDirty.value = true
  },
)

onMounted(async () => {
  if (user.value?.userId) {
    await currentUserStore.fetchCurrentUser(config, user.value.userId, true)
  }

  await fetchAvailableTags()
})
</script>
