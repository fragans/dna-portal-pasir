<template>
  <section class="max-w-3xl mx-auto my-8">
    <div class="flex gap-4 flex-col md:flex-row">
      <UForm :state="formState" :schema="schema" class="flex flex-col gap-4 p-4 md:p-0 w-full" @submit="onSubmit">
        <UAccordion :items="items" class="opacity-50">
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <UFormField name="date">
                <UInput v-model="formState.date" size="xl" type="text" placeholder="Tanggal Keberangkatan" disabled variant="ghost"/>
              </UFormField>
      
              <UFormField name="location">
                <UInput v-model="formState.location" size="xl" type="text" placeholder="Lokasi" disabled variant="ghost"/>
              </UFormField>
            </div>
          </template>
        </UAccordion>

        <UFormField name="sopir" label="Nama Sopir">
          <UInput v-model="formState.namaSopir" size="xl" type="text" placeholder="Nama Sopir"/>
        </UFormField>

        <UFormField name="Batch" label="Batch">
          <UInput v-model="formState.namaSopir" size="xl" type="text" placeholder="Pengiriman ke-"/>
        </UFormField>

        <UFormField name="Bobot" label="Bobot Muatan">
          <UInput v-model="formState.namaSopir" size="xl" type="number">
            <template #trailing>
              <div class="flex items-center gap-3">
                <span> Ton </span>
              </div>
            </template>
            </UInput>
        </UFormField>

        <UFormField name="plat" label="No Kendaraan Supir">
          <UInput v-model="formState.noSupir" size="xl" type="text" placeholder="AB1234CD"/>
        </UFormField>
        <UFormField name="keterangan" label="Keterangan">
          <UTextarea v-model="formState.noSupir" size="xl" type="text" placeholder=""/>
        </UFormField>

        <UFormField name="images" label="Video/Foto">
          <UFileUpload v-model="formState.images" class="w-full" description="PNG or JPG (max. 5MB per file)" :multiple accept="image/*" />
        </UFormField>

        
        <div v-if="!imageUrl" class="p-4 text-sm text-gray-500">
          <UButton block type="submit" :loading="isUploading">
            Submit
            <span>
              <template v-if="isUploading"> ({{ uploadProgress }}%) </template>
              <template v-else-if="imageUrl"> - Selesai </template>
            </span>
          </UButton>
        </div>
      </UForm>
    </div>
  </section>
  
   <!-- <div  class="flex flex-col justify-center p-4 gap-4">
        <a
          href="https://console.wasabisys.com/file_manager/dna-portal-pasir-silika?region=ap-southeast-1"
          target="_blank"
          class="text-blue-600 hover:underline"
        >
          <span> check wasabi console </span>
          <UIcon name="i-lucide-external-link" class="size-3" />
        </a>
        <a
          v-if="imageUrl"
          target="_blank"
          :href="imageUrl"
          class="w-[200px] text-blue-600 line-clamp-1 hover:underline"
        >
        {{ imageUrl }}
        </a>
        <p v-else>upload an Image first! <UIcon name="lucide:angry" class="size-3" /> </p>
      </div> -->
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import type { FormSubmitEvent, AccordionItem } from '@nuxt/ui'
import * as z from 'zod'
const { getUsername } = useUserStore()
const toast = useToast()
// import { useS3Upload } from '~/composables/useS3Upload';
const getFormatDate = computed(() => {
  const dd = new Date()
  const day = String(dd.getDate()).padStart(2, '0')
  const month = String(dd.getMonth() + 1).padStart(2, '0') //January is 0!
  const year = dd.getFullYear()
  const hours = String(dd.getHours()).padStart(2, '0')
  const minutes = String(dd.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
})

const getCoordinates = computed(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      formState.location = `${lat}, ${lon}`
    })
  }
  return formState.location
})

const { url:imageUrl, isUploading, uploadProgress, upload } = useS3Upload()
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const formState = reactive({
  date: '',
  location: '',
  namaSopir:undefined,
  images:[] as File[],
  noSupir:undefined,
})
const fileValidator = z.instanceof(File, { message: 'Image harus diisi.' })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine( (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
const schema = z.object({
  noSupir: z.string().min(9, 'No kendaraan sopir harus diisi.'),
  muatan: z.number().min(1, 'Bobot muatan harus diisi.'),
  batch: z.string().min(1, 'Batch harus diisi.'),
  date: z.string().min(6, 'Tanggal keberangkatan harus diisi.'),
  namaSopir: z.string().min(1, 'Nama sopir harus diisi.'),
  images: z.array(fileValidator).min(1, 'Foto/Video harus diisi.'),
});
type Schema = z.output<typeof schema>
// const fetchKey = computed(() => `submit-form-checker-${new Date().getTime()}`)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!formState.images) throw new Error('No file selected')
  const [firstFile] = formState.images
  await upload(firstFile!)
  console.log('upload selesai', imageUrl.value);
  
  // if (status.value === 'success' && data.value) {
  //   console.log('login berhasil', data.value);
  //   useCookie('dpp._token').value=data.value.accessToken // 7 hari
  //   // await useRouter().push('/')
  // } else {
  //   console.log('login gagal')
  // }
}
const items: AccordionItem[] = [
  {
    label:  getUsername ,
    icon: 'i-lucide-swatch-book'
  },
]

async function hasLocationAccess (): Promise<boolean> {
  const perm = await navigator.permissions.query({name: 'geolocation'})
  const isGranted = perm.state === 'granted'
  if (!isGranted) {
    toast.add({
      title: 'Akses lokasi diperlukan',
      description: 'Silakan izinkan akses lokasi untuk melanjutkan.',
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: -1,
    })
  }
  return isGranted
}

onMounted( async () => {
  await hasLocationAccess()
  formState.date = getFormatDate.value
  formState.location = getCoordinates.value
  
})
</script>