import { SERVICE_TYPE } from "@domain/enums/serviceType";

export interface WalletEntity {
  _id?: string;
  ownerId: string;
  ownerType: SERVICE_TYPE;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}
