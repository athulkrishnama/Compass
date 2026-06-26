import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";

export interface ITransactionItemDTO {
  id: string;
  bookingId: string;
  ownerType: SERVICE_TYPE;
  ownerId: string;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  type: TRANSACTION_TYPE;
  paymentMethod?: PAYMENT_METHOD;
  description?: string;
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

export type TransactionSortOption =
  | "latest"
  | "oldest"
  | "highestAmount"
  | "lowestAmount";

export interface ITransactionQueryDTO {
  page: number;
  limit: number;
  search?: string;
  sort?: TransactionSortOption;
  type?: TRANSACTION_TYPE;
  paymentMethod?: PAYMENT_METHOD;
  serviceType?: SERVICE_TYPE;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ITransactionAggregation {
  transactions: {
    _id: string;
    bookingId: string;
    ownerType: SERVICE_TYPE;
    ownerId: string;
    paymentMethod?: PAYMENT_METHOD;
    amount: number;
    commissionRate?: number;
    commissionAmount?: number;
    type: TRANSACTION_TYPE;
    description?: string;
    hotel?: { name: string };
    createdAt: Date;
  }[];
  total: number;
  totalCommission?: number;
}

export interface IWalletTransactionSummary {
  totalCredits: number;
  totalDebits: number;
  pendingAmount: number;
}
