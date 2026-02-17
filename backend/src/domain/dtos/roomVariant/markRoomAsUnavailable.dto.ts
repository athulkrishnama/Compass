import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface IMarkRoomAsUnavailableRequestDTO {
  userId: string;
  roomVariantId: string;
  roomNumber: number;
  reason: string;
  status: RoomVariantStatus;
}
