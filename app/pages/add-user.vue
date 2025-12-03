<template>
  <section class="max-w-3xl mx-auto my-8">
    <UForm :state="formState" :schema="schema" class="flex flex-col gap-4 w-full" @submit="handleFormSubmit" @error="onError">
      <UFormField name="fullname" label="Nama Lengkap">
        <UInput v-model="formState.fullname" size="xl" type="text" />
      </UFormField>
      <UFormField name="email" label="Email">
        <UInput v-model="formState.email" size="xl" type="email" placeholder="xxx@mail.com" />
      </UFormField>
      <UFormField name="phoneNumber" label="Nomor Telepon">
        <UInput v-model="formState.phoneNumber" size="xl" type="tel" />
      </UFormField>
      <UFormField name="address" label="Alamat">
        <UTextarea v-model="formState.address" size="xl" />
      </UFormField>
      <UCard variant="outline" :class="[birthErrorMsg ? 'ring-red-500' : 'ring-gray-200']">
        <template #header>
          <p>
            <span class="text-sm">Tempat Tanggal Lahir</span>
            <span class="text-xs text-gray-500 float-right">{{ formState.birthPlaceDate }}</span>
          </p>
          <p v-if="birthErrorMsg" class="text-xs">
            <span class="text-red-500">{{ birthErrorMsg }}</span>
          </p>
          <UFormField name="birthPlaceDate" class="hidden">
            <UInput v-model="formState.birthPlaceDate" size="xl" type="text"/>
          </UFormField>
        </template>
        <template #default>
          <div class="flex flex-col gap-4">
            <UFormField name="birthPlace" label="Provinsi">
              <UInput v-model="birthPlace" size="xl" type="text" @change="formatterBirthDatePlace()"/>
            </UFormField>
            {{ calendarValue }}
            <UModal
              v-model:open="calendarOpen"
              :dismissible="false"
              title="Tanggal Pertama Kirim Koran"
              description="calendar picker modal"
            >
              <UFormField name="birthDate" label="Tanggal" @click="calendarOpen = true" >
                <UInput v-model="formattedDate" icon="i-lucide-calendar-days" size="xl" type="text"/>
              </UFormField>
              <template #content>
                <div class="p-4">
                  <UCalendar v-model="calendarValue" :default-value="defaultDate" class="p-2" @change="formatterBirthDatePlace()"/>
                  <div class="flex justify-end pt-4">
                    <UButton variant="outline" color="primary" class="mr-2" @click="calendarOpen = false">
                      Batal
                    </UButton>
                    <UButton color="primary" @click="handleSelectDate(); formatterBirthDatePlace();">
                      Pilih
                    </UButton>
                  </div>
                </div>
              </template>
            </UModal>
          </div>
        </template>
      </UCard>
      
      <UFormField name="tempatPenugasan" label="Tempat Penugasan">
        <UInput v-model="formState.tempatPenugasan" size="xl" />
      </UFormField>

      <UButton
        :disabled="status === 'pending'"
        :block="true"
        color="primary"
        size="xl"
        class="text-center"
        type="submit"
      >
        Submit
      </UButton>
    </UForm>
  </section>
</template>
<script setup lang="ts">
import * as z from 'zod'
import { insertUser } from '~~/utils/apiRepo/user'
import type { FormErrorEvent } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'

const toast = useToast()

// date-related const
const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long' });
const calendarValue = shallowRef(new CalendarDate(2022, 1, 10))
const defaultDate = new CalendarDate(2024, 10, 3)


const birthPlace = ref('')
const requiredMessage = 'harus diisi'
const birthErrorMsg = ref<string>('')
const calendarOpen = ref(false)

const formState = reactive<InsertUserPayload>({
  fullname: undefined,
  email: undefined,
  phoneNumber: undefined,
  address: undefined,
  birthPlaceDate: undefined,
  tempatPenugasan: undefined
})

const schema = z.object({
  fullname: z.string(`Nama Lengkap ${requiredMessage}`),
  email: z.email('Email tidak valid'),
  phoneNumber: z.string(`Nomor Telepon ${requiredMessage}`),
  address: z.string(`Alamat ${requiredMessage}`),
  birthPlaceDate: z.string(`Tempat Tanggal Lahir ${requiredMessage}`),
  tempatPenugasan: z.string(`Tempat Penugasan ${requiredMessage}`)
})

const { data, status, execute, error } = insertUser(formState)

function handleSelectDate () {
  calendarOpen.value = false
  console.log({calendarValue});
  
}

function formatterBirthDatePlace () {
  if (!birthPlace.value || !calendarValue.value) {
    formState.birthPlaceDate = ''
    return  
  }
  const capitalized = birthPlace.value.charAt(0).toUpperCase() + birthPlace.value.slice(1);
  formState.birthPlaceDate = capitalized + ', ' + formattedDate.value
}

const formattedDate = computed(() => {
  const day = calendarValue.value.day;
  // Subtract 1 from the month to convert from 1-indexed (1-12) to 0-indexed (0-11)
  const zeroIndexedMonth = calendarValue.value.month - 1;
  const year = calendarValue.value.year;

  console.log(day);
  console.log(calendarValue.value.month); // The original 1-indexed value
  console.log(year);

  // This is the problematic part. The month formatter often expects a Date object.
  // A common fix is to create a temporary Date object *just* for the month formatting:

  // Create a Date object set to the *first* day of the desired month/year.
  // We use 0 for the month to get January, so we use zeroIndexedMonth.
  const dateForFormatting = new Date(year, zeroIndexedMonth, day); 

  const formattedMonth = formatter.format(dateForFormatting);
  return day + ' ' + formattedMonth + ' ' + year;
})  

async function handleFormSubmit () {
  await execute()
  console.log({data}); 
  if (status.value === 'success') {
    toast.add({
      title: 'Berhasil menambahkan user',
      description: 'User berhasil ditambahkan',
      icon: 'i-lucide-circle-check',
    })
    await useRouter().push('/users')
  } else if (status.value === 'error') {
    if (error.value?.statusCode === 400) {
      toast.add({
        title: 'Gagal menambahkan user',
        description: 'Periksa kembali formulir anda',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
    } else if (error.value?.statusCode === 401) {
      toast.add({
        title: 'Gagal menambahkan user',
        description: 'Anda tidak mempunyai akses untuk menambahkan user',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })  
    } else if (error.value?.statusCode === 500) {
      toast.add({
        title: 'Gagal menambahkan user',
        description: 'Data user sudah ada atau terjadi kesalahan',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
    }
  }
}

function onError (event: FormErrorEvent) {
  console.log({event});
  
  const hasBirthError = event.errors.find((error) => error.name === 'birthPlaceDate') 
  
  if (hasBirthError) birthErrorMsg.value = hasBirthError.message
  else birthErrorMsg.value = ''
}

</script>