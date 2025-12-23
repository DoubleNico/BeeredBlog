// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@vueuse/motion/nuxt',
    '@pinia/nuxt',
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: [
      {
        name: 'Română',
        code: 'ro',
        language: 'ro-RO',
        file: 'ro-RO.json',
      },
      {
        name: 'English',
        code: 'en',
        language: 'en-US',
        file: 'en-US.json',
      },
    ],
    langDir: './locales',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  runtimeConfig: {
    public: {
      backend: process.env.BACKEND,
    },
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: [
            'json',
            'js',
            'ts',
            'html',
            'css',
            'vue',
            'shell',
            'mdc',
            'md',
            'yaml',
            'bash',
            'typescript',
            'javascript',
          ],
        },
      },
    },
    renderer: {
      anchorLinks: {
        h2: true,
        h3: true,
        h4: true,
      },
    },
  },
  css: ['~/assets/css/tailwind.css'],
})
