
// import { useNuxtApp } from "#app"
interface LoginForm {
  email?: string;
  password?: string;
}
export function loginUser(payload: LoginForm) {
  // https://dummyjson.com/docs/auth
  const loginUrl = 'https://dummyjson.com/auth/login'
  const fetchKey = computed(() => `login-${new Date().getTime()}`)
  return useAsyncData(fetchKey, async () => {
  const res = await $fetch<LoginResponse>(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: payload.email,
        password: payload.password,
        expiresInMins: 60
      }
    })
    return res
  },
  { 
    immediate: false
  })
}


export function getProfile(token:string) {
  const profileUrl = 'https://dummyjson.com/auth/me'
  return useAsyncData('user-profile', async () => {
    const res = await $fetch(profileUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return res
  },
  { 
    immediate: false
  })

}