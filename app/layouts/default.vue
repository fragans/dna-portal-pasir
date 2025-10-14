<template>
  <div>
    <UHeader toggle-side="left">
      <template #title>
        dna-portal-pasir
      </template>

      <UNavigationMenu :items="items" />

      <template #right>

        helo user
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" popover />
      </template>
    </UHeader>
    <!-- <UNavigationMenu :items="items" collapsed orientation="vertical" /> -->
    <slot />
  </div>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Docs',
  to: '/docs/getting-started',
  icon: 'i-lucide-book-open',
  active: route.path.startsWith('/docs/getting-started')
}, {
  label: 'Components',
  to: '/docs/components',
  icon: 'i-lucide-box',
  active: route.path.startsWith('/docs/components')
}, {
  label: 'Figma',
  icon: 'i-simple-icons-figma',
  to: 'https://go.nuxt.com/figma-ui',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}])
</script>