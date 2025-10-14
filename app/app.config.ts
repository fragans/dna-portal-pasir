export default defineAppConfig({
  toaster: {
    position: 'top-center' as const,
    expand: true,
    duration: 5000
  },
  ui: {
    colorMode: 'dark' as const,
    input: {
      slots: {
        root: 'w-full',
      }
    }
  }
})