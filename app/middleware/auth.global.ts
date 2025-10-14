
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware(async (to, from) => {
  const toast = useToast() // make sure to call the composable at the top level
  if (to.path !== '/login') {
    const token = useCookie('dpp._token')
    if (!token.value) {
      console.log('Not authenticated, redirect to login');
      toast.add({
        title: 'Tidak Punya Akses',
        description: 'Silahkan login terlebih dahulu',
      })
      return navigateTo('/login')
    }
  }
})