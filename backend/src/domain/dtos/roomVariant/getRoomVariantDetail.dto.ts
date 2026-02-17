import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

interface IUnAvailableRoom {
  id: string;
  roomNumber: number;
  status: RoomVariantStatus;
  reason: string;
}

export interface IRoomVariantDetailResponseDTO {
  id: string;
  hotelId: string;
  roomPrefix: string;
  name: string;
  description: string;
  maxOccupancy: number;
  bedConfig: {
    type: BedType;
    count: number;
  };
  amenities: RoomAmenity[];
  policies: {
    smokingAllowed: boolean;
    petsAllowed: boolean;
    checkInTime: string;
    checkOutTime: string;
  };
  basePrice: number;
  coverImage: string;
  images: string[];
  totalRooms: number;
  isActive: boolean;
  unAvailableRooms: IUnAvailableRoom[];
}
