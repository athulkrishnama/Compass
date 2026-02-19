import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";
import { IHotelDocument } from "@infrastructure/repository/hotel/hotelSchema";
import { IRoomVariantDocument } from "@infrastructure/repository/roomVariant/roomVariantSchema";

export interface IBookingDetailsAggregation {
  booking: HotelBookingEntity & {
    hotel: IHotelDocument;
    roomVariant: IRoomVariantDocument;
  };
}

export interface IBookingDetailsResponseDTO {
  id: string;
  bookingStatus: BOOKING_STATUS;
  paymentStatus: PAYMENT_STATUS;
  createdAt: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  paymentIntendId: string;
  hotel: {
    id: string;
    name: string;
    coverImage: string;
    city: string;
    landMark: string;
  };
  roomVariant: {
    name: string;
    coverImage: string;
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
  };
  refundAmount?: number;
  refundStatus?: string;
  cancelledAt?: string;
  roomNumber?: string;
  isWalkIn: boolean;
}
