import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IHotelBookingDocument } from "@infrastructure/repository/hotelBooking/hotelBookingSchema";
import { IBookingWithHotelAggregation } from "@domain/dtos/hotelBooking/travelerBookingListing.dto";
import { IBookingDetailsAggregation } from "@domain/dtos/hotelBooking/bookingDetails.dto";

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

  getTravelerUpcomingBookings(
    travelerId: string,
    pageNo: number,
  ): Promise<IBookingWithHotelAggregation>;

  getTravelerOngoingBookings(
    travelerId: string,
    pageNo: number,
  ): Promise<IBookingWithHotelAggregation>;

  getTravelerCompletedBookings(
    travelerId: string,
    pageNo: number,
  ): Promise<IBookingWithHotelAggregation>;

  getBookingDetailsById(
    bookingId: string,
    travelerId: string,
  ): Promise<IBookingDetailsAggregation | null>;

  getDashboardStats(hotelIds: string[]): Promise<
    {
      hotelId: string;
      todayCheckIns: number;
      todayCheckOuts: number;
      activeGuests: number;
      occupiedRooms: number;
      totalRevenue: number;
      totalBookings: number;
    }[]
  >;

  getRecentBookingsByHotelId(
    hotelId: string,
    limit: number,
  ): Promise<
    {
      _id: string;
      guestName: string;
      roomVariantName: string;
      checkinDate: Date;
      checkoutDate: Date;
      bookingStatus: BOOKING_STATUS;
      totalAmount: number;
    }[]
  >;
}
