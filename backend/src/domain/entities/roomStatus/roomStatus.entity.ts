import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface RoomStatusEntity {
  _id?: string;
  roomVariantId: string;
  roomNumber: number;
  status: RoomVariantStatus;
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;
}
