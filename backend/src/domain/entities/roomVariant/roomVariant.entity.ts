import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";

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
  description: string;
  maxOccupancy: number;
  bedConfig: BedConfig;
  amenities: RoomAmenity[];
  policies: RoomVariantPolicies;
  basePrice: number;
  coverImage: string;
  images: string[];
}
