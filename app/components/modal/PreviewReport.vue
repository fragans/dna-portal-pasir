<template>
  <UModal
    v-model:open="model"
    :dismissible="false"
    :title="`Preview Dokumen ${report ? report.formID : ''}`"
    size="xl"
  >
    <template #body>
      <div>Created by: {{ userProfile?.fullname }}</div>
      <div>tanggal: {{ report?.createdDate }}</div>
      <div class="flex gap-3">lokasi: 
        <a
          class="flex items-center gap-1"
          target="_blank"
          :href="`https://www.google.com/maps?q=${report?.place}`">
          <span class="underline text-blue-700">link to maps</span>
          <UIcon name="i-lucide-square-arrow-out-up-right" class="size-3" />
        </a></div>
      <div>Batch: {{ report?.batch ?? 0 }}</div>
      <div>Sopir: {{ report?.driverName ?? '-' }}</div>
      <div>No. Plat: {{ report?.vehicleNo ?? '-' }}</div>
      <div>Muatan: {{ report?.loadAmount ?? 0 }} ton</div>
      <div>Keterangan: {{ report?.description ?? '-'}}</div>
      <div>Dokumen({{ report?.documents.length }}):</div>
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="img in docs" :key="img.link" class="flex">
          <template v-if="img.type === 'video'">
            <video controls width="200" class="rounded-md border border-gray-300">
              <source :src="img.link" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </template>
          <template v-else>
            <img :src="img.link" :alt="img.link" class="w-[200px] h-min-[120px] object-cover">
          </template>
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
const docs = ref<Record<string, string>[]>([])

const userProfile = ref<UserData>()
async function generateImgUrl (link: string) {
  return await s3Upload.getPresignedUrl(link)
}

// function getFileType(url: string): 'image' | 'video' {
//   const match = url.match(/\.([a-zA-Z0-9]+)(?=\?)/);
//   if (!match) return 'image';
//   const [_,firstMatch] = match;
//   if (!firstMatch) return 'image';
//   const ext = firstMatch.toLowerCase();

//   const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
//   const videoExt = ['mp4', 'mov', 'mkv', 'webm', 'avi'];

//   if (imageExt.includes(ext)) return 'image';
//   if (videoExt.includes(ext)) return 'video';

//   return 'image';
// }
function getFileType(url: string): 'image' | 'video' {
  // Extract the folder after the bucket
  const match = url.match(/wasabisys\.com\/[^/]+\/([^/]+)\//);
  if (!match) return 'image';
  const [_,firstMatch] = match;
  if (!firstMatch) return 'image';
  const folder = firstMatch.toLowerCase();

  if (folder.includes('video')) return 'video';
  if (folder.includes('image') || folder.includes('img')) return 'image';

  return 'image'; // fallback
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
        const type = getFileType(el.link)
        docs.value.push({link, type}) 
      })
    }
}, { immediate: true })


</script>