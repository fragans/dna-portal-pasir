<template>
  <div>
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="py-4">
        <img src="/logo/logo-color.png" alt="" class="w-36 h-36">
      </div>
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
      <div v-else class="flex flex-col gap-3 text-center">
        <span>
          Apakah kamu ingin keluar?
        </span>
        <div class="div grid grid-cols-2 gap-4">
          <UButton variant="outline" block to="/logout" size="xl">Logout</UButton>
          <UButton block to="/" size="xl">Ke Beranda</UButton>
        </div>
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
  password: z.string('Password tidak boleh kosong').min(4, "Password minimal 4 karakter"),
  email: z.string('Email tidak boleh kosong').min(5, "Email minimal 6 karakter"),
  // email: z.string('Email tidak boleh kosong').email(6, "Email tidak valid"),,
});
type Schema = z.output<typeof schema>

const { data, execute, status } = loginUser(formState)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onSubmit(event: FormSubmitEvent<Schema>) { 
  try {
    await execute()
  
    if (status.value === 'success' && data.value) {
      console.log('login success');
      
      userStore.setTokenCookie(data.value.token)
      userStore.setUserCookie(data.value.data)

      await useRouter().push('/')
    } else {
      toast.add({
        title: 'Gagal Login',
        description: 'Periksa kembali email dan password anda',
        icon: 'i-lucide-alert-circle',
      })
    }  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.add({
      title: 'Gagal Login',
      description: 'Periksa kembali email dan password anda',
      icon: 'i-lucide-alert-circle',
    })
  }
  
}

useHead({
  title: 'Login'
})

</script>
