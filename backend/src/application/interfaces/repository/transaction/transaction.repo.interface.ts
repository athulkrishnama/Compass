import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import {
  ITransactionAggregation,
  ITransactionQueryDTO,
  IWalletTransactionSummary,
} from "@domain/dtos/transaction/transactionListing.dto";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";
import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

export interface ITransactionRepo extends IBaseRepository<TransactionEntity> {
  createInSession(
    data: TransactionEntity,
    session: IDbSession,
  ): Promise<string>;

  getTransactionsByOwner(
    ownerId: string,
    ownerType: SERVICE_TYPE,
    query: ITransactionQueryDTO,
  ): Promise<ITransactionAggregation>;

  getAllTransactions(
    query: ITransactionQueryDTO,
  ): Promise<ITransactionAggregation>;

  getOwnerTransactionSummary(
    ownerId: string,
    ownerType: SERVICE_TYPE,
  ): Promise<IWalletTransactionSummary>;

  getProviderTransactions(
    userId: string,
    pageNo: number,
  ): Promise<ITransactionAggregation>;

  getAdminTransactions(pageNo: number): Promise<ITransactionAggregation>;
}
