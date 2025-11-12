interface FormStateDocument {
  date: string | undefined
  location: string | undefined
  namaSopir: string | undefined
  dokumen: File[]
  noSupir: undefined
  batch: number | undefined
  muatan: number | undefined
  keterangan: string | undefined
}

interface DocumentPayload {
  masterUserID: string
  tanggal: string
  lokasi: string
  batch: string
  muatan: number
  namaSupir: string
  noSupir: string
  keterangan: string
  documents: string[]
}

interface ResponseInsertReport {
  message: string
  data: ReportDocument
}

interface GetReport {
  batch: string
  masterUserID: string
  createdDate: string,
  createdBy: string
  deletedBy: string
  deletedDate: string| null
  departureDate: string
  description: string
  documents: {link: string}[]
  driverName: string
  formID: string
  loadAmount: string
  modifiedBy: string
  modifiedDate: string
  place: string
  vehicleNo: string
}
interface ResponseGetReports {
  message: string
  data: GetReport[]
}

