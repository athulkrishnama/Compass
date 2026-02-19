import { IAvailableRoomsResponseDTO } from "@domain/dtos/hotelBooking/checkIn.dto";

export interface IGetAvailableRoomsForCheckInUseCase {
  execute(
    bookingId: string,
    hotelId: string,
  ): Promise<IAvailableRoomsResponseDTO>;
}
