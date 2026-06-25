import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";

export interface IRecordCashPaymentRequestDTO {
  tripId: string;
  driverId: string;
  amountReceived: number;
}

export interface IRecordCashPaymentResponseDTO {
  status: PAYMENT_STATUS;
  changeReturned?: number;
}
