<template>
  <div>
    <section class="py-4">
      <UCard variant="subtle">
        <div class=" ">
          <UAccordion
            v-model="accordionExpanded"
            trailing-icon="i-lucide-refresh-ccw"
            :items="[{ label: 'Filter Tanggal' , icon: 'i-lucide-calendar-days' }]"
          >
            <template #content>
              <UCalendar v-model="calendarValue" :default-value="defaultDate" class="p-2"/>
            </template>
          </UAccordion>
        </div>
      </UCard>
    </section>
    <section class="">
      <div class="flex justify-end">
        <strong>{{ selectedFormattedDate }}</strong>
      </div>
      
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

    <!-- <UModal :open="isError" title="Gagal memuat data">
      <template #footer>
        error
      </template>
    </UModal> -->
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { useUserStore } from '~/stores/user'
import { getUserReportsByDate } from '~~/utils/apiRepo/report'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'

const userStore = useUserStore()
const { getUsername } = storeToRefs(userStore)




const todayDate = today(getLocalTimeZone())
const defaultDate = new CalendarDate(todayDate.year, todayDate.month, todayDate.day,)
const calendarValue = shallowRef(defaultDate)
const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long' })

const UButton = resolveComponent('UButton')
const accordionExpanded = ref()

const selectedFormattedDate = computed(() => {
  const dd = calendarValue.value
  const jsDate = dd.toDate(getLocalTimeZone())
  const monthName = formatter.format(jsDate)

  return `${dd.day} ${monthName} ${dd.year}`
})

const formattedDatePayload = computed(() => {
  const dd = calendarValue.value
  return `${dd.year}-${dd.month}-${dd.day}`
})


const { data:reportsData, status } = getUserReportsByDate(getUsername, formattedDatePayload)
const { getPresignedUrl } = useS3Upload()




// const isError = computed<boolean>(() => status.value === 'error')

const columns: TableColumn<GetReport>[] = [
  // {
  //   accessorKey: 'formID',
  //   header: '#',
  //   cell: ({ row }) => `#${row.getValue('formID')}`
  // },
  {
    accessorKey: 'createdDate',
    header: 'Tgl. Laporan',
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
    header: 'Muatan',
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

async function generateImageUrl (url:string) {
  const imageUrl = await getPresignedUrl(url)
  window.open(imageUrl, '_blank')
}

definePageMeta({
  title: 'Dokumen Anda'
})
</script>
