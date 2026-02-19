import { ITravelerBookingListingResponseDTO } from "@domain/dtos/hotelBooking/travelerBookingListing.dto";

export interface IGetTravelerCompletedBookingsUseCase {
  execute(
    travelerId: string,
    pageNo: number,
  ): Promise<ITravelerBookingListingResponseDTO>;
}
