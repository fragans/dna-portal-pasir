<template>
  <div>
    <section class="max-w-3xl mx-auto my-8">
      <UTable :data="reportsData.data" :columns="columns"  class="flex-1">
        <template #expanded="{ row }">
          <div class="flex gap-2 justify-center">
            <div
              v-for="(item, key) in row.original.documents"
              :key="key"
            >
              
              <UButton
                size="xl"
                class="max-w-md"
                @click="generateImageUrl(item.link)"
              >
               <span>{{ key + 1 }}.</span>
                <span class="line-clamp-1 text-xs">
                  {{ item.link }}
                </span>
                <UIcon name="i-lucide-square-arrow-out-up-right" class="size-8"/>
              </UButton>
            </div>
          </div>
        </template>
      </UTable>
    </section>

    <UModal :open="isError" title="Gagal memuat data">
      <template #footer>
        error
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { getReports } from '~~/utils/apiRepo/report'
const { data:reportsData, status, execute} = await getReports()
const { getPresignedUrl } = useS3Upload()
await execute()

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

async function generateImageUrl (url:string) {
  const imageUrl = await getPresignedUrl(url)
  window.open(imageUrl, '_blank')
}
</script>