import {
  IBookingWithHotelAggregation,
  ITravelerBookingListingResponseDTO,
} from "@domain/dtos/hotelBooking/travelerBookingListing.dto";

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
}
