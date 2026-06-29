import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";

export interface ICabPaymentStatusResponseDTO {
  tripId: string;
  paymentStatus: PAYMENT_STATUS;
  paymentMethod?: PAYMENT_METHOD;
  totalFare: number;
  remainingAmount: number;
}
