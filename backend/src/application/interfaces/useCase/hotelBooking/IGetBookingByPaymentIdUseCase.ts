import { IBookingStatusResponseDTO } from "@domain/dtos/hotelBooking/bookingStatusResponse.dto";

export interface IGetBookingByPaymentIdUseCase {
  execute(paymentId: string): Promise<IBookingStatusResponseDTO>;
}
