export const useUserStore = defineStore('user', () => {
  const userCookie = useCookie<Partial<LoginResponse>>('dpp._user')
  const tokenCookie = useCookie<string>('dpp._token')
  const userProfile = ref<UserProfile>()
  function setUserCookie(user: Partial<LoginResponse>) {
    const storedData: Partial<LoginResponse> = {
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      image: user.image || '',
    }
    userCookie.value = storedData
  }
  const getFirstName = computed(() => {
    return userCookie.value?.firstName || ''
  })
  const getLastName = computed(() => {
    return userCookie.value?.lastName || ''
  })
  const getUserAvatar = computed(() => {
    return userCookie.value?.image || ''
    // return 'https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png'
  })
  const getUsername = computed(() => {
    return userCookie.value?.username || ''
  })

  const isLogin = computed<boolean>(() => {
    return !!userCookie.value
  })
  const getToken = computed(() => {
    return tokenCookie.value || ''
  })

  function logoutUser() {
    useCookie('dpp._token').value = null
    useCookie('dpp._token_refresh').value = null
    useCookie('dpp._user').value = null
  }

  function setUserProfile(user: Partial<UserProfile>) {
    userProfile.value = user as UserProfile
  }

  return {
    setUserCookie,
    setUserProfile,
    logoutUser,
    getUsername,
    getFirstName,
    getLastName,
    getUserAvatar,
    isLogin,
    getToken,
    userProfile
  }
})
