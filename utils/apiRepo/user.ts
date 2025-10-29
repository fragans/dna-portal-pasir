export function getProfileById(id:string) {
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
  })

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
      responseType: 'json'
    })
    return res
  })
}