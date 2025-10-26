<template>
  <div>
    <section class="max-w-3xl mx-auto my-8">
      <UTable :data="reportsData.data" :columns="columns"  class="flex-1" />
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
const { data:reports, status, execute} = await getReports()
await execute()

const reportsData = computed(() => {
  if (status.value === 'success' || reports.value) {
    return JSON.parse(reports.value!)
  }
  return undefined
})
const isError = computed<boolean>(() => status.value === 'error')

const columns: TableColumn<GetReport>[] = [
  {
    accessorKey: 'formID',
    header: '#',
    cell: ({ row }) => `#${row.getValue('formID')}`
  },
  {
    accessorKey: 'createdDate',
    header: 'Date',
    cell: ({ row }) => {
      return `${row.getValue('createdDate')}`
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'createdBy'
  },
  {
    accessorKey: 'loadAmount',
    header: 'Amount',
    cell: ({ row }) => {
      return `${row.getValue('loadAmount')} Ton`
    }
  }
]
</script>