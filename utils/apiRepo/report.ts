
import type { MaybeRef } from 'vue'

export function insertDocument(payload: DocumentPayload) {
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


export function getUserReportsByDate(uid: MaybeRef<string>, date: MaybeRef<string>){
  const url = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main/list-data'
  
  return useAsyncData(
    () => `list-data-${unref(uid)}-${unref(date)}`, 
    async () => {
      const currentDate = unref(date)
      const currentUid = unref(uid)
      
      if (!currentUid || !currentDate) {
        return null
      }

      console.log({ date: currentDate });
  
      const res = await $fetch<ResponseGetReports>(url, {
        params: { startDate: currentDate, masterUserID: currentUid },
        method: 'GET',
        headers: {
          Authorization: `Bearer ${useCookie('dpp._token').value}`,
          'Content-Type': 'application/json'
        },
        responseType: 'json',
      })
      return res
    },
    // The reactive key will automatically trigger a refetch when `date` changes.
    // No need for an explicit `watch` option.
  )
}

export function getUserReportsForAdmin(uid: MaybeRef<UserSelectMenuItem|undefined>, date: MaybeRef<string>){
  const url = 'https://api-bayur-jaya.dnabisa.com/bayur-jaya-main/list-data'
  
  return useAsyncData(
    () => `list-data-${unref(uid)?.value}-${unref(date)}`, 
    async () => {
      const currentDate = unref(date)
      const currentUser = unref(uid)
      interface ListDataPayload {
        startDate?: string;
        masterUserID?: string
      }
      const params: ListDataPayload = {}
      if (currentUser) {
        params.masterUserID = currentUser.value
      }
      if (currentDate) {
        params.startDate = currentDate
      }
  
      const res = await $fetch<ResponseGetReports>(url, {
        params,
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
      server: false
    }
    // The reactive key will automatically trigger a refetch when `date` changes.
    // No need for an explicit `watch` option.
  )
}
