import {
  IRecordCashPaymentRequestDTO,
  IRecordCashPaymentResponseDTO,
} from "@domain/dtos/cabPayment/recordCashPayment.dto";

export interface IRecordCashPaymentUseCase {
  execute(
    dto: IRecordCashPaymentRequestDTO,
  ): Promise<IRecordCashPaymentResponseDTO>;
}
