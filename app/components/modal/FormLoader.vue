<template>
  <UModal :dismissible="false" :title="getTitle" description="Mengirim formulir Anda" prevent-close>
    <template #body>
      <div class="flex flex-col gap-2 pb-4">
        <div v-for="(job, key) in props.jobs" :key="key" class="flex items-center">
          <UIcon v-if="job.done" name="i-lucide-check" class="text-green-500 mr-2"/>
          <UIcon v-else name="i-lucide-loader" class="animate-spin mr-2" />
          <!-- <p>({{key+1}}/{{ jobs.length }}) {{ job.title }} {{ job.type }} {{ job.done ? '100' : job.progress }}%</p> -->
          <p>({{key+1}}/{{ jobs.length }}) {{ job.title }} {{ job.type }} {{ job.progress }}%</p>
        </div>
      </div>
      <div v-if="isAllJobsDone">
        <div class="flex flex-col gap-3">
          <UButton block @click="handlerClose">Kembali</UButton>
        </div>
      </div>
    </template>
    <!-- <template #header>
      <UIcon name="i-lucide-loader" class="animate-spin" />
      <p>Mohon tunggu</p>
    </template> -->

  </UModal>
</template>
<script setup lang="ts">
const router = useRouter()
const emit = defineEmits(['close'])
const props = defineProps<{
  jobs: FormJobs[],
}>()

const isAllJobsDone = computed(()=> {
  return props.jobs.every(job => job.done)
})
const getTitle = computed(() => {
  if (isAllJobsDone.value) return 'Berhasil menggungah form'
  return 'Mohon tunggu'
})

function handlerClose() {
  router.push('/')
  emit('close')
}
</script>
