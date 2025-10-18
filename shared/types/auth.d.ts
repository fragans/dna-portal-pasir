
interface UserData {
  masterUserID: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  birthPlaceDate: string;
  assignmentPlace: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
  deletedBy: string | null;
  deletedDate: string | null;
}

interface LoginResponse {
  message: string;
  token: string;
  data: UserData;
}
