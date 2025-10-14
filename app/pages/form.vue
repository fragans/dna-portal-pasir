<template>
  <div>
    <UForm :state="formState" :schema="schema" class="p-4" @submit="onSubmit">
      <UFormField label="Upload File" name="images">
        <UInput v-model="formState.images" type="file" />
      </UFormField>

    </UForm>
  </div>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const formState = reactive({
  images:undefined
})
const schema = z.object({
  images: z.string().min(6, "password minimal 6 karakter")
});
type Schema = z.output<typeof schema>
// const fetchKey = computed(() => `submit-form-checker-${new Date().getTime()}`)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('onSubmit', event);
  // await execute()
  
  // if (status.value === 'success' && data.value) {
  //   console.log('login berhasil', data.value);
  //   useCookie('dpp._token').value=data.value.accessToken // 7 hari
  //   // await useRouter().push('/')
  // } else {
  //   console.log('login gagal')
  // }
}
</script>