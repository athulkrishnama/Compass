export interface IProcessWalletCabPaymentUseCase {
  execute(tripId: string, riderId: string): Promise<void>;
}
