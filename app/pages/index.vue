<template>
  <UMain>
    <section class="flex flex-col items-center justify-center min-h-screen text-center">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-lg w-full">
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

    </section>
  </UMain>
</template>