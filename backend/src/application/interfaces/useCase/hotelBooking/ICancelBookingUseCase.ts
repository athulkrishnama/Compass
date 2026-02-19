export interface ICancelBookingUseCase {
  execute(
    bookingId: string,
    travelerId: string,
  ): Promise<{ refundAmount: number; refundPercentage: number }>;
}
