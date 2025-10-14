<template>
  <section class="max-w-3xl mx-auto my-8">
    <div class="flex gap-4 flex-col md:flex-row">
      <UForm :state="formState" :schema="schema" class="p-4" @submit="onSubmit">
        <UFormField name="images">
          <UFileUpload v-model="formState.images" class="w-96 min-h-48" />
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
      
      <div  class="flex flex-col justify-center p-4 gap-4">
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
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
// import { useS3Upload } from '~/composables/useS3Upload';

const { url:imageUrl, isUploading, uploadProgress, upload } = useS3Upload()
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const formState = reactive({
  images:undefined
})
const schema = z.object({
  images: z.instanceof(File, { message: 'Image is required.' })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine( (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
});
type Schema = z.output<typeof schema>
// const fetchKey = computed(() => `submit-form-checker-${new Date().getTime()}`)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!formState.images) throw new Error('No file selected')
  await upload(formState.images)
  console.log('upload selesai', imageUrl.value);
  
  // if (status.value === 'success' && data.value) {
  //   console.log('login berhasil', data.value);
  //   useCookie('dpp._token').value=data.value.accessToken // 7 hari
  //   // await useRouter().push('/')
  // } else {
  //   console.log('login gagal')
  // }
}
</script>