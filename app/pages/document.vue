<template>
  <div>
    <section class="mt-3" :class="[showCheckbox ? 'sticky top-16 z-10 py-3' : '']">
      <UCard>
        <div class="flex justify-between">
          <div class="flex gap-2">
            <UButton
              :icon="showCheckbox ? 'i-lucide-x' : 'i-lucide-download'"
              :variant="showCheckbox ? 'subtle' : 'solid'"
              @click="showCheckbox = !showCheckbox"
            />
            <template v-if="showCheckbox">
              <UButton
                icon="i-lucide-download"
                :disabled="selectedReports.length === 0"
                :variant="selectedReports.length === 0 ? 'subtle' : 'solid'"
                @click="openModalDownload = true"
              >
              Unduh ({{ selectedReports.length }})
              </UButton>
            </template>
              
          </div>
          <div v-if="!showCheckbox" class="text-gray-400 text-xs text-center">
            <p v-if="!filterEnabled && reportsData?.data?.length">Menampilkan semua data ({{ reportsData?.data?.length }})</p>
            <p v-if="selectedUser">{{ selectedUser?.label }} ({{ selectedUser?.value }})</p>
            <p v-if="filterDateEnabled">{{ selectedFormattedDate }}</p>
          </div>
          <div v-if="!showCheckbox">
            <UButton
              color="primary"
              :variant=" filterEnabled ? 'subtle' : 'solid'"
              icon="i-lucide-filter"
              @click="openModalFilter = true"
            >
              <span v-if="filterEnabled">•</span>
              <UIcon v-if="filterDateEnabled" name="i-lucide-calendar" />
              <UIcon v-if="filterUserEnabled" name="i-lucide-user" />
            </UButton>
          </div>
        </div>
      </UCard>
    </section>
    <section class="max-w-3xl mx-auto my-3">
      <template v-if="status==='success' && reportsData">
        <UTable
          :key="showCheckbox ? 'with-checkbox' : 'no-checkbox'"
          v-model:row-selection="rowSelection"
          :data="reportsData.data"
          :columns="columns"
          class="flex-1"
        >
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
              <div v-if="row.original.documents.length === 0" class="text-gray-300 text-center">
                Tidak ada dokumen
              </div>
            </div>
          </template>
          <template #empty>
            <div class="text-center">
              <p>
                Data tidak ditemukan
              </p>
              <p v-if="filterDateEnabled">
                pada tanggal {{ selectedFormattedDate }}
              </p>
              <p v-if="selectedUser">
                pada user {{ selectedUser?.label }} ({{ selectedUser?.value }})
              </p>
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
    <UModal v-model:open="openModalFilter" title="Ubah Filter Data" :description="filterEnabled ? 'Filter aktif' : 'Filter tidak aktif'">

      <template #body>
        <div class="flex gap-4 flex-col">
          <div>
            <p class="text-sm pb-2 flex items-center gap-2">
              <UIcon :name="selectedUser ? 'i-lucide-square-check' : 'i-lucide-square-x'" class="size-5" :class="selectedUser ? 'text-green-500' : 'text-gray-300'"/>
              Filter User 
            </p>
            <USelectMenu
              v-model="selectedUser"
              class="w-full"
              size="xl"
              :items="reformattedUsers"
              placeholder="Semua user"
              :loading="usersFetchStatus === 'pending'"
              @focus="handlerFocus()"
            >
              <template #item-label="{ item }">
                <template v-if="item">
                  {{ item.label }}
  
                  <span class="text-muted text-xs">
                    {{ item.place }}
                  </span>
                </template>
              </template>
            </USelectMenu>
          </div>
          <hr class="text-gray-600">
          <div>
            <UCheckbox
              v-model="filterDateEnabled"
              :label="`Filter Tanggal ${filterDateEnabled ? `: ${selectedFormattedDate}` : ''}`"
            />
            <UCalendar v-model="calendarValue" :default-value="defaultDate" class="p-2"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="grid grid-cols-2 w-full gap-4">
          <UButton block variant="outline" icon="i-lucide-filter-x" @click="openModalFilter = false; filterDateEnabled = false; selectedUser = undefined">Hapus Filter</UButton>
          <UButton block  @click="openModalFilter = false;">Terapkan</UButton>
        </div>
      </template>
    </UModal>
    <UModal
      v-model:open="openModalDownload"
      title="Unduh Laporan Dokumen"
      :description="`Unduh ${selectedReports.length} laporan dokumen yang dipilih`"
    >
      <template #body>
        <div class="grid grid-cols-2 auto-rows-auto">
          <div v-for="(report,index) in selectedReports" :key="report.formID" >
            <span>{{index+1}}. {{ report.driverName }} ({{ dateFormatter(report.createdDate) }})</span>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="grid grid-cols-2 w-full gap-4">
          <UButton block variant="outline" icon="i-lucide-x" @click="openModalDownload = false">Batal</UButton>
          <UButton block color="primary" icon="i-lucide-download" :disabled="selectedReports.length === 0" @click="handleDownload()">Unduh</UButton>
        </div>
      </template>
    </UModal>
    <ModalPreviewReport
      v-model="showPreviewModal"
      :report="previewedReport"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { getUserReportsForAdmin } from '~~/utils/apiRepo/report'
