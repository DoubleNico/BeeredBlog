import { writeFile, mkdir } from 'fs/promises'
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
    } = body

    if (!title || !slug || !content || !author || !authorId) {
      throw createError({
        statusCode: 400,
        message:
          'Missing required fields: title, slug, content, author, or authorId',
      })
    }

    const config = useRuntimeConfig()

    const backendResponse = await $fetch<{
      success: boolean
      message: string
      postId?: string
    }>(`${config.public.backend}/api/posts/create`, {
      method: 'POST',
      query: { authorId },
      body: {
        title,
        slug,
        excerpt: description || content.substring(0, 200),
        coverImage: coverImage || null,
        category,
        status,
      },
    }).catch((error) => {
      console.error('Error creating post in backend:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to create post in database: ' + error.message,
      })
    })

    if (!backendResponse.success) {
      throw createError({
        statusCode: 500,
        message: backendResponse.message || 'Failed to create post in database',
      })
    }

    const frontmatter = {
      title,
      description: description || '',
      date: new Date().toISOString(),
      author,
      authorId: authorId || '',
      postId: backendResponse.postId || '',
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

    const contentDir = join(process.cwd(), 'content', 'blogs')
    const filePath = join(contentDir, `${slug}.md`)

    if (existsSync(filePath)) {
      throw createError({
        statusCode: 409,
        message: 'A post with this slug already exists',
      })
    }

    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true })
    }

    await writeFile(filePath, markdownContent, 'utf-8')

    if (
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      backendResponse.postId
    ) {
      for (const tagName of tags) {
        if (tagName && tagName.trim()) {
          try {
            let tagResponse = await $fetch<{ success: boolean; tag?: Tags }>(
              `${config.public.backend}/api/tags/getByName`,
              {
                method: 'GET',
                params: { name: tagName.trim() },
              },
            )
              .then((res) => res)
              .catch(() => ({ success: false, tag: undefined }))

            if (!tagResponse.success || !tagResponse.tag) {
              tagResponse = await $fetch<{ success: boolean; tag?: Tags }>(
                `${config.public.backend}/api/tags/create`,
                {
                  method: 'POST',
                  body: { name: tagName.trim() },
                },
              )
                .then((res) => res)
                .catch(() => ({ success: false, tag: undefined }))
            }

            if (tagResponse.success) {
              await $fetch(`${config.public.backend}/api/tags/addToPost`, {
                method: 'POST',
                query: {
                  tagId: tagResponse.tag!.id,
                  postId: backendResponse.postId,
                },
              }).catch((error) => {
                console.error('Error adding tag to post:', error)
              })
            }
          } catch (error) {
            console.error(`Error handling tag ${tagName}:`, error)
          }
        }
      }
    }

    return {
      success: true,
      message: 'Post created successfully in both Markdown and database',
      slug,
      path: `/blogs/${slug}`,
      postId: backendResponse.postId,
    }
  } catch (error: any) {
    console.error('Error creating content:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create post',
    })
  }
})
