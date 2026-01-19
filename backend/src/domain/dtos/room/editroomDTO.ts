import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface IEditRoomRequestDTO {
  userId: string;
  id: string;
  roomCode?: string;
  floor?: number;
  status?: RoomVariantStatus;
}
