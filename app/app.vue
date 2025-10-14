<template>
  <UApp>
    <UHeader toggle-side="left" mode="slideover">
      <UNavigationMenu v-if="showCrumbs" :items="items" />

      <template #title>
        dna-portal-pasir
      </template>

      <template v-if="isLogin" #right >
        <UAvatar :src="getUserAvatar"/>
        Halo
        <span class="font-bold"> {{ getFirstName }} </span>
      </template>

      <template #body>
        <UNavigationMenu  :items="items" orientation="vertical" class="-mx-2.5" />
      </template>
      
    </UHeader>
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
  </UApp>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useUserStore } from '~/stores/user';

const route = useRoute()
const userStore = useUserStore()
const { getFirstName, getUserAvatar, isLogin } = storeToRefs(userStore)

const showCrumbs = computed(() => route.name !== 'logout' && route.name !== 'login')

const items = computed<NavigationMenuItem[]>(() => {
  if (isLogin.value) {
    return [
      { label: 'Home', icon: 'i-lucide-home', to: '/' },
      { label: 'Profile', icon: 'i-lucide-user', to: '/profile' },
      { label: 'Logout', icon: 'i-lucide-log-out', to: '/logout' },
    ]
  } 
  return [
    { label: 'Home', icon: 'i-lucide-home', to: '/' },
    { label: 'Login', icon: 'i-lucide-log-in', to: '/login' },
  ]
})

</script>