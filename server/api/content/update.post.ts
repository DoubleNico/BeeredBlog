import { writeFile, rename } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  interface Tags {
    id: string
    name: string
    slug: string
    createdAt: string
  }
  try {
    const body = await readBody(event)
    const {
      oldSlug,
      title,
      slug,
      description,
      content,
      author,
      authorId,
      coverImage,
      category,
      tags,
      status,
      date,
      postId,
    } = body

    if (!oldSlug || !title || !slug || !content || !postId) {
      throw createError({
        statusCode: 400,
        message:
          'Missing required fields: oldSlug, title, slug, content, or postId',
      })
    }

    const config = useRuntimeConfig()

    console.log(postId)

    const backendResponse = await $fetch<{ success: boolean; message: string }>(
      `${config.public.backend}/api/posts/update`,
      {
        method: 'PUT',
        query: { id: postId },
        body: {
          title,
          slug,
          excerpt: description || content.substring(0, 200),
          coverImage: coverImage || null,
          category,
          status,
        },
      },
    ).catch((error) => {
      console.error('Error updating post in backend:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to update post in database: ' + error.message,
      })
    })

    if (!backendResponse.success) {
      console.log(backendResponse)

      throw createError({
        statusCode: 500,
        message: backendResponse.message || 'Failed to update post in database',
      })
    }

    const contentDir = join(process.cwd(), 'content', 'blogs')
    const oldFilePath = join(contentDir, `${oldSlug}.md`)

    console.log('Looking for file:', oldFilePath)
    console.log('File exists:', existsSync(oldFilePath))

    if (!existsSync(oldFilePath)) {
      throw createError({
        statusCode: 404,
        message: `Original post not found at: ${oldSlug}.md`,
      })
    }

    const frontmatter = {
      title,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      author,
      authorId: authorId || '',
      postId: postId,
      coverImage: coverImage || '',
      category: category || 'Technology',
      tags: tags || [],
      status: status || 'draft',
    }

    const markdownContent = `---
title: ${frontmatter.title}
description: ${frontmatter.description}
date: ${frontmatter.date}
author: ${frontmatter.author}
postId: ${frontmatter.postId}
authorId: ${frontmatter.authorId}
coverImage: ${frontmatter.coverImage}
category: ${frontmatter.category}
tags: [${frontmatter.tags.join(', ')}]
status: ${frontmatter.status}
---

${content}
`

    const newFilePath = join(contentDir, `${slug}.md`)

    if (oldSlug !== slug && existsSync(newFilePath)) {
      throw createError({
        statusCode: 409,
        message: 'A post with this slug already exists',
      })
    }

    await writeFile(oldFilePath, markdownContent, 'utf-8')

    if (oldSlug !== slug) {
      await rename(oldFilePath, newFilePath)
    }

    if (tags && Array.isArray(tags) && postId) {
      try {
        const currentTagsResponse = await $fetch<{
          success: boolean
          tags?: Array<{ id: string; name: string }>
        }>(`${config.public.backend}/api/tags/getByPost`, {
          method: 'GET',
          params: { postId },
        }).catch(() => ({ success: false, tags: [] }))

        const currentTags = currentTagsResponse.tags || []
        const currentTagNames = currentTags.map((t) => t.name)
        const newTagNames = tags.filter((t) => t && t.trim())

        for (const tag of currentTags) {
          if (!newTagNames.includes(tag.name)) {
            await $fetch(`${config.public.backend}/api/tags/removeFromPost`, {
              method: 'POST',
              query: { tagId: tag.id, postId },
            }).catch((error) => {
              console.error('Error removing tag:', error)
            })
          }
        }

        for (const tagName of newTagNames) {
          if (!currentTagNames.includes(tagName)) {
            let tagResponse = await $fetch<{ success: boolean; tag?: Tags }>(
              `${config.public.backend}/api/tags/getByName`,
              {
                method: 'GET',
                params: { name: tagName },
              },
            )
              .then((res) => res)
              .catch(() => ({ success: false, tag: undefined }))

            if (!tagResponse.success || !tagResponse.tag) {
              tagResponse = await $fetch<{ success: boolean; tag?: Tags }>(
                `${config.public.backend}/api/tags/create`,
                {
                  method: 'POST',
                  body: { name: tagName },
                },
              )
                .then((res) => res)
                .catch(() => ({ success: false, tag: undefined }))
            }

            if (tagResponse.success && tagResponse.tag) {
              await $fetch(`${config.public.backend}/api/tags/addToPost`, {
                method: 'POST',
                query: { tagId: tagResponse.tag.id, postId },
              }).catch((error) => {
                console.error('Error adding tag to post:', error)
              })
            }
          }
        }
      } catch (error) {
        console.error('Error handling tags:', error)
      }
    }

    return {
      success: true,
      message: 'Post updated successfully in both Markdown and database',
      slug,
      path: `/blogs/${slug}`,
    }
  } catch (error: any) {
    console.error('Error updating content:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update post',
    })
  }
})
