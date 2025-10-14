<template>
  <div class="max-w-xl mx-auto p-4">
    <UBreadcrumb v-if="route.name !== 'index'" :items="crumbs" />
    <slot />
  </div>
</template>
<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route =useRoute()
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
