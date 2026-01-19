export interface RoomVariantListingItem {
    id: string;
    name: string;
    coverImage: string;
    basePrice: number;
}

export interface IRoomVariantListingResponse {
    roomVariants: RoomVariantListingItem[];
    count: number;
}
