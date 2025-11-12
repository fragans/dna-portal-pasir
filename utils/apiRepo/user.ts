import type { FetchResponse } from 'ofetch'
export function getProfileById(id: string) {
  const host = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main'
  const route = `detail-profile?masterUserID=${id}`
  const url = `${host}/${route}`
  return useAsyncData('user-profile', async () => {
    const res = await $fetch<ResponseProfile>(url, {
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
    }
  )

}

export function getUserList() {
  const host = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main'
  const route = `list-user`
  const url = `${host}/${route}`
  return useAsyncData('user-list', async () => {
    const res = await $fetch<ResponseUserList>(url, {
      headers: {
        'Authorization': `Bearer ${useCookie('dpp._token').value}`
      },
      responseType: 'json',
      onResponseError: ({response}) => {
        handleError(response)
      }
    })
    return res
  },
    { immediate: false }
  )
}

export function insertUser(payload: InsertUserPayload) {
  const host = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main'
  const route = 'add-user'
  const url = `${host}/${route}`
  return useAsyncData('insert-user', async () => {
    const res = await $fetch<ResponseInsertUser>(url, {
      method: 'POST',
      body: payload,
      headers: {
        'Authorization': `Bearer ${useCookie('dpp._token').value}`
      },
      responseType: 'json',
    })
    return res
  },
    { immediate: false }
  )
}

function handleError(response: FetchResponse<unknown>) {
  const toast = useToast()
  if (response?.status === 401) {
    toast.add({
      title: 'Tidak Terautentikasi',
      description: 'Anda tidak memiliki akses',
      color: 'error',
    })
  }


}