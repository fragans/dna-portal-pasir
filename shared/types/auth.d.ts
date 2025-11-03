
interface UserData {
  address: string;
  assignmentPlace: string;
  birthPlaceDate: string;
  createdBy: string;
  createdDate: string;
  deletedBy: string | null;
  deletedDate: string | null;
  email: string;
  fullname: string;
  masterUserID: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
  phoneNumber: string;
  role: string;
}

interface LoginResponse {
  message: string;
  token: string;
  data: UserData;
}
