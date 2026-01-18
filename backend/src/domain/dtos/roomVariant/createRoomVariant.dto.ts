import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";

export interface ICreateRoomVariantRequestDTO {
  hotelId: string;
  name: string;
  code: string;
  description: string;
  baseOccupancy: number;
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
  coverImage: File;
  images: File[];
}
