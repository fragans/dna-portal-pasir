
export function insertDocument(payload: ReportDocument) {
  // https://dummyjson.com/docs/auth
  const url = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main/add-document'
  const fetchKey = computed(() => `insert-${new Date().getTime()}`)
  return useAsyncData(fetchKey, async () => {
  const res = await $fetch<ResponseInsertReport>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useCookie('dpp._token').value}`,
        'Content-Type': 'application/json'
      },
      body: { ...payload}
    })
    return res
  },
  { 
    immediate: false
  })
}

export function getReports(){
  const url = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main/list-data'
  const fetchKey = computed(() => `show-${new Date().getTime()}`)
  return useAsyncData(fetchKey, async () => {
  const res = await $fetch<ResponseGetReports>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${useCookie('dpp._token').value}`,
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    })
    return res
  },
  { 
    immediate: false
  })
}