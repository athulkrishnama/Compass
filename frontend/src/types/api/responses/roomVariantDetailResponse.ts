import type { RoomAmenity } from "@/constants/roomConstants/roomAmenity";

export enum RoomStatus {
    BLOCKED = "BLOCKED",
    MAINTENANCE = "MAINTENANCE",
}
export interface IUnAvailableRoom {
    id: string;
    roomNumber: number;
    status: RoomStatus;
    reason: string;
}

export interface IRoomVariantDetailResponse {
    id: string;
    name: string;
    description: string;
    roomPrefix: string;
    totalRooms: number;
    baseOccupancy: number;
    maxOccupancy: number;
    bedConfig: {
        type: string;
        count: number;
    };
    basePrice: number;
    amenities: RoomAmenity[];
    policies: {
        smokingAllowed: boolean;
        petsAllowed: boolean;
        checkInTime: string;
        checkOutTime: string;
    };
    coverImage: string;
    images: string[];
    hotelId: string;
    unAvailableRooms: IUnAvailableRoom[];
}
