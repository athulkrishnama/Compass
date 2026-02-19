import { ITravelerBookingListingResponseDTO } from "@domain/dtos/hotelBooking/travelerBookingListing.dto";

export interface IGetTravelerOngoingBookingsUseCase {
  execute(
    travelerId: string,
    pageNo: number,
  ): Promise<ITravelerBookingListingResponseDTO>;
}
