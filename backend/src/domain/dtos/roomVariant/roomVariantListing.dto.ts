interface RoomVariantListingItem {
  id: string;
  name: string;
  code: string;
  coverImage: string;
  basePrice: number;
}

export interface IRoomVariantListingResponseDTO {
  roomVariants: RoomVariantListingItem[];
  count: number;
}
