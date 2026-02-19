import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";

export interface TransactionEntity {
  _id?: string;
  bookingId: string;
  userId?: string;
  serviceType: SERVICE_TYPE;
  providerId: string;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  providerAmount?: number;
  type: TRANSACTION_TYPE;
  createdAt?: Date;
}
