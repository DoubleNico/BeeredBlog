/** @type {import('tailwindcss').Config} */
import tailwindTypography from '@tailwindcss/typography'

export const content = [
  './components/**/*.{js,vue,ts}',
  './layouts/**/*.vue',
  './pages/**/*.vue',
  './plugins/**/*.{js,ts}',
  './app.vue',
  './error.vue',
]
export const darkMode = 'class'
export const plugins = [tailwindTypography()]
