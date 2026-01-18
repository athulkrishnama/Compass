export interface IRoomVariantDetailResponse {
    id: string;
    name: string;
    description: string;
    maxOccupancy: number;
    bedConfig: {
        type: string;
        count: number;
    };
    basePrice: number;
    amenities: string[];
    policies: {
        smokingAllowed: boolean;
        petsAllowed: boolean;
        checkInTime: string;
        checkOutTime: string;
    };
    coverImage: string;
    images: string[];
    hotelId: string;
}
