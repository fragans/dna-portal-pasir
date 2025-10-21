export const useUserStore = defineStore('user', () => {
  const userCookie = useCookie<UserData>('dpp._user')
  const tokenCookie = useCookie<string>('dpp._token')
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

  const getInitialName = computed(() => {
    const fullname = userCookie.value?.fullname || 'User'
    const names = fullname.split(' ')
    if (names.length === 0) return 'U'
    let initials = ''
    names.forEach(word => {
      initials = initials + word.charAt(0).toUpperCase()
    });
    return initials
  })

  const getUsername = computed(() => {
    return userCookie.value?.masterUserID || ''
  })

  const getUserProfile = computed<UserData | null>(() => {
    return userCookie.value || null
  })

  const isLogin = computed<boolean>(() => {
    return !!userCookie.value
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
    useCookie('dpp._token').value = null
    useCookie('dpp._user').value = null
  }

  

  return {
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
