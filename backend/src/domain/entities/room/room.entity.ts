import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import { RoomStatus } from "@domain/enums/roomStatus";

interface BedConfig {
  type: BedType;
  count: number;
}

interface RoomPolicies {
  smokingAllowed: boolean;
  petsAllowed: boolean;
  checkInTime: string;
  checkOutTime: string;
}

export interface RoomEntity {
  _id?: string;
  hotelId: string;
  name: string;
  code: string;
  description: string;
  baseOccupancy: number;
  maxOccupancy: number;
  bedConfig: BedConfig;
  amenities: RoomAmenity[];
  policies: RoomPolicies;
  basePrice: number;
  coverImage: string;
  images: string[];
  status: RoomStatus;
}
