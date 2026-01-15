export interface IEditHotelRequestDTO {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  images?: File[];
  coverImage?: File;
  country?: string;
  city?: string;
  landMark?: string;
  pinCode?: string;
  coordinates?: [number, number];
}
