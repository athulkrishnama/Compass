interface RoomVariantListingItem {
  id: string;
  name: string;
  coverImage: string;
  basePrice: number;
  maxOccupancy: number;
  isActive: boolean;
}

export interface IRoomVariantListingResponseDTO {
  roomVariants: RoomVariantListingItem[];
  count: number;
}
