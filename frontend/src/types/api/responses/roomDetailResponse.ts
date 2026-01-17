export interface IRoomDetailResponse {
    id: string;
    name: string;
    code: string;
    description: string;
    baseOccupancy: number;
    maxOccupancy: number;
    bedConfig: {
        type: string;
        count: number;
    };
    basePrice: number;
    status: string;
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
