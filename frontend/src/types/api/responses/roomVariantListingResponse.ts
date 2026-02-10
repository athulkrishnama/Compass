export interface RoomVariantListingItem {
    id: string;
    name: string;
    coverImage: string;
    basePrice: number;
    maxOccupancy: number;
    isActive: boolean;
}

export interface IRoomVariantListingResponse {
    roomVariants: RoomVariantListingItem[];
    count: number;
}
