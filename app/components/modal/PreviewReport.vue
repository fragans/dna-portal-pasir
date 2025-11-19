<template>
  <UModal
    v-model:open="model"
    :title="`Preview Dokumen ${report ? report.formID : ''}`"
    size="xl"
  >
    <template #body>
      <pre>tanggal: {{ report?.createdDate }}</pre>
      <pre>Created by: {{ userProfile?.fullname }}</pre>
      <pre>Batch: {{ report?.batch ?? 0 }}</pre>
      <pre>Sopir: {{ report?.driverName ?? '' }}</pre>
      <pre>No. Plat: {{ report?.vehicleNo ?? '' }}</pre>
      <pre>Muatan: {{ report?.loadAmount ?? 0 }} ton</pre>
      <pre>Keterangan: {{ report?.description }}</pre>
      <pre>Dokumen({{ report?.documents.length }}):</pre>
      <div class="flex flex-wrap gap-4">
        <div v-for="img in docs" :key="img" >
          <img :src="img" :alt="img" class="w-[120px] h-min-[120px] object-cover">
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { getProfileById } from '~~/utils/apiRepo/user';
const props = defineProps<{
  report: GetReport | null
}>()
const s3Upload = useS3Upload()
const model =defineModel<boolean>()
const docs = ref<string[]>([])

const userProfile = ref<UserData>()
async function generateImgUrl (link: string) {
  return await s3Upload.getPresignedUrl(link)
}

watch(() => props.report, 
  async (newReport) => {
    if (newReport) {
      docs.value = []
      const { data, execute } = await getProfileById(newReport.masterUserID)
      await execute()
      if (data.value)
      userProfile.value = data.value?.data
      props.report?.documents.forEach(async (el) => {
        const link = await generateImgUrl(el.link)
        docs.value.push(link) 
      })
    }
}, { immediate: true })


</script>