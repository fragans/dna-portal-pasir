export const useUserStore = defineStore('user', () => {
  const userCookie = useCookie<UserData|null>('dpp._user')
  const tokenCookie = useCookie<string|null>('dpp._token')
  // const userProfile = ref<UserData>()
  
  function setUserCookie(user: UserData) {
    userCookie.value = user
  }
  function setTokenCookie(token: string) {
    tokenCookie.value = token
  }
  const getFirstName = computed(() => {
    return userCookie.value?.fullname || ''
  })
  const getLastName = computed(() => {
    return userCookie.value?.fullname || ''
  })
  const getUserAvatar = computed(() => {
    return `https://placehold.co/600x400/orange/white?text=${getInitialName.value}`
  })

  function generateUserAvatar (fullname: string| undefined) {
    if (!fullname) return `https://placehold.co/600x400/orange/white?text=A`
    const initial = generateInitial(fullname)
    return `https://placehold.co/600x400/orange/white?text=${initial}`
  }

  const getInitialName = computed(() => {
    const fullname = userCookie.value?.fullname || 'User'
    const initial = generateInitial(fullname)
    return initial 
  })
  function generateInitial (fullname:string) {
    const names = fullname.split(' ')
    if (names.length === 0) return 'U'
    let initials = ''
    names.forEach(word => {
      initials = initials + word.charAt(0).toUpperCase()
    });
    return initials
  }

  const getUsername = computed(() => {
    return userCookie.value?.masterUserID || ''
  })

  const getUserProfile = computed<UserData | null>(() => {
    return userCookie.value || null
  })

  const isLogin = computed<boolean>(() => {
    return !!tokenCookie.value
  })
  const getToken = computed(() => {
    return tokenCookie.value || ''
  })

  const getDisplayRole = computed(() => {
    if (!getUserProfile.value) return ''
    if (getUserProfile.value?.role === 'user')  return ''
    return getUserProfile.value?.role === 'admin' ? 'Administrator' : ''
  })

  function logoutUser() {
    tokenCookie.value = null
    userCookie.value = null
  }

  

  return {
    generateUserAvatar,
    setTokenCookie,
    setUserCookie,
    logoutUser,
    getUserProfile,
    getDisplayRole,
    getUsername,
    getFirstName,
    getLastName,
    getUserAvatar,
    isLogin,
    getToken
  }
})
