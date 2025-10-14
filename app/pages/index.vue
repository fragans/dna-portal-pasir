<template>
  <UMain>
    <section class="flex flex-col items-center justify-center min-h-screen text-center">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 max-w-lg w-full">
        <NuxtLink to="/form">
          <UCard>
            <UIcon name="i-lucide-file-pen-line" class="mx-auto mb-2" size="48" />
          </UCard>
        </NuxtLink>
        <NuxtLink to="/form">
          <UCard>
            <UIcon name="i-lucide-file-plus" class="mx-auto mb-2" size="48" />
          </UCard>
        </NuxtLink>
        <NuxtLink to="/form">
          <UCard>
            <UIcon name="i-lucide-file-chart-line" class="mx-auto mb-2" size="48" />
          </UCard>
        </NuxtLink>
        <NuxtLink to="/form">
          <UCard>
            <UIcon name="i-lucide-file-play" class="mx-auto mb-2" size="48" />
          </UCard>
        </NuxtLink>
      </div>

    </section>
  </UMain>
</template>