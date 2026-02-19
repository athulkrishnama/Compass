import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";

export interface ITransactionItemDTO {
  id: string;
  bookingId: string;
  serviceType: SERVICE_TYPE;
  providerId: string;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  providerAmount?: number;
  type: TRANSACTION_TYPE;
  hotelName?: string;
  createdAt: string;
}

export interface ITransactionListingResponseDTO {
  transactions: ITransactionItemDTO[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  totalCommission?: number;
}

export interface ITransactionAggregation {
  transactions: {
    _id: string;
    bookingId: string;
    serviceType: SERVICE_TYPE;
    providerId: string;
    amount: number;
    commissionRate?: number;
    commissionAmount?: number;
    providerAmount?: number;
    type: TRANSACTION_TYPE;
    hotel?: { name: string };
    createdAt: Date;
  }[];
  total: number;
  totalCommission?: number;
}
