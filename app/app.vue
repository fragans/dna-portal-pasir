<template>
  <UApp>
    <UHeader toggle-side="left" mode="slideover">
      <UNavigationMenu v-if="showCrumbs" :items="items" />

      
      <template #title>
        Bayur Jaya
      </template>

      <template #right >
        <UseColorMode v-slot="color">
          <UButton
            variant="link"
            @click="color.mode = color.mode === 'dark' ? 'light' : 'dark'"
          >
            <UIcon v-if="color.mode === 'light'" name="i-lucide-sun" class="text-2xl text-gray-500" />
            <UIcon v-else name="i-lucide-moon" class="text-2xl" />
          </UButton>
        </UseColorMode>
        <div v-if="isLogin">
          <UAvatar :src="getUserAvatar"/>
        </div>
        
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
import { UseColorMode } from '@vueuse/components'
import type { NavigationMenuItem } from '@nuxt/ui'
import { useUserStore } from '~/stores/user';

const route = useRoute()
const userStore = useUserStore()
const { getUserAvatar, isLogin } = storeToRefs(userStore)

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