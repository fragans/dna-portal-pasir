interface Coordinates {
  lat: number;
  lng: number;
}

interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

interface ResponseProfile {
  message: string
  data: UserData
}
interface ResponseUserList {
  message: string
  data: UserData[]
}

interface InsertUserPayload {
  fullname: string | undefined
  email: string | undefined
  phoneNumber: string | undefined
  address: string | undefined
  birthPlaceDate: string | undefined
  tempatPenugasan: string | undefined
}

interface ResponseInsertUser {
  data: UserData
  message: string
}