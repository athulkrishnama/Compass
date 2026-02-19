import { WalletEntity } from "@domain/entities/wallet/wallet.entity";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IWalletDocument } from "@infrastructure/repository/wallet/walletSchema";

export interface IWalletRepo
  extends BaseRepository<WalletEntity, IWalletDocument> {
  findByOwner(
    ownerId: string,
    ownerType: SERVICE_TYPE,
  ): Promise<WalletEntity | null>;
  creditWallet(
    ownerId: string,
    ownerType: SERVICE_TYPE,
    amount: number,
  ): Promise<void>;
}
