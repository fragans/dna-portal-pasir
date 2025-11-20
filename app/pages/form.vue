<template>
  <div>
    <!-- eslint-disable vue/valid-v-slot -->
    <section class="max-w-3xl mx-auto my-8">
      <div class="flex gap-4 flex-col md:flex-row">
        <UForm :state="formState" :schema="schema" class="flex flex-col gap-4 p-4 md:p-0 w-full" @submit="onSubmit" @error="onError">
          <UAccordion
            v-model="accordionExpanded"
            :items="[{ label:  getUsername , icon: 'i-lucide-user' }]"
            class="opacity-50"
          >
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

          <UFormField name="namaSopir" label="Nama Sopir">
            <UInput v-model="formState.namaSopir" size="xl" type="text" placeholder="Nama Sopir"/>
          </UFormField>

          <UFormField name="batch" label="Batch">
            <UInput v-model="formState.batch" size="xl" type="number" placeholder="Pengiriman ke-"/>
          </UFormField>

          <UFormField name="muatan" label="Bobot Muatan">
            <UInput v-model="formState.muatan" size="xl" type="number">
              <template #trailing>
                <div class="flex items-center gap-3">
                  <span> Ton </span>
                </div>
              </template>
              </UInput>
          </UFormField>

          <UFormField name="noSupir" label="No Kendaraan Supir">
            <UInput v-model="formState.noSupir" size="xl" type="text" placeholder="AB1234CD"/>
          </UFormField>
          <UFormField name="keterangan" label="Keterangan">
            <UTextarea v-model="formState.keterangan" size="xl" type="text" placeholder=""/>
          </UFormField>

          <UFormField name="dokumen" label="Video/Foto">
            <UFileUpload
              ref="fileUploadRef"
              v-model="formState.dokumen"
              :interactive="false"
              class="w-full"
              :description="uploadHint"
              multiple
              accept="image/*, video/*"
              @change="onFileChange"
            >
              <template #default="{removeFile, open}">
                <div class="">
                  <div class="relative flex  w-full min-h-[200px] border border-gray-600 border-dashed rounded-lg p-4 justify-center">
                    <div v-if="!isUploading" class="flex absolute top-2 right-2 w-6 h-6">
                      <UIcon name="i-lucide-loader" class="text-gray-500 size-5 animate-spin"/>
                    </div>
                    <div v-if="formState.dokumen.length === 0" class="w-full min-h-[200px] flex-col items-center justify-center flex gap-3 text-gray-500" @click="open()">
                      <UIcon name="i-lucide-cloud-upload" class="text-4xl" />
                      <span>{{ uploadHint }}</span>
                    </div>
                    <div v-else class="w-full flex flex-wrap items-center gap-5">
                      <div v-for="(file, key) in formState.dokumen" :key="key" class="relative rounded-lg border border-primary">
                        <div class="relative">

                          <img :src="createObjectUrl(file)" class="w-20 h-20 object-cover rounded-lg">
                        </div>
                      </div>
                      <div class="flex justify-end w-20 h-20 border-dashed border-gray-600">
                        <UButton variant="outline" block color="error" @click="removeFile();open();clearUploadedfiles()">
                          <UIcon name="i-lucide-trash-2" class="text-4xl text-gray-500" />
                        </UButton>
                      </div>
                    </div>
                  </div>
                  
                </div>
                
              </template>
            </UFileUpload>
          </UFormField>

          
          <div class="p-4 text-sm text-gray-500">
            <UButton block type="submit" :disabled="!isUploading">
              <span v-if="isUploading">
                Kirim
              </span>
              <span v-else class="animate-pulse text-gray-500">
                {{ `Uploading(${formState.dokumen.length})`  }}
              </span>
            </UButton>
          </div>
          <div>

            <div v-for="(img,key) in imgUrls" :key="key" class="py-2">
              <p>{{ img.fileKey }}</p>
              <p>{{  img.progress }} %</p>
              <a :href="img.url" class="line-clamp-1">{{ img.url }}</a>
            </div>
          </div>
        </UForm>
        <UModal v-model:open="alertLocationAccess">
          <template #title>
            <UIcon name="i-lucide-map-pin-x" class="size-4" />
            Akses Lokasi Diperlukan
          </template>
          <template #body>
            Silahkan ijinkan akses lokasi untuk melanjutkan
          </template>
        </UModal>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { insertDocument } from '~~/utils/apiRepo/report'
import ModalFormLoader from '~/components/modal/FormLoader.vue'
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'
import { UButton } from '#components'
import * as z from 'zod'


const { getUsername } = useUserStore()
const toast = useToast()

const isGrantedLocation = ref(false)
const alertLocationAccess = ref(false)
const accordionExpanded = ref()

const jobs = ref<FormJobs[]>([])
const overlay = useOverlay()

const modal = overlay.create(ModalFormLoader, {
  props: { jobs: jobs.value },
  destroyOnClose: true
})

interface UploadedFile {
  file: File
  fileKey: string
  url: string,
  progress: number
}

// to watch upload progress
// url is the flag for a file has been uploaded
// url default value is ''
const imgUrls = ref<UploadedFile[]>([])

const isUploading = computed<undefined|boolean>(() => {
  const hasUncomplete = imgUrls.value.find((img) => img.progress < 100)
  return !hasUncomplete
})

function clearUploadedfiles () {
  imgUrls.value = []
}

