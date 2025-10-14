
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware(async (to, from) => {
  const toast = useToast()

  if (to.path !== '/login') {
    const token = useCookie('dpp._token')
    const refresh = useCookie('dpp._token_refresh')
    if (!token.value && !refresh.value) {
      console.log('Not authenticated, redirect to login');
      toast.add({
        title: 'Tidak Punya Akses',
        description: 'Silahkan login terlebih dahulu',
      })
      return navigateTo('/login')
    }
  }
})