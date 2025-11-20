<template>
  <UMain>
    <section class="flex flex-col items-center justify-center min-h-screen gap-4">
      
      
      <UCard v-if="getDisplayRole === ''" class="w-full">
        <template #header>
          <h4>Hi! {{ getFirstName }}</h4>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
          <NuxtLink to="/form">
            <UCard variant="solid" color="secondary">
              <div class="flex flex-col gap-3 justify-center text-center">
                <UIcon name="i-lucide-file-plus" class="mx-auto mb-2" size="48" />
                <span class="font-bold">Tambah Dokumen</span>
              </div>
            </UCard>
          </NuxtLink>
          <NuxtLink to="/my-document">
            <UCard variant="solid" color="secondary">
              <div class="flex flex-col gap-3 justify-center text-center">
                <UIcon name="i-lucide-file-chart-line" class="mx-auto mb-2" size="48" />
                <span class="font-bold">Dokumen Saya</span>
              </div>
            </UCard>
          </NuxtLink>
          
        </div>
      </UCard>

      <UCard v-else-if="getDisplayRole === 'Administrator'" class="w-full">
        <template #header>
          <h4>Hi! {{ getFirstName }}</h4>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
          <NuxtLink to="/users">
            <UCard variant="solid" color="secondary">
              <div class="flex flex-col gap-3 justify-center text-center">
                <UIcon name="i-lucide-user" class="mx-auto mb-2" size="48" />
                <span class="font-bold">Manage User</span>
              </div>
            </UCard>
          </NuxtLink>
          <NuxtLink to="/add-user">
            <UCard variant="solid" color="secondary">
              <div class="flex flex-col gap-3 justify-center text-center">
                <UIcon name="i-lucide-user-plus" class="mx-auto mb-2" size="48" />
                <span class="font-bold">Add User</span>
              </div>
            </UCard>
          </NuxtLink>
          <NuxtLink to="/document">
            <UCard variant="solid" color="secondary">
              <div class="flex flex-col gap-3 justify-center text-center">
                <UIcon name="i-lucide-file-chart-line" class="mx-auto mb-2" size="48" />
                <span class="font-bold">All Entries</span>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </UCard>

    </section>
  </UMain>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'
useHead({
  title: 'Dashboard'
})
const userStore = useUserStore()
const { getDisplayRole, getFirstName } = storeToRefs(userStore)
</script>