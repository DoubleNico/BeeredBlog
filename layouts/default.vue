<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <AppNavbar />

    <main class="grow flex flex-col">
      <slot />
    </main>

    <footer
      class="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto bg-gray-50 dark:bg-gray-950"
    >
      <UContainer
        class="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div class="text-center md:text-left">
          <p class="font-bold text-gray-900 dark:text-white">JavaBlog</p>
          <p class="text-sm text-gray-500 mt-1">
            &copy; {{ new Date().getFullYear() }} All rights reserved.
          </p>
        </div>
        <div class="flex gap-4">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-simple-icons-github"
            to="https://github.com"
            target="_blank"
          />
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-simple-icons-twitter"
          />
        </div>
      </UContainer>
    </footer>
  </div>
</template>
