<template>
  <section class="max-w-3xl mx-auto my-8">
    <UForm :state="formState" :schema="schema" class="flex flex-col gap-4 w-full" @submit="handleFormSubmit">
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
      <UCard variant="outline">
        <template #header>
          <span>Tempat Tanggal Lahir</span>
          <span class="text-xs text-gray-500 float-right">{{ formState.birthDatePlace }}</span>
          <UFormField name="birthDatePlace" class="hidden">
            <UInput v-model="formState.birthDatePlace" size="xl" type="text"/>
          </UFormField>
        </template>
        <template #default>
          <div class="flex flex-col gap-4">
            <UFormField name="birthPlace" label="Provinsi">
              <UInput v-model="birthPlace" size="xl" type="text" @change="formatterBirthDatePlace()"/>
            </UFormField>
            <UModal
              v-model:open="calendarOpen"
              :dismissible="false"
              title="Tanggal Pertama Kirim Koran"
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
                    <UButton color="primary" @click="handleSelectDate">
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DateValue } from '@internationalized/date'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createCalendar, getLocalTimeZone, toCalendar, today, CalendarDate } from '@internationalized/date'



// date-formatter
const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long' });
const birthPlace = ref('')
const calendarValue = shallowRef(new CalendarDate(2022, 1, 10))
const defaultDate = new CalendarDate(2024, 10, 3)
const requiredMessage = 'harus diisi'

const calendarOpen = ref(false)
const formState = reactive<InsertUserPayload>({
  fullname: undefined,
  email: undefined,
  phoneNumber: undefined,
  address: undefined,
  birthDatePlace: undefined,
  tempatPenugasan: undefined
})

const schema = z.object({
  fullname: z.string(`Nama ${requiredMessage}`),
  email: z.email('Email tidak valid'),
  phoneNumber: z.string(`Nomor Telepon ${requiredMessage}`),
  address: z.string(`Alamat ${requiredMessage}`),
  birthPlaceDate: z.string(`Tempat Tanggal Lahir ${requiredMessage}`),
  tempatPenugasan: z.string(`Tempat Penugasan ${requiredMessage}`)
})

const { data, status, execute } = insertUser(formState)

function handleSelectDate () {
  calendarOpen.value = false
}

function formatterBirthDatePlace () {
  if (!birthPlace.value || !formattedDate.value) return ''
  const capitalized = birthPlace.value.charAt(0).toUpperCase() + birthPlace.value.slice(1);
  formState.birthDatePlace = capitalized + ', ' + formattedDate.value
}

const formattedDate = computed(() => {
  return  calendarValue.value.day + ' ' + formatter.format(calendarValue.value.month) + ' ' + calendarValue.value.year
})  

async function handleFormSubmit () {
  await execute()
  console.log({data});
  
}

</script>