// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Bayur Jaya - %Portal Pasir',
      meta: [
        { name: 'description', content: 'Bayur Jaya Portal Pasir' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: 'Bayur Jaya Portal Pasir' },
        { name: 'author', content: 'Bayur Jaya Portal Pasir' }
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],
  ssr: false,
  spaLoadingTemplate: 'app/spa-loading-template.html',
  pinia: {
    storesDirs: ['~/app/stores'],
  },
})
