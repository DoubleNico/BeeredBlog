import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blogs: defineCollection({
      type: 'page',
      source: 'blogs/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        author: z.string(),
        postId: z.string(),
        authorId: z.string(),
        coverImage: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.enum(['draft', 'published']).default('draft'),
      }),
    }),
  },
})
