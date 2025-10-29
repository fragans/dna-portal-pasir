<template>
  <div>
    <!-- eslint-disable vue/valid-v-slot -->
    <section class="max-w-3xl mx-auto my-8">
      <div class="flex gap-4 flex-col md:flex-row">
        <UForm :state="formState" :schema="schema" class="flex flex-col gap-4 p-4 md:p-0 w-full" @submit="onSubmit">
          <UAccordion :items="[{ label:  getUsername , icon: 'i-lucide-user' }]" class="opacity-50">
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
                  <div class="flex  w-full min-h-[200px] border border-gray-600 border-dashed rounded-lg p-4 justify-center">
                    <div v-if="formState.dokumen.length === 0" class="w-full min-h-[200px] flex-col items-center justify-center flex gap-3 text-gray-500" @click="open()">
                      <UIcon name="i-lucide-cloud-upload" class="text-4xl" />
                      <span>{{ uploadHint }}</span>
                    </div>
                    <div v-else class="w-full flex flex-wrap items-center gap-5">
                      <div v-for="(file, key) in formState.dokumen" :key="key" class="relative rounded-lg border border-primary">
                        <UButton
                          ref="removeFileButtonRef"
                          variant="solid"
                          color="error"
                          size="xs"
                          class="p-1 rounded-full absolute -top-2 -right-2 z-10"
                          @click="removeFile(key); removeUploadedfile(key)"
                        >
                          <UIcon name="i-lucide-x" class="text-white size-4"/>
                        </UButton>
                        <div class="relative">

                          <img :src="createObjectUrl(file)" class="w-20 h-20 object-cover rounded-lg">
                          <div v-if="!uploadDone" class="w-full absolute inset-0 flex items-center justify-center bg-black/75 rounded-lg">
                            <UIcon name="i-lucide-loader" class="text-white size-5 animate-spin"/>
                          </div>
                        </div>
                      </div>
                      <div class="flex justify-end w-20 h-20 border-dashed border-gray-600">
                        <UButton variant="outline" block @click="open()">
                          <UIcon name="i-lucide-plus" class="text-4xl text-gray-500" />
                        </UButton>
                      </div>
                    </div>
                  </div>
                  
                </div>
                
              </template>
            </UFileUpload>
          </UFormField>

          
          <div class="p-4 text-sm text-gray-500">
            <UButton block type="submit" :disabled="!uploadDone">
              <span v-if="uploadDone">
                Kirim
              </span>
              <span v-else class="animate-pulse text-gray-500">
                {{ `Uploading(${formState.dokumen.length})`  }}
              </span>
            </UButton>
          </div>
          <div>
            <div v-for="(url,key) in imgUrls" :key="key" class="py-2">
              <p>{{ url.fileKey }}</p>
              <a :href="url.url" class="line-clamp-1">{{ url.url }}</a>
            </div>
          </div>
        </UForm>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { insertDocument } from '~~/utils/apiRepo/report'
import ModalFormLoader from '~/components/modal/FormLoader.vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { UButton } from '#components'
import * as z from 'zod'


const { getUsername } = useUserStore()
const toast = useToast()

const isGrantedLocation = ref(false)
const removeFileButtonRef = ref<typeof UButton[] | null>(null)

const getFormatDate = computed(() => {
  const dd = new Date()
  const day = String(dd.getDate()).padStart(2, '0')
  const month = String(dd.getMonth() + 1).padStart(2, '0') //January is 0!
  const year = dd.getFullYear()
  const hours = String(dd.getHours()).padStart(2, '0')
  const minutes = String(dd.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
})

const jobs = ref<FormJobs[]>([])
const overlay = useOverlay()

const modal = overlay.create(ModalFormLoader, {
  props: { jobs: jobs.value },
  destroyOnClose: true
})

interface UploadedFile {
  file: File
  fileKey: string
  url: string
}

// to watch upload progress
// url is the flag for a file has been uploaded
// url default value is ''
const imgUrls = ref<UploadedFile[]>([])

const uploadDone = computed<undefined|boolean>(() => {
  const hasUncomplete = imgUrls.value.find((img)=> img.url === '')
  console.log({hasUncomplete});
  
  if (hasUncomplete) return false
  return true
})

function removeUploadedfile (index: number) {
  imgUrls.value.splice(index, 1)
}

function createObjectUrl (file: File): string {
  if (file.type.startsWith('video')) return 'https://placehold.co/100/000000/FFFFFF/webp?text=%3E'
  return URL.createObjectURL(file)
}

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

const uploadHint = 'PNG or JPG (max. 5MB per file), Minimal 1 foto'

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];
const formState = reactive({
  date: '',
  location: '',
  namaSopir: '',
  dokumen: [] as File[],
  noSupir: '',
  batch: 0,
  muatan: 0,
  keterangan: '',
})
// validator
const requiredMessage = 'harus diisi'
const fileValidator = z.instanceof(File, { message: `Image ${requiredMessage}.` })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
    .refine( (file) => ACCEPTED_DOC_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, .webp, .mp4, and .mov formats are supported." )
const schema = z.object({
  date: z.string(`Tanggal keberangkatan ${requiredMessage}.`),
  location: z.string(`Lokasi keberangkatan ${requiredMessage}.`),
  noSupir: z.string(`No kendaraan sopir ${requiredMessage}.`).min(4, 'No kendaraan minimal 4 digit. ex: AB1234CD').max(9, 'No kendaraan minimal 8 digit. ex: AB1234CD'),
  muatan: z.number(`Muatan ${requiredMessage}.`).min(1, 'Nilai minimal 1 ton.'),
  batch: z.number(`Batch harus ${requiredMessage}.`).min(1, 'Nilai Batch harus lebih besar dari 0'),
  namaSopir: z.string(`Nama sopir ${requiredMessage}.`).min(3, 'Nama sopir minimal 3 huruf.'),
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onFileChange(event: Event) {
  // console.log(formState.dokumen);
  // const distincted = distinctFiles(formState.dokumen)
  // console.log(distincted);
  
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState.dokumen.forEach( async (doc, index) => {  
    const fileKey = `${doc.type}/${doc.name}`
    // const isUploaded = imgUrls.value.some((url) => url.fileKey === fileKey)
    const isUploaded = imgUrls.value.some((url) => url.fileKey === fileKey)
    if (!isUploaded) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { uploadProgress, upload, url } = useS3Upload()
      const progress = ref(0)
      watch(uploadProgress, (newValue) => {
        progress.value = newValue
      })
      console.log('upload');
      
      await upload(doc);
      imgUrls.value.push({
        url:url.value,
        fileKey,
        file:doc
      })
    } else {
      // await nextTick(()=> {
      //   console.log(removeFileButtonRef.value);
      //   removeFileButtonRef.value![index]!.click()
      // })
      // remove dupe file from State
      
      // slots.default()[0].removeFile(index)
    }
    

  });
  
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const lastJob = {
    type: 'form',
    title: 'menyimpan',
    done: false,
    progress: 0,
  };

  const documents = imgUrls.value.map((doc) => doc.url)
  const generatedPayload: ReportDocument = {
    masterUserID: getUsername,
    tanggal: formState.date,
    lokasi: formState.location,
    batch: formState.batch!.toString(),
    muatan: formState.muatan,
    namaSupir: formState.namaSopir,
    noSupir: formState.noSupir,
    keterangan: formState.keterangan,
    documents
  }
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

onMounted( async () => {
  await hasLocationAccess()
  formState.date = getFormatDate.value
  formState.location = getCoordinates.value
  
})
</script>
