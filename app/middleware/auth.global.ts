
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware(async (to, from) => {
  const toast = useToast()

  if (to.path !== '/login') {
    const token = useCookie('dpp._token')
    const user = useCookie('dpp._user')
    console.log({token, user});
    
    if (!token.value && !user.value) {
      console.log('Not authenticated, redirect to login');
      toast.add({
        title: 'Tidak Punya Akses',
        description: 'Silahkan login terlebih dahulu',
      })
      return navigateTo('/login')
    }
  }
})