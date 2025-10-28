
// import { useNuxtApp } from "#app"
interface LoginForm {
  email?: string;
  password?: string;
}
export function loginUser(payload: LoginForm) {
  // https://dummyjson.com/docs/auth
  const host = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main'
  const route = '/login'
  const url = `${host}${route}`
  const fetchKey = computed(() => `login-${new Date().getTime()}`)
  return useAsyncData(fetchKey, async () => {
  const res = await $fetch<LoginResponse>(url, {
      method: 'POST',
      body: {
        email: payload.email,
        password: payload.password,
      },
      responseType: 'json'
    })
    return res
  },
  { 
    immediate: false
  })
}


export function getProfileById(id:string) {
  const host = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main'
  const route = `detail-profile?masterUserID=${id}`
  const url = `${host}/${route}`
  return useAsyncData('user-profile', async () => {
    const res = await $fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${useCookie('dpp._token').value}`
      },
      responseType: 'json'
    })
    return res
  },
  { 
    immediate: false
  })

}
