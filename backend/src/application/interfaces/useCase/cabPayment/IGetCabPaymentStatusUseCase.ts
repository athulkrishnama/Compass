import { ICabPaymentStatusResponseDTO } from "@domain/dtos/cabPayment/cabPaymentStatus.dto";

export interface IGetCabPaymentStatusUseCase {
  execute(tripId: string): Promise<ICabPaymentStatusResponseDTO>;
}
