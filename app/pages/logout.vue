<template>
  <div />
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user';
const toast = useToast()
const userStore = useUserStore()

toast.add({
  title: 'Logout',
  description: 'Anda telah keluar',
  icon: 'i-lucide-alert-circle',
})
onMounted(() => {
  userStore.logoutUser()
  useRouter().push('/login')
  
})
</script>