interface Hotel {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  coverImage: string;
}

export interface IHotelListingResponseDTO {
  hotels: Hotel[];
  count: number;
}
