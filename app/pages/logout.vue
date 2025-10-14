<template>
  <div>
    <UCard>
      logouting...
    </UCard>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user';
const userStore = useUserStore()

onMounted(() => {
  setInterval(() => {
    userStore.logoutUser()
    useRouter().push('/login')
  }, 1500)
})
</script>