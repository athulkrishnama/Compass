import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";

export interface IInitiateCabPaymentRequestDTO {
  tripId: string;
  riderId: string;
  paymentMethod: PAYMENT_METHOD;
}

export interface IInitiateCabPaymentResponseDTO {
  paymentMethod: PAYMENT_METHOD;
  amount: number;
  currency: string;
  clientSecret?: string;
}
