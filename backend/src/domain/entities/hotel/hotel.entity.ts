interface Address {
  country: string;
  city: string;
  landMark: string;
  pinCode: string;
  coordinates: [number, number];
}

export interface HotelEntity {
  _id?: string;
  userId: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  address: Address;
  averageRating?: number;
  totalReviews?: number;
}
