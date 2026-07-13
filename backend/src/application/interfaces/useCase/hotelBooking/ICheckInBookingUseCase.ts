export interface ICheckInBookingUseCase {
  execute(
    bookingId: string,
    hotelId: string,
    roomNumbers?: number[],
  ): Promise<void>;
}
