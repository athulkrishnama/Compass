import { HotelEntity } from "@domain/entities/hotel/hotel.entity";
import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";

export interface IHotelSearchRequestDTO {
  queryString?: string;
  city?: [number, number];
  proximityRadius?: number;
  checkInDate?: Date;
  checkOutDate?: Date;
  guests?: number;
  maxPrice?: number;
  minPrice?: number;
  pageNo: number;
}

interface RoomVariant {
  name: string;
  price: number;
  maxOccupancy: number;
  coverImage: string;
}

interface HotelWithRoomVariantDetails {
  name: string;
  description: string;
  coverImage: string;
  city: string;
  roomVariants: RoomVariant[];
}

export interface IHotelSearchResponseDTO {
  hotels: HotelWithRoomVariantDetails[];
  pageNo: number;
}

interface AggregatedHotel extends HotelEntity {
  roomVariants: RoomVariantEntity[];
}
export interface IHotelWithAggregatedRoomVariantDTO {
  hotels: AggregatedHotel[];
}
