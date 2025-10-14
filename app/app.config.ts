export default defineAppConfig({
  toaster: {
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