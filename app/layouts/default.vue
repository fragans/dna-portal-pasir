<template>
  <div class="max-w-xl mx-auto p-4">
    <UBreadcrumb v-if="showCrumbs" :items="crumbs" />
    <slot />
  </div>
</template>
<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route =useRoute()

const showCrumbs = computed(() => route.name !== 'index' && route.name !== 'login' && route.name !== 'logout')

const crumbs = computed<BreadcrumbItem[]>(() => {
  return [
    {
      label: '',
      icon: 'i-lucide-home',
      to: '/'
    },
    {
      label: route.name as string,
    }
  ]
})
</script>
