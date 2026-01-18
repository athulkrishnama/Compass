import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

interface BedConfig {
  type: BedType;
  count: number;
}

interface RoomVariantPolicies {
  smokingAllowed: boolean;
  petsAllowed: boolean;
  checkInTime: string;
  checkOutTime: string;
}

export interface RoomVariantEntity {
  _id?: string;
  hotelId: string;
  name: string;
  code: string;
  description: string;
  baseOccupancy: number;
  maxOccupancy: number;
  bedConfig: BedConfig;
  amenities: RoomAmenity[];
  policies: RoomVariantPolicies;
  basePrice: number;
  coverImage: string;
  images: string[];
  status: RoomVariantStatus;
}
