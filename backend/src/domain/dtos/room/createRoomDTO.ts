import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface ICreateRoomRequestDTO {
  hotelId: string;
  variantId: string;
  roomCode: string;
  floor: number;
  status: RoomVariantStatus;
}
