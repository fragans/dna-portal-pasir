import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
let commitHash = ''
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {
  console.warn('Could not get git commit hash')
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Portal Pasir',
      titleTemplate: '%s • Bayur Jaya',
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
  spaLoadingTemplate: 'spa-loading-template.html',
  pinia: {
    storesDirs: ['~/app/stores'],
  },
  runtimeConfig: {
    public: {
      VITE_API_HOST: process.env.VITE_API_HOST,
      appVersion: packageJson.version,
      commitHash: commitHash
    }
  }
})
