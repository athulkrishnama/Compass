import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";

export interface TransactionEntity {
  _id?: string;
  bookingId: string;
  userId?: string;
  driverId?: string;
  serviceType: SERVICE_TYPE;
  providerId: string;
  paymentMethod?: PAYMENT_METHOD;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  providerAmount?: number;
  type: TRANSACTION_TYPE;
  description?: string;
  createdAt?: Date;
}
