export default defineAppConfig({
  toaster: {
    position: 'top-center' as const,
    expand: true,
    duration: 5000
  },
  ui: {
    input: {
      slots: {
        root: 'relative inline-flex items-center w-full',
      }
    }
  }
})