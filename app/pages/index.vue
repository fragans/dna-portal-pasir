<template>
  <UMain>
    <section class="flex flex-col items-center justify-center min-h-screen text-center">
      
      
      <UCard class="w-full">
        <template #header>
          <h4>User</h4>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
          <NuxtLink to="/form">
            <UCard variant="solid">
              <div class="flex flex-col gap-3 justify-center">
                <UIcon name="i-lucide-file-plus" class="mx-auto mb-2" size="48" />
                <span class="font-bold">Input Baru</span>
                <span class="text-xs">(user)</span>
              </div>
            </UCard>
          </NuxtLink>
          <NuxtLink to="/document">
            <UCard variant="solid">
              <div class="flex flex-col gap-3 justify-center">
                <UIcon name="i-lucide-file-chart-line" class="mx-auto mb-2" size="48" />
                <span class="font-bold">Lihat Entries</span>
                <span class="text-xs">(user & admin)</span>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </UCard>

      <UCard class="w-full">
        <template #header>
          <h4>Admin</h4>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
          <NuxtLink to="/users">
            <UCard variant="solid">
              <div class="flex flex-col gap-3 justify-center">
                <UIcon name="i-lucide-file-plus" class="mx-auto mb-2" size="48" />
                <span class="font-bold">Manage User</span>
                <span class="text-xs">(user)</span>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </UCard>

    </section>
  </UMain>
</template>