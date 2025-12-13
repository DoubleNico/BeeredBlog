<template>
  <div>
    <h1>Color mode: {{ $colorMode.value }}</h1>
    <button @click="changeMode">{{ $colorMode.value }}</button>
    <a
      v-for="lang in availableLocales"
      :key="lang.code"
      href="#"
      @click.prevent.stop="setLocale(lang.code)"
      >{{ lang.name }}</a
    >
    <p>{{ $t('hello') }}</p>
    <h1 class="text-primary">This is a nice font</h1>
    <Icon name="mdi-home" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Nuxt with Tailwind CSS Starter pack',
  meta: [
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no',
    },
    {
      name: 'description',
      content: 'I love this so much wow.',
    },
  ],
  link: [
    // {
    //   rel: 'icon',
    //   type: 'image/x-icon',
    //   href: '',
    // },
  ],
})

const { locale, locales, setLocale } = useI18n()
const availableLocales = computed(() => {
  return locales.value.filter((i: { code: string }) => i.code !== locale.value)
})

const colorMode = useColorMode()

const changeMode = () => {
  if (colorMode.value === 'light') colorMode.preference = 'dark'
  else if (colorMode.value === 'dark') colorMode.preference = 'contrast'
  else colorMode.preference = 'light'
}
</script>

<style scoped>
h1 {
  font-family: MonteCarlo;
}
</style>
