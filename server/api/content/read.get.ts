import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { slug } = query

    if (!slug || typeof slug !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'Slug is required',
      })
    }

    const contentDir = join(process.cwd(), 'content', 'blogs')
    const filePath = join(contentDir, `${slug}.md`)

    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        message: 'Post not found',
      })
    }

    const fileContent = await readFile(filePath, 'utf-8')

    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/
    const match = fileContent.match(frontmatterRegex)

    if (!match) {
      throw createError({
        statusCode: 500,
        message: 'Invalid markdown file format',
      })
    }

    const content = match[2] || ''

    return {
      success: true,
      content,
    }
  } catch (error: any) {
    console.error('Error reading content:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to read content',
    })
  }
})
