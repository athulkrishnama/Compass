import { IHotelBookingListingResponseDTO } from "@domain/dtos/hotelBooking/hotelBookingListing.dto";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

export interface IGetHotelBookingsUseCase {
  execute(
    userId: string,
    hotelId: string,
    roomVariantId: string | undefined,
    status: BOOKING_STATUS | undefined,
    search: string | undefined,
    pageNo: number,
  ): Promise<IHotelBookingListingResponseDTO>;
}
