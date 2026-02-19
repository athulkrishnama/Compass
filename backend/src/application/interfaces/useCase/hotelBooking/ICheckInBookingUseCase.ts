export interface ICheckInBookingUseCase {
  execute(
    bookingId: string,
    hotelId: string,
    roomNumber?: number,
  ): Promise<void>;
}
