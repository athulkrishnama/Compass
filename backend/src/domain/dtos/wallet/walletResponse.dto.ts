import { SERVICE_TYPE } from "@domain/enums/serviceType";

export interface IWalletResponseDTO {
  walletId: string;
  ownerId: string;
  ownerType: SERVICE_TYPE;
  balance: number;
  createdAt?: string;
}

export interface IWalletSummaryDTO {
  walletId: string;
  ownerId: string;
  ownerType: SERVICE_TYPE;
  balance: number;
  totalCredits: number;
  totalDebits: number;
  pendingAmount: number;
}
