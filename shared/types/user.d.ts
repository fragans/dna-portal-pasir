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
