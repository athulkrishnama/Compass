import { ITravelerBookingListingResponseDTO } from "@domain/dtos/hotelBooking/travelerBookingListing.dto";

export interface IGetTravelerUpcomingBookingsUseCase {
  execute(
    travelerId: string,
    pageNo: number,
  ): Promise<ITravelerBookingListingResponseDTO>;
}
