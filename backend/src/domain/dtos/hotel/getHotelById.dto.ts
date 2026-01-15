export interface IGetHotelByIdResponseDTO {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  landMark: string;
  pinCode: string;
  coordinates: [number, number];
  coverImage: string;
  images: string[];
}
