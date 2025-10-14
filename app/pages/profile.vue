<template>
  <div class="max-w-2xl mx-auto my-8">
    <UBlogPost
      :title="getUsername"
      :description="`${getFirstName} ${getLastName}`"
      :image="getUserAvatar"
    >
      <template #body>
        <div class="grid grid-cols-12 grid-rows-4 gap-2 items-center">
          <UIcon name="i-lucide-phone" class="col-span-1" /> <p class="col-span-11"> {{ userProfile?.phone }} </p>
          
          <UIcon name="i-lucide-home" class="col-span-1" /> <p class="col-span-11"> {{ joinAddress(userProfile?.address) }} </p>
          
          <UIcon name="i-lucide-calendar" class="col-span-1" /> <p class="col-span-11"> {{ userProfile?.birthDate }} </p>
          
          <UIcon name="i-lucide-network" class="col-span-1" /> <p class="col-span-11"> {{ userProfile?.company.address.city }} </p>
          
        </div>
      </template>
    </UBlogPost>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { getProfile } from '~~/utils/apiRepo/auth';

const userStore = useUserStore()
const { getFirstName, getUserAvatar, getLastName, getUsername, getToken, userProfile } = storeToRefs(userStore)

const { execute, data, status } = getProfile(getToken.value)
async function fetchProfile() {
  await execute()
  if (status.value === 'success' && data.value) {
    userStore.setUserProfile(data.value)
  } else {
    console.log('fetch profile gagal')
  }
}

function joinAddress(address: Address|undefined): string {
  if (!address) return ''
  const arrayAddress = Object.values(address);
  return arrayAddress.join(', ')
}
await fetchProfile()
</script>
