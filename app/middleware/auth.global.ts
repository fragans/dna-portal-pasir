
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware(async (to, from) => {
  const toast = useToast()
  // console.log('middleware to', to.fullPath);
  
  if (to.path !== '/login') {
    // console.log('guarded route');
    
    const token = useCookie<string|null>('dpp._token')
    const user = useCookie<UserData|null>('dpp._user')
    // console.log(token.value?.length, user.value?.fullname);
    
    if (!token.value && !user.value) {
      toast.add({
        title: 'Tidak Punya Akses',
        description: 'Silahkan login terlebih dahulu',
      })
      return navigateTo('/login')
    }
  }

  return
})