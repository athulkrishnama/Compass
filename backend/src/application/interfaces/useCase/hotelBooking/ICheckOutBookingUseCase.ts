export interface ICheckOutBookingUseCase {
  execute(bookingId: string, hotelId: string): Promise<void>;
}
