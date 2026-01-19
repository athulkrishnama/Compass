interface RoomVariantListingItem {
  id: string;
  name: string;
  coverImage: string;
  basePrice: number;
}

export interface IRoomVariantListingResponseDTO {
  roomVariants: RoomVariantListingItem[];
  count: number;
}
