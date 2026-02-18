import { IHotelDashboardResponseDTO } from "@domain/dtos/hotelBooking/hotelDashboard.dto";
import {
  IHotelDashboardSummary,
  IOverallDashboardResponseDTO,
} from "@domain/dtos/hotelBooking/overallDashboard.dto";
import { HotelEntity } from "@domain/entities/hotel/hotel.entity";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

export class DashboardMapper {
  static toHotelDashboardResponseDTO(
    hotel: HotelEntity,
    coverImage: string,
    stats: {
      todayCheckIns: number;
      todayCheckOuts: number;
      activeGuests: number;
      occupiedRooms: number;
      totalRevenue: number;
      totalBookings: number;
    },
    totalRooms: number,
    recentBookings: {
      _id: string;
      guestName: string;
      roomVariantName: string;
      checkinDate: Date;
      checkoutDate: Date;
      bookingStatus: BOOKING_STATUS;
      totalAmount: number;
    }[],
  ): IHotelDashboardResponseDTO {
    return {
      hotel: {
        id: hotel._id!,
        name: hotel.name,
        coverImage,
        city: hotel.address.city,
      },
      todayCheckIns: stats.todayCheckIns,
      todayCheckOuts: stats.todayCheckOuts,
      activeGuests: stats.activeGuests,
      totalRooms,
      occupiedRooms: stats.occupiedRooms,
      occupancyRate:
        totalRooms > 0
          ? Math.round((stats.occupiedRooms / totalRooms) * 100)
          : 0,
      totalRevenue: stats.totalRevenue,
      totalBookings: stats.totalBookings,
      recentBookings: recentBookings.map((b) => ({
        id: b._id,
        guestName: b.guestName,
        roomVariantName: b.roomVariantName,
        checkInDate: b.checkinDate.toISOString(),
        checkOutDate: b.checkoutDate.toISOString(),
        status: b.bookingStatus,
        totalAmount: b.totalAmount,
      })),
    };
  }

  static toOverallDashboardResponseDTO(
    totals: {
      totalHotels: number;
      todayCheckIns: number;
      todayCheckOuts: number;
      activeGuests: number;
      totalRooms: number;
      occupiedRooms: number;
      totalRevenue: number;
    },
    hotels: IHotelDashboardSummary[],
  ): IOverallDashboardResponseDTO {
    return {
      ...totals,
      occupancyRate:
        totals.totalRooms > 0
          ? Math.round((totals.occupiedRooms / totals.totalRooms) * 100)
          : 0,
      hotels,
    };
  }

  static toHotelSummaryDTO(
    hotel: HotelEntity,
    coverImage: string,
    stats: {
      todayCheckIns: number;
      todayCheckOuts: number;
      activeGuests: number;
      occupiedRooms: number;
      totalRevenue: number;
    },
    totalRooms: number,
  ): IHotelDashboardSummary {
    return {
      id: hotel._id!,
      name: hotel.name,
      coverImage,
      city: hotel.address.city,
      todayCheckIns: stats.todayCheckIns,
      todayCheckOuts: stats.todayCheckOuts,
      activeGuests: stats.activeGuests,
      totalRooms,
      occupiedRooms: stats.occupiedRooms,
      occupancyRate:
        totalRooms > 0
          ? Math.round((stats.occupiedRooms / totalRooms) * 100)
          : 0,
    };
  }
}
