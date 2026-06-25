export interface IVerifyStripeCabPaymentUseCase {
  execute(tripId: string, riderId: string): Promise<void>;
}
