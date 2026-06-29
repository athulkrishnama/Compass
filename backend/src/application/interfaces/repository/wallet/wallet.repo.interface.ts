import { WalletEntity } from "@domain/entities/wallet/wallet.entity";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";

export interface IWalletRepo extends IBaseRepository<WalletEntity> {
  findByOwner(
    ownerId: string,
    ownerType: SERVICE_TYPE,
  ): Promise<WalletEntity | null>;
  creditWallet(
    ownerId: string,
    ownerType: SERVICE_TYPE,
    amount: number,
    session?: IDbSession,
  ): Promise<void>;
  debitWallet(
    ownerId: string,
    ownerType: SERVICE_TYPE,
    amount: number,
    session?: IDbSession,
  ): Promise<void>;
}
