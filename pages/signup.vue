<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <div
      class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-tl from-primary-600 via-primary-700 to-primary-900 justify-center items-center p-12"
    >
      <div
        class="absolute inset-0 bg-gradient-to-tl from-primary-900/40 to-gray-900/60"
      />
      <div
        class="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <div
        class="absolute top-1/3 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"
      />

      <div class="relative z-10 max-w-lg text-center">
        <div
          class="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-xl backdrop-blur-sm"
        >
          <UIcon
            name="i-heroicons-rocket-launch"
            class="w-10 h-10 text-white"
          />
        </div>

        <h1 class="text-4xl font-bold text-white mb-6">Start Your Journey</h1>

        <p class="text-white/80 text-lg mb-12 leading-relaxed">
          Join a growing community of developers and writers. Share your
          knowledge, build your personal brand, and inspire others.
        </p>

        <div class="space-y-4 text-left max-w-sm mx-auto">
          <div class="flex items-center gap-3 text-white">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-6 h-6 text-white flex-shrink-0"
            />
            <span>Free Markdown blog hosting</span>
          </div>
          <div class="flex items-center gap-3 text-white">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-6 h-6 text-white flex-shrink-0"
            />
            <span>Built-in analytics dashboard</span>
          </div>
          <div class="flex items-center gap-3 text-white">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-6 h-6 text-white flex-shrink-0"
            />
            <span>Engage with real developers</span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <div
            class="lg:hidden w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4"
          >
            <UIcon
              name="i-heroicons-rocket-launch"
              class="w-6 h-6 text-primary-500"
            />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Already have an account?
            <ULink
              to="/login"
              class="text-primary-500 font-medium hover:underline"
            >
              Log in
            </ULink>
          </p>
        </div>

        <UCard class="shadow-xl">
          <div class="space-y-4">
            <p
              class="text-center text-sm text-gray-600 dark:text-gray-400 mb-6"
            >
              Choose your preferred provider to get started
            </p>
            <UButton
              block
              size="lg"
              color="neutral"
              variant="solid"
              icon="i-simple-icons-github"
              @click="handleSocialSignup('github')"
            >
              Sign up with GitHub
            </UButton>
            <UButton
              block
              size="lg"
              color="neutral"
              variant="solid"
              icon="i-simple-icons-google"
              @click="handleSocialSignup('google')"
            >
              Sign up with Google
            </UButton>
          </div>
        </UCard>

        <p class="text-center text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleSocialSignup = (provider: 'github' | 'google') => {
  return navigateTo(`/auth/${provider}?state=register`, { external: true })
}

useHead({
  title: 'Create Account - JavaBlog',
})
</script>
