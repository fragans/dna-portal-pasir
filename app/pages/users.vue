<template>
  <section class="max-w-3xl mx-auto my-8">
    <template v-if="status=== 'success' && userList">
      <UTable :data="userList.data" :columns="columns" />
    </template>
    <UModal
      v-model:open="openModalProfile"
      :dismissible="true"
      :title="selectedProfile?.fullname"
      :description="selectedProfile?.masterUserID"
    >
      <template #body>
        <UBlogPost
          :image="generateUserAvatar(selectedProfile?.fullname)"
        >
          <template #body>
            <div class="grid grid-cols-12 grid-rows-4 gap-2 items-center">
              <UIcon name="i-lucide-phone" class="col-span-1" /> <p class="col-span-11"> {{ selectedProfile?.phoneNumber }} </p>

              <UIcon name="i-lucide-home" class="col-span-1" /> <p class="col-span-11"> {{ selectedProfile?.address }} </p>

              <UIcon name="i-lucide-calendar" class="col-span-1" /> <p class="col-span-11"> {{ selectedProfile?.birthPlaceDate }} </p>
              
              <UIcon name="i-lucide-network" class="col-span-1" /> <p class="col-span-11"> {{ selectedProfile?.assignmentPlace }} </p>
              
            </div>
          </template>
        </UBlogPost>
      </template>
    </UModal>
  </section>
</template>
<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { getUserList } from '~~/utils/apiRepo/user'
import { useUserStore } from '~/stores/user'

const { generateUserAvatar } = useUserStore()
const { data: userList, status, execute } = getUserList()
const UButton = resolveComponent('UButton')

const openModalProfile = ref(false)
const selectedProfile = ref<UserData | null>(null)
await execute()

const columns: TableColumn<UserData>[] = [
  {
    accessorKey: 'fullname',
    header: 'Name',
    cell: ({ row }) => `${row.getValue('fullname')}`
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => `${row.getValue('role')}`
  },
  {
    accessorKey: '',
    header: 'View',
    cell: ({ cell }) => 
      h(UButton, {
        variant: 'ghost',
        icon: 'i-lucide-file-search-2',
        square: true,
        onClick: () => { 
          console.log('click');
          openModalProfile.value = true
          selectedProfile.value = cell.row.original
        }
      })
  }
  // {
  //   accessorKey: 'phoneNumber',
  //   header: 'Phone Number',
  //   cell: ({ row }) => `${row.getValue('phoneNumber')}`
  // },
  
]
</script>