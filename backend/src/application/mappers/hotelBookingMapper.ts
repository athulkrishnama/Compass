import {
  IBookingWithHotelAggregation,
  ITravelerBookingListingResponseDTO,
} from "@domain/dtos/hotelBooking/travelerBookingListing.dto";
import {
  IBookingDetailsAggregation,
  IBookingDetailsResponseDTO,
} from "@domain/dtos/hotelBooking/bookingDetails.dto";
import {
  IHotelBookingListingAggregation,
  IHotelBookingListingResponseDTO,
} from "@domain/dtos/hotelBooking/hotelBookingListing.dto";

export class HotelBookingMapper {
  static toTravelerBookingListingResponseDTO(
    data: IBookingWithHotelAggregation,
  ): ITravelerBookingListingResponseDTO {
    return {
      bookings: data.bookings.map((b) => ({
        id: b._id!,
        bookingId: b.bookingId || "N/A",
        hotelName: b.hotel.name,
        coverImage: b.hotel.coverImage,
        city: b.hotel.address.city,
        checkInDate: b.checkinDate.toISOString(),
        checkOutDate: b.checkoutDate.toISOString(),
        totalAmount: b.totalAmount,
        status: b.bookingStatus,
      })),
      pageNo: data.pageNo,
    };
  }

  static toBookingDetailsResponseDTO(
    data: IBookingDetailsAggregation,
  ): IBookingDetailsResponseDTO {
    const b = data.booking;
    return {
      id: b._id!,
      bookingId: b.bookingId || "N/A",
      bookingStatus: b.bookingStatus,
      paymentStatus: b.paymentStatus,
      createdAt: b.createdAt!.toISOString(),
      checkInDate: b.checkinDate.toISOString(),
      checkOutDate: b.checkoutDate.toISOString(),
      totalAmount: b.totalAmount,
      paymentIntendId: b.paymentIntendId,
      hotel: {
        id: b.hotel._id!.toString(),
        name: b.hotel.name,
        coverImage: b.hotel.coverImage,
        city: b.hotel.address.city,
        landMark: b.hotel.address.landMark,
      },
      roomVariant: {
        name: b.roomVariant.name,
        coverImage: b.roomVariant.coverImage,
        description: b.roomVariant.description,
        maxOccupancy: b.roomVariant.maxOccupancy,
        bedConfig: {
          type: b.roomVariant.bedConfig.type,
          count: b.roomVariant.bedConfig.count,
        },
        amenities: b.roomVariant.amenities,
        policies: {
          smokingAllowed: b.roomVariant.policies.smokingAllowed,
          petsAllowed: b.roomVariant.policies.petsAllowed,
          checkInTime: b.roomVariant.policies.checkInTime,
          checkOutTime: b.roomVariant.policies.checkOutTime,
        },
      },
      refundAmount: b.refundAmount,
      refundStatus: b.refundStatus,
      cancelledAt: b.cancelledAt?.toISOString(),
      roomNumbers: b.roomNumbers,
      numberOfRooms: b.numberOfRooms,
      isWalkIn: b.isWalkIn,
    };
  }

  static toHotelBookingListingResponseDTO(
    data: IHotelBookingListingAggregation,
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ): IHotelBookingListingResponseDTO {
    return {
      bookings: data.bookings.map((b) => ({
        id: b._id.toString(),
        bookingId: b.bookingId || "N/A",
        travelerId: b.travelerId,
        travelerEmail: b.traveler?.email || "",
        travelerProfileImage: b.traveler?.profile_image || "",
        guestName: b.traveler?.full_name || "Guest",
        roomVariantName: b.roomVariant?.name || "Unknown",
        roomNumbers: b.roomNumbers ?? [],
        numberOfRooms: b.numberOfRooms ?? 1,
        checkInDate: b.checkinDate.toISOString(),
        checkOutDate: b.checkoutDate.toISOString(),
        totalAmount: b.totalAmount,
        paymentStatus: b.paymentStatus,
        bookingStatus: b.bookingStatus,
      })),
      totalPages,
      currentPage,
      totalCount,
    };
  }
}
