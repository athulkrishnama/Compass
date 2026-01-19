export interface IRoomInstance {
    id: string;
    roomCode: string;
    floor: number;
    status: string;
}

export interface IRoomVariantDetailResponse {
    id: string;
    name: string;
    description: string;
    baseOccupancy: number;
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
    rooms: IRoomInstance[];
}
