<template>
  <div>
    <div class="flex flex-col items-center justify-center min-h-screen text-center">
      <!-- <h2 class="uppercase">
          login page
      </h2>
      <h1>
          dna-portal-pasir
      </h1> -->
      <div>
        <UForm
          :state="formState"
          :schema="schema"
          aria-autocomplete="none"
          autocomplete="off"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Email" name="email">
            <UInput v-model="formState.email" type="text" />
          </UFormField>
          
          <UFormField label="Password" name="password">
            <UInput v-model="formState.password" type="password" />
          </UFormField>
          <div class="p-4 text-sm text-gray-500">
            <UButton type="submit">Submit</UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { loginUser } from '~~/utils/apiRepo/auth';


const formState = reactive({
  email: undefined,
  password: undefined
})

const schema = z.object({
  password: z.string().min(6, "password minimal 6 karakter"),
  email: z.string().min(6, "email minimal 6 karakter"),
  // email: z.email("alamat email tidak valid"),
});
type Schema = z.output<typeof schema>

const { data, execute, status } = loginUser(formState)
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('onSubmit', event);
  await execute()
  
  if (status.value === 'success' && data.value) {
    console.log('login berhasil', data.value);
    useCookie('dpp._token').value=data.value.accessToken // 7 hari
    // await useRouter().push('/')
  } else {
    console.log('login gagal')
  }
}

</script>