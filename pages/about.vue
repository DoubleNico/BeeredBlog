<template>
  <div class="min-h-screen flex flex-col">
    <main class="grow">
      <section
        class="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800"
      >
        <UContainer class="text-center">
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          >
            <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About JavaBlog
            </h1>
            <p
              class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              A modern platform for developers and writers to share their
              knowledge, experiences, and stories with the world.
            </p>
          </div>
        </UContainer>
      </section>

      <section class="py-16">
        <UContainer class="max-w-4xl">
          <div
            v-motion
            class="prose prose-lg dark:prose-invert max-w-none"
            :initial="{ opacity: 0, y: 20 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 500, delay: 200 },
            }"
          >
            <h2>Our Mission</h2>
            <p>
              JavaBlog was created with a simple mission: to provide a clean,
              distraction-free platform where developers and technical writers
              can share their knowledge and connect with like-minded
              individuals. We believe that great content should be easy to
              create, beautiful to read, and accessible to everyone.
            </p>

            <h2>Why JavaBlog?</h2>
            <p>
              In a world full of noise and clutter, we wanted to create
              something different. JavaBlog focuses on what matters most: your
              content and your readers. With support for Markdown, syntax
              highlighting, and a beautiful reading experience, we make it easy
              for you to focus on writing while we handle the rest.
            </p>

            <h2>Key Features</h2>
            <ul>
              <li>
                <strong>Markdown Editor</strong> - Write your posts in Markdown
                with live preview
              </li>
              <li>
                <strong>Beautiful Design</strong> - A clean, modern interface
                that puts your content first
              </li>
              <li>
                <strong>Engagement</strong> - Build your audience with comments,
                likes, and followers
              </li>
              <li>
                <strong>Analytics</strong> - Track your post performance with
                built-in analytics
              </li>
              <li>
                <strong>SEO Optimized</strong> - Your posts are optimized for
                search engines
              </li>
              <li>
                <strong>Fast & Secure</strong> - Built with modern technologies
                for speed and security
              </li>
            </ul>

            <h2>Technology Stack</h2>
            <p>
              JavaBlog is built with cutting-edge technologies to ensure the
              best experience for both writers and readers:
            </p>
            <ul>
              <li>
                <strong>Nuxt 3</strong> - For a powerful, performant frontend
              </li>
              <li><strong>Vue 3</strong> - Modern reactive UI framework</li>
              <li>
                <strong>Tailwind CSS</strong> - For beautiful, customizable
                styling
              </li>
              <li><strong>Javalin</strong> - Lightweight backend framework</li>
              <li>
                <strong>Auth Utils</strong> - Secure authentication and
                authorization
              </li>
            </ul>
          </div>
        </UContainer>
      </section>

      <section class="py-16 bg-gray-50 dark:bg-gray-800">
        <UContainer>
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              By The Numbers
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Growing community of passionate writers and readers
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <UCard
              v-for="stat in stats"
              :key="stat.label"
              v-motion
              class="text-center"
              :initial="{ opacity: 0, scale: 0.9 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 400 } }"
            >
              <div class="space-y-2">
                <p
                  class="text-4xl font-bold text-primary-600 dark:text-primary-400"
                >
                  {{ stat.value }}
                </p>
                <p class="text-gray-600 dark:text-gray-400 font-medium">
                  {{ stat.label }}
                </p>
              </div>
            </UCard>
          </div>
        </UContainer>
      </section>

      <section class="py-16">
        <UContainer>
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet The Team
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              The people behind JavaBlog
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <UCard
              v-for="member in team"
              :key="member.name"
              v-motion
              class="text-center"
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
            >
              <div class="space-y-4">
                <UAvatar
                  :src="member.avatar"
                  :alt="member.name"
                  size="xl"
                  class="mx-auto"
                />
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    {{ member.name }}
                  </h3>
                  <p class="text-sm text-primary-600 dark:text-primary-400">
                    {{ member.role }}
                  </p>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ member.bio }}
                </p>
                <div class="flex justify-center gap-3">
                  <a
                    v-for="social in member.socials"
                    :key="social.platform"
                    :href="social.url"
                    target="_blank"
                    class="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition"
                  >
                    <UIcon :name="social.icon" class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </UCard>
          </div>
        </UContainer>
      </section>

      <section class="py-16 bg-primary-600 dark:bg-primary-800">
        <UContainer class="text-center">
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          >
            <h2 class="text-3xl font-bold text-white mb-4">
              Ready to Share Your Story?
            </h2>
            <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who are already sharing their knowledge
              and building their audience on JavaBlog.
            </p>
            <div class="flex justify-center gap-4">
              <UButton size="xl" color="neutral" to="/signup">
                Get Started for Free
              </UButton>
              <UButton size="xl" variant="outline" color="neutral" to="/blogs">
                Explore Posts
              </UButton>
            </div>
          </div>
        </UContainer>
      </section>

      <section class="py-16">
        <UContainer class="max-w-3xl">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <UAccordion
            v-motion
            :items="faqs"
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          >
            <template #default="{ item, open }">
              <UButton
                color="neutral"
                variant="ghost"
                class="border-b border-gray-200 dark:border-gray-700"
              >
                <span class="text-left font-semibold">{{ item.label }}</span>

                <template #trailing>
                  <UIcon
                    name="i-heroicons-chevron-right-20-solid"
                    class="w-5 h-5 ms-auto transform transition-transform duration-200"
                    :class="[open && 'rotate-90']"
                  />
                </template>
              </UButton>

              <div v-if="open" class="p-4 text-gray-600 dark:text-gray-400">
                {{ item.content }}
              </div>
            </template>
          </UAccordion>
        </UContainer>
      </section>

      <section class="py-16 bg-gray-50 dark:bg-gray-800">
        <UContainer class="max-w-2xl text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <UButton
              size="lg"
              variant="outline"
              icon="i-heroicons-envelope"
              to="mailto:hello@javablog.com"
            >
              hello@javablog.com
            </UButton>
            <UButton
              size="lg"
              variant="outline"
              icon="i-simple-icons-github"
              to="https://github.com/javablog"
              target="_blank"
            >
              GitHub
            </UButton>
            <UButton
              size="lg"
              variant="outline"
              icon="i-simple-icons-x"
              to="https://twitter.com/javablog"
              target="_blank"
            >
              Twitter
            </UButton>
          </div>
        </UContainer>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { label: 'Active Writers', value: '10,000+' },
  { label: 'Published Posts', value: '50,000+' },
  { label: 'Monthly Readers', value: '500K+' },
  { label: 'Countries', value: '150+' },
]

const team = [
  {
    name: 'Alex Martinez',
    role: 'Founder & CEO',
    bio: 'Full-stack developer with a passion for creating tools that empower writers.',
    avatar: 'https://i.pravatar.cc/150?img=11',
    socials: [
      {
        platform: 'GitHub',
        url: 'https://github.com/alex',
        icon: 'i-simple-icons-github',
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/alex',
        icon: 'i-simple-icons-x',
      },
    ],
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Design',
    bio: 'UI/UX designer focused on creating beautiful and intuitive user experiences.',
    avatar: 'https://i.pravatar.cc/150?img=16',
    socials: [
      {
        platform: 'Dribbble',
        url: 'https://dribbble.com/priya',
        icon: 'i-simple-icons-dribbble',
      },
      {
        platform: 'Twitter',
        url: 'https://twitter.com/priya',
        icon: 'i-simple-icons-x',
      },
    ],
  },
  {
    name: 'James Chen',
    role: 'Lead Developer',
    bio: 'Backend specialist ensuring JavaBlog runs smoothly and securely.',
    avatar: 'https://i.pravatar.cc/150?img=14',
    socials: [
      {
        platform: 'GitHub',
        url: 'https://github.com/james',
        icon: 'i-simple-icons-github',
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/james',
        icon: 'i-simple-icons-linkedin',
      },
    ],
  },
]

const faqs = [
  {
    label: 'Is JavaBlog free to use?',
    content:
      'Yes! JavaBlog is completely free to use. You can create an account, write unlimited posts, and build your audience without paying anything. We may introduce premium features in the future, but the core platform will always remain free.',
  },
  {
    label: 'Do I need to know Markdown?',
    content:
      "While Markdown is our primary format, it's very easy to learn! We provide a live preview as you write, and there are plenty of resources available to help you get started. Most writers pick it up within minutes.",
  },
  {
    label: 'Can I import my existing blog posts?',
    content:
      "Yes! We support importing posts from various platforms. You can bulk import your content in Markdown format, and we'll help you get everything set up properly.",
  },
  {
    label: 'How do you handle content ownership?',
    content:
      "You retain full ownership of all content you create on JavaBlog. You're free to republish your posts elsewhere, export your content, or delete it at any time.",
  },
  {
    label: 'Is there a mobile app?',
    content:
      "While we don't currently have a native mobile app, JavaBlog is fully responsive and works great on all mobile devices. You can write and read posts seamlessly on your phone or tablet.",
  },
  {
    label: 'How can I grow my audience?',
    content:
      'We provide several tools to help you grow: SEO optimization, social sharing, tags and categories, and featured posts for popular content. Consistently publishing quality content is the best way to build your audience!',
  },
]
</script>

<style scoped>
@reference 'tailwindcss';
.prose :deep(h2) {
  @apply text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4;
}

.prose :deep(p) {
  @apply text-gray-700 dark:text-gray-300 mb-4 leading-relaxed;
}

.prose :deep(ul) {
  @apply list-disc list-inside mb-4 space-y-2;
}

.prose :deep(li) {
  @apply text-gray-700 dark:text-gray-300;
}

.prose :deep(strong) {
  @apply font-semibold text-gray-900 dark:text-white;
}
</style>
