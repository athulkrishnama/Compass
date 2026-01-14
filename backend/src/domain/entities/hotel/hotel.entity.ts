interface Address {
  country: string;
  city: string;
  landMark: string;
  pinCode: string;
  coordinates: [number, number];
}

export interface HotelEntity {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  address: Address;
}
