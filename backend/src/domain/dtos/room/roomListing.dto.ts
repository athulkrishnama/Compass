interface RoomListingItem {
  id: string;
  name: string;
  code: string;
  coverImage: string;
  basePrice: number;
}

export interface IRoomListingResponseDTO {
  rooms: RoomListingItem[];
  count: number;
}
