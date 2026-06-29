import {
  IInitiateCabPaymentRequestDTO,
  IInitiateCabPaymentResponseDTO,
} from "@domain/dtos/cabPayment/initiateCabPayment.dto";

export interface IInitiateCabPaymentUseCase {
  execute(
    dto: IInitiateCabPaymentRequestDTO,
  ): Promise<IInitiateCabPaymentResponseDTO>;
}
