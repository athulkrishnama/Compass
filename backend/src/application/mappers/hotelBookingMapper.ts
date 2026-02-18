import {
  IBookingWithHotelAggregation,
  ITravelerBookingListingResponseDTO,
} from "@domain/dtos/hotelBooking/travelerBookingListing.dto";
import {
  IBookingDetailsAggregation,
  IBookingDetailsResponseDTO,
} from "@domain/dtos/hotelBooking/bookingDetails.dto";

export class HotelBookingMapper {
  static toTravelerBookingListingResponseDTO(
    data: IBookingWithHotelAggregation,
  ): ITravelerBookingListingResponseDTO {
    return {
      bookings: data.bookings.map((b) => ({
        id: b._id!,
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
      bookingStatus: b.bookingStatus,
      paymentStatus: b.paymentStatus,
      createdAt: b.createdAt!.toISOString(),
      checkInDate: b.checkinDate.toISOString(),
      checkOutDate: b.checkoutDate.toISOString(),
      totalAmount: b.totalAmount,
      paymentIntendId: b.paymentIntendId,
      hotel: {
        id: b.hotel._id.toString(),
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
    };
  }
}
