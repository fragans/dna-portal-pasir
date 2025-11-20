<template>
  <div class="max-w-2xl mx-auto my-8">
    <UBlogPost
      :title="getUsername"
      :description="`${getFirstName} ${getLastName}`"
      :image="getUserAvatar"
    >
      <template #body>
        <div class="grid grid-cols-12 grid-rows-4 gap-2 items-center">
          <UIcon name="i-lucide-hash" class="col-span-1" /> <p class="col-span-11"> {{ profile?.masterUserID }} </p>

          <UIcon name="i-lucide-user" class="col-span-1" /> <p class="col-span-11"> {{ getUserProfile?.fullname }} </p>

          <UIcon name="i-lucide-mail" class="col-span-1" /> <p class="col-span-11"> {{ getUserProfile?.email }} </p>

          <UIcon name="i-lucide-phone" class="col-span-1" /> <p class="col-span-11"> {{ getUserProfile?.phoneNumber }} </p>
          
          <UIcon name="i-lucide-home" class="col-span-1" /> <p class="col-span-11"> {{ getUserProfile?.address }} </p>
          
          <UIcon name="i-lucide-calendar" class="col-span-1" /> <p class="col-span-11"> {{ getUserProfile?.birthPlaceDate }} </p>
          
          <UIcon name="i-lucide-network" class="col-span-1" /> <p class="col-span-11"> {{ getUserProfile?.assignmentPlace }} </p>
          
        </div>
      </template>
    </UBlogPost>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { getProfileById } from '~~/utils/apiRepo/user';

const userStore = useUserStore()
const { getFirstName, getUserAvatar, getLastName, getUsername, getUserProfile} = storeToRefs(userStore)
const { data, execute } = await getProfileById(getUsername.value)
await execute()

const profile = computed<UserData | undefined>(() => {
  if (!data.value) return undefined
  return data.value.data
})

useHead({
  title: 'Profile ',
})
</script>