function createObjectUrl (file: File): string {
  if (file.type.startsWith('video')) return 'https://placehold.co/100/000000/FFFFFF/webp?text=%3E'
  return URL.createObjectURL(file)
}

const uploadHint = 'PNG or JPG (max. 20MB per file), Minimal 1 foto'

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/mov"];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];
const formState = reactive<FormStateDocument>({
  date: undefined,
  location: undefined,
  namaSopir: undefined,
  dokumen: [] as File[],
  noSupir: undefined,
  batch: undefined,
  muatan: undefined,
  keterangan: undefined,
})
// validator
const requiredMessage = 'harus diisi'
const fileValidator = z.instanceof(File, { message: `Image ${requiredMessage}.` })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
    .refine( (file) => ACCEPTED_DOC_TYPES.includes(file.type), "Hanya mendukung format .jpg, .jpeg, .png, .webp, .mp4, and .mov" )
const schema = z.object({
  date: z.string(`Tanggal keberangkatan ${requiredMessage}.`),
  location: z.string(`Lokasi keberangkatan ${requiredMessage}.`),
  noSupir: z.string(`No kendaraan sopir ${requiredMessage}.`)
    .min(4, 'No kendaraan minimal 4 digit. ex: AB1234CD')
    .max(9, 'No kendaraan minimal 8 digit. ex: AB1234CD')
    .optional(),
  muatan: z.number(`Muatan ${requiredMessage}.`).min(1, 'Nilai minimal 1 ton.').optional(),
  batch: z.number(`Batch harus ${requiredMessage}.`).min(1, 'Nilai Batch harus lebih besar dari 0').optional(),
  namaSopir: z.string(`Nama sopir ${requiredMessage}.`).min(3, 'Nama sopir minimal 3 huruf.').optional(),
  dokumen: z.array(fileValidator)
    .refine(
      (files) => files.filter((file) => file.type.startsWith('image')).length >= 1,
      { message: 'Minimal 1 gambar harus diunggah.' },
    )
    .refine(
      (files) => files.filter((file) => file.type.startsWith('image')).length <= 5,
      { message: 'Maksimal 5 gambar yang bisa diunggah.' },
    )
    .refine(
      (files) => files.filter((file) => file.type.startsWith('video')).length <= 1,
      { message: 'Maksimal 1 video yang bisa diunggah.' },
    ),
  keterangan: z.string().optional(),
});
type Schema = z.output<typeof schema>


function mockUpload(job: FormJobs) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (job.progress < 100) {
        job.progress += 10
      } else {
        clearInterval(interval)
        job.done = true
        resolve()
      }
    }, 100)
  })
}
function validateFileDokumen () {
  const dokumenSchema = schema.pick({ dokumen: true });
    const result = dokumenSchema.safeParse({
      dokumen: formState.dokumen,
    })
    return result
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onFileChange(event: Event) {
  
  formState.dokumen.forEach( async (doc, index) => {  

    const isValid = validateFileDokumen()
    if (!isValid.success) {
      toast.add({
        title: 'Gagal mengunggah',
        description: isValid.error.issues[0]!.message,
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
      formState.dokumen = []
      return
    }

    const fileKey = `${doc.type}/${doc.name}`
    const isUploaded = imgUrls.value.some((url) => url.fileKey === fileKey)
    if (!isUploaded) {
      const { uploadProgress, upload, url } = useS3Upload()
      imgUrls.value.push({
        url:url.value,
        fileKey,
        file:doc,
        progress: uploadProgress.value
      })
      watch(uploadProgress, () => {
       imgUrls.value[index]!.progress = uploadProgress.value
      })
      watch(url, () => {
        imgUrls.value[index]!.url = url.value
      })
      
      console.log('upload');
      await upload(doc);
      
    }
  });
  
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event);
  
  const lastJob = {
    type: 'form',
    title: 'menyimpan',
    done: false,
    progress: 0,
  };

  const documents = imgUrls.value.map((doc) => doc.url)
  const generatedPayload: DocumentPayload = {
    masterUserID: getUsername,
    tanggal: formState.date!,
    lokasi: formState.location!,
    batch: formState.batch ? formState.batch.toString() : '1',
    muatan: formState.muatan ?? 0,
    namaSupir: formState.namaSopir ?? '',
    noSupir: formState.noSupir ?? '',
    keterangan: formState.keterangan ?? '',
    documents
  }
  console.log(generatedPayload);
  
  try {
    const { execute:executeInsertDocument, status } = await insertDocument(generatedPayload)
    await executeInsertDocument()
    if (status.value === 'error') {
      toast.add({
        title: 'Gagal menyimpan',
        description: 'Periksa kembali formulir anda',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
      return
    }
    modal.open();
    jobs.value.push(lastJob);
    const lastIndex = jobs.value.length - 1;
    await mockUpload(jobs.value[lastIndex]!);
  } catch (error) {
    console.log(error);
    toast.add({
      title: 'Gagal menyimpan',
      description: 'Periksa kembali formulir anda',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  } 
  
}
function onError (event: FormErrorEvent) {
  console.log({event});
  const hasLocationError = event.errors.find((error) => error.name === 'location') 

  if (hasLocationError) alertLocationAccess.value = true
  
  
}
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
    return false
  }
  isGrantedLocation.value = true
  return isGranted
}

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

onMounted( async () => {
  await hasLocationAccess()
  formState.date = getFormatDate.value
  formState.location = getCoordinates.value
  
})
</script>
