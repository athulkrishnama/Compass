interface RoomVariantListingItem {
  id: string;
  name: string;
  coverImage: string;
  basePrice: number;
  maxOccupancy: number;
}

export interface IRoomVariantListingResponseDTO {
  roomVariants: RoomVariantListingItem[];
  count: number;
}
