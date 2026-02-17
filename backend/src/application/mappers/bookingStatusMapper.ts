import { IBookingStatusResponseDTO } from "@domain/dtos/hotelBooking/bookingStatusResponse.dto";
import { BookingStatusResponseStatus } from "@domain/enums/bookingStatusResponseStatus";

export class BookingStatusMapper {
  static toGetBookingStatusResponseDTOFromEntity(
    status: BookingStatusResponseStatus,
  ): IBookingStatusResponseDTO {
    return {
      status,
    };
  }
}