import { getProfileById, getUserList } from '~~/utils/apiRepo/user'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import { downloadReportsAsCSV } from '~~/utils/reportDownload'
const { data:users, status:usersFetchStatus, execute:executeFetchUsers } = await getUserList()

interface RowSelection {
  [rowId: string]: boolean
}

const openModalFilter = ref(false)
const openModalDownload = ref(false)
const showCheckbox = ref(false)
const rowSelection = ref<RowSelection>({})
const userNameList = ref<UserData[]>()

const selectedReports = computed<GetReport[]>(() => {
  if (!reportsData.value) return []
  return reportsData.value.data.filter((_, index) => rowSelection.value[index])
}
)

function handleDownload() {
  downloadReportsAsCSV(selectedReports.value)
  openModalDownload.value = false;
}

// Date Related
const showPreviewModal = ref(false)
const previewedReport = ref<GetReport | null>(null)
const filterDateEnabled = ref(false)
const todayDate = today(getLocalTimeZone())
const defaultDate = new CalendarDate(todayDate.year, todayDate.month, todayDate.day,)
const calendarValue = shallowRef(defaultDate)
const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long' })
const filterEnabled = computed (() => {
  return filterDateEnabled.value || filterUserEnabled.value
})
const formattedDatePayload = computed(() => {
  if (!filterDateEnabled.value) return ''
  const dd = calendarValue.value
  return `${dd.year}-${dd.month}-${dd.day}`
})
const selectedFormattedDate = computed(() => {
  const dd = calendarValue.value
  const jsDate = dd.toDate(getLocalTimeZone())
  const monthName = formatter.format(jsDate)

  return `${dd.day} ${monthName} ${dd.year}`
})

const selectedUser = ref<UserSelectMenuItem>()
const filterUserEnabled = computed(() => {
  return !!selectedUser.value
})

function dateFormatter (dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')

const { data:reportsData, status } = await getUserReportsForAdmin(selectedUser, formattedDatePayload)
const { getPresignedUrl } = useS3Upload()


const getAllReporterId  = computed(() => {
  if (!reportsData.value?.data.length) return []
  // get unique ids
  const ids = reportsData.value.data.map(report => report.masterUserID)
  return Array.from(new Set(ids))
})

watch(getAllReporterId, (newVal) => {
  if (newVal.length) {
    newVal.forEach(async (id) => {
      const { data } = await getProfileById(id) // to clear cache
      if (data.value) userNameList.value?.push(data.value.data)
    })
  }
})

const isError = computed<boolean>(() => status.value === 'error')

const columns = computed<TableColumn<GetReport>[]>(() => {
  const cols: TableColumn<GetReport>[] = []

  // ✅ conditional checkbox column
  if (showCheckbox.value) {
    console.log('changed');
    
    cols.push({
      id: 'select',
      header: ({ table }) =>
        h(UCheckbox, {
          modelValue: table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Select all'
        }),
      cell: ({ row }) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            row.toggleSelected(!!value),
          'aria-label': 'Select row'
        }),
        
    })
  }

  // ✅ your existing columns
  cols.push(
    {
      accessorKey: 'createdDate',
      header: 'Date',
      cell: ({ row }) => {
        return dateFormatter(row.getValue('createdDate'))
      }
    },
    {
      accessorKey: '',
      header: 'Created By',
      cell: ({ row }): MaybeRef<string> => {
        const userId = row.original.masterUserID
        if (filterUserEnabled.value && selectedUser.value) {
          return selectedUser.value.label
        }
        return unref(userId)
      }
    },
    {
      accessorKey: 'loadAmount',
      header: 'Muatan',
      cell: ({ row }) => `${row.getValue('loadAmount')} Ton`
    },
    {
      accessorKey: '',
      header: 'View',
      cell: ({ row }) => {
        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          icon: 'i-lucide-search',
          square: true,
          'aria-label': 'Expand',
          onClick: () => {
            showPreviewModal.value = true
            previewedReport.value = row.original
          }
        })
      }
        
    }
  )

  return cols
})


async function handlerFocus() {
  if (!users.value) {
    await executeFetchUsers()
  }
}

async function generateImageUrl (url:string) {
  const imageUrl = await getPresignedUrl(url)
  window.open(imageUrl, '_blank')
}

const reformattedUsers = computed<UserSelectMenuItem[]>(() => {
  if (!users.value) return [] as UserSelectMenuItem[]
  return users.value?.data.map((user) => {
    return {
      label: `${user.fullname}`,
      place: user.assignmentPlace,
      value: String(user.masterUserID)
    }
  })

})
definePageMeta({
  title: 'Dokumen'
})
</script>
