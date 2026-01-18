export interface RoomVariantListingItem {
    id: string;
    name: string;
    code: string;
    coverImage: string;
    basePrice: number;
}

export interface IRoomVariantListingResponse {
    roomVariants: RoomVariantListingItem[];
    count: number;
}
