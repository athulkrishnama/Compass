import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface RoomStatusEntity {
  _id?: string;
  roomVariantId: string;
  roomNumber: number;
  status: RoomVariantStatus;
  reason: string;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
