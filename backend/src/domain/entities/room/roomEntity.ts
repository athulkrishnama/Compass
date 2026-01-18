import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface RoomEntity {
  _id?: string;
  hotelId: string;
  variantId: string;
  roomCode: string;
  floor: number;
  status: RoomVariantStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
