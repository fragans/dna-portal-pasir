
// import { useNuxtApp } from "#app"
interface LoginForm {
  email?: string;
  password?: string;
}
export function loginUser(payload: LoginForm) {
  // https://dummyjson.com/docs/auth
  const { VITE_API_HOST } = useRuntimeConfig().public
  const host = VITE_API_HOST
  const route = 'login'
  const url = `${host}/${route}`
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



