<template>
  <div>
    <section class="mt-3">
      <div class="flex justify-between">
        <div>
          <UButton
            color="primary"
            icon="i-lucide-filter"
            @click="openModalFilter = true"
          />
        </div>
        <div class="flex gap-3">
          <UButton color="neutral" icon="i-lucide-user"> 
            <UIcon name="i-lucide-x" />
          </UButton>
          <UButton color="neutral" icon="i-lucide-calendar"> 
            <UIcon name="i-lucide-x" />
          </UButton>
        </div>
      </div>
    </section>
    <section class="max-w-3xl mx-auto my-3">
      <template v-if="status==='success' && reportsData">
        <UTable :data="reportsData.data" :columns="columns"  class="flex-1">
          <template #expanded="{ row }">
            <div class="flex gap-2 flex-col justify-center">
              <div
                v-for="(item, key) in row.original.documents"
                :key="key"
              >
                
                <UButton
                  size="xl"
                  class="max-w-md"
                  variant="subtle"
                  @click="generateImageUrl(item.link)"
                >
                 <span>{{ key + 1 }}.</span>
                  <span class="line-clamp-1 text-xs">
                    {{ item.link }}
                  </span>
                  <UIcon name="i-lucide-square-arrow-out-up-right" class="size-4"/>
                </UButton>
              </div>
            </div>
          </template>
        </UTable>
      </template>
    </section>

    <UModal :open="isError" title="Gagal memuat data">
      <template #footer>
        error
      </template>
    </UModal>
    <UModal v-model:open="openModalFilter">
      <template #header>
        <p class="text-center w-full">
          Filter Data  
        </p>
      </template>
      <template #body>
        <div>
          <div>
            pilih user
            <USelectMenu
              v-model="selectedUser"
              class="w-48"
              :items="users?.data"
              placeholder="Pilih user"
              :loading="usersFetchStatus === 'pending'"
              @focus="handlerFocus()"
              
            />
          </div>
          <hr class="text-gray-200">
          <div>
            pilih tanggal
            <UCalendar v-model="calendarValue" :default-value="defaultDate" class="p-2"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="grid grid-cols-2 w-full gap-4">
          <UButton block variant="outline" icon="i-lucide-filter-x" @click="openModalFilter = false">Hapus Filter</UButton>
          <UButton block  @click="openModalFilter = false">Terapkan</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { getReports } from '~~/utils/apiRepo/report'
import { getUserList } from '~~/utils/apiRepo/user'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'

const { data:reportsData, status, execute} = await getReports()
const { getPresignedUrl } = useS3Upload()
await execute()

const { data:users, status:usersFetchStatus, execute:executeFetchUsers } = await getUserList()

const todayDate = today(getLocalTimeZone())
const defaultDate = new CalendarDate(todayDate.year, todayDate.month, todayDate.day,)
const calendarValue = shallowRef(defaultDate)

const selectedUser = ref<UserData>()


const openModalFilter = ref(false)
const UButton = resolveComponent('UButton')

const isError = computed<boolean>(() => status.value === 'error')

const columns: TableColumn<GetReport>[] = [
  // {
  //   accessorKey: 'formID',
  //   header: '#',
  //   cell: ({ row }) => `#${row.getValue('formID')}`
  // },
  {
    accessorKey: 'createdDate',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('createdDate'))
      .toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'driverName',
    header: 'Supir'
  },
  {
    accessorKey: 'loadAmount',
    header: 'Amount',
    cell: ({ row }) => {
      return `${row.getValue('loadAmount')} Ton`
    }
  },
  {
    accessorKey: '',
    header: 'View',
    cell: ({ row }) => 
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        onClick: () => row.toggleExpanded()
      })
  },
]

async function handlerFocus() {
  if (!users.value) {
    await executeFetchUsers()
  }
}

async function generateImageUrl (url:string) {
  const imageUrl = await getPresignedUrl(url)
  window.open(imageUrl, '_blank')
}

definePageMeta({
  title: 'Dokumen'
})
</script> 