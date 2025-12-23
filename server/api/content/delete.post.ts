import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { slug, postId } = body

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'Missing required field: slug',
      })
    }

    const config = useRuntimeConfig()

    if (postId) {
      await $fetch(`${config.public.backend}/api/posts/delete`, {
        method: 'POST',
        query: { id: postId },
      }).catch((error) => {
        console.error('Error deleting post from backend:', error)
      })
    }

    const contentDir = join(process.cwd(), 'content', 'blogs')
    const filePath = join(contentDir, `${slug}.md`)

    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        message: 'Post markdown file not found',
      })
    }
    await unlink(filePath)

    return {
      success: true,
      message: 'Post deleted successfully from both Markdown and database',
    }
  } catch (error: any) {
    console.error('Error deleting content:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete post',
    })
  }
})
