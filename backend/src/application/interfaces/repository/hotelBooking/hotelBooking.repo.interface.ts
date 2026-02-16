import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IHotelBookingDocument } from "@infrastructure/repository/hotelBooking/hotelBookingSchema";

export interface IHotelBookingRepo
  extends BaseRepository<HotelBookingEntity, IHotelBookingDocument> {
  filterBooking(filter: {
    travelerId?: string;
    hotelId?: string;
    roomVariantId?: string;
    roomId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentStatus?: PAYMENT_STATUS;
    bookingStatus?: BOOKING_STATUS;
    isWalkIn?: boolean;
    paymentIntendId?: string;
  }): Promise<HotelBookingEntity[]>;

  countBooking(filter: {
    travelerId?: string;
    hotelId?: string;
    roomVariantId?: string;
    roomId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentStatus?: PAYMENT_STATUS;
    bookingStatus?: BOOKING_STATUS;
    isWalkIn?: boolean;
    paymentIntendId?: string;
  }): Promise<number>;
}
