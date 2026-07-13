import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface IUpdateRoomUnavailabilityRequestDTO {
  id: string;
  status: RoomVariantStatus;
  reason: string;
  startDate: Date;
  endDate: Date;
}
