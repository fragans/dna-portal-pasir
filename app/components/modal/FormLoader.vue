<template>
  <UModal :dismissible="false" title="Mengirim form" prevent-close>
    <template #body>
      <div v-if="!isComplete" class="flex p-4 gap-2">
        <div v-for="(job, key) in props.jobs" :key="key">
          <p v-show="job.active">{{ job.title }} {{ job.type }} {{ job.progress }}% dari ({{key+1}}/{{ jobs.length }})</p>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col gap-3">
          <p class="text-center"> Berhasil menggungah form </p>
          <UButton block @click="handlerClose">Kembali</UButton>
        </div>
      </div>
    </template>

  </UModal>
</template>
<script setup lang="ts">
const router = useRouter()
const emit = defineEmits(['close'])
const props = defineProps<{
  jobs: FormJobs[]
}>()

const isComplete = computed(()=> {
  return props.jobs.every(job => job.progress === 100)
})

function handlerClose() {
  router.push('/')
  emit('close')
}
</script>
