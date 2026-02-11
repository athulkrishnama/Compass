import type { RoomStatus } from "../responses/roomVariantDetailResponse";

export interface IGetRoomVariantAvailabilityRequestDTO {
    roomVariantId: string;
    checkinDate: Date;
    checkoutDate: Date;
}

export interface IMarkRoomAsUnavailableRequestDTO {
    roomVariantId: string;
    roomNumber: number;
    reason: string;
    status: RoomStatus;
}

export interface IUpdateRoomUnavailabilityRequestDTO {
    id: string;
    status: RoomStatus;
    reason: string;
}
