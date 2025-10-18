<template>
  <div>
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div v-if="!isLogin">
        <UForm
          :state="formState"
          :schema="schema"
          aria-autocomplete="none"
          autocomplete="off"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField name="email">
            <UInput v-model="formState.email" size="xl" type="text" placeholder="Email"/>
          </UFormField>
          
          <UFormField name="password">
            <UInput v-model="formState.password" size="xl" :type="showPassword ? 'text' : 'password'" placeholder="Password">
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'showPassword password'"
                  :aria-pressed="showPassword"
                  aria-controls="password"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>
          <div class="p-4 text-sm text-gray-500">
            <UButton size="xl" block :loading="status === 'pending'" type="submit">Submit</UButton>
          </div>
        </UForm>
      </div>
      <div v-else class="text-center">
        <UButton to="/logout" size="xl">Logout?</UButton>
      </div>
      <div class="fixed bottom-2 right-2 text-xs text-gray-400">
        <a href="https://dummyjson.com/users" target="_blank">cheat</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { loginUser } from '~~/utils/apiRepo/auth';


const toast = useToast()
const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

const showPassword = ref(false)
const formState = reactive({
  email: undefined,
  password: undefined
})

const schema = z.object({
  password: z.string('Password tidak boleh kosong').min(5, "Password minimal 6 karakter"),
  email: z.string('Email tidak boleh kosong').min(5, "Email minimal 6 karakter"),
  // email: z.string('Email tidak boleh kosong').email(6, "Email tidak valid"),,
});
type Schema = z.output<typeof schema>

const { data, execute, status } = loginUser(formState)
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('onSubmit', event);
  await execute()
  
  if (status.value === 'success' && data.value) {
    console.log('login success', data.value);
    
    useCookie('dpp._token').value = data.value.token
    // useCookie('dpp._token_refresh').value = data.value.refreshToken
    
    userStore.setUserCookie(data.value.data)
    await useRouter().push('/')
  } else {
    toast.add({
      title: 'Gagal Login',
      description: 'Periksa kembali email dan password anda',
      icon: 'i-lucide-alert-circle',
    })
  }
}

</script>