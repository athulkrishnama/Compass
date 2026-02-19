import { IBookingDetailsResponseDTO } from "@domain/dtos/hotelBooking/bookingDetails.dto";

export interface IGetBookingDetailsUseCase {
  execute(
    bookingId: string,
    travelerId: string,
  ): Promise<IBookingDetailsResponseDTO>;
}
