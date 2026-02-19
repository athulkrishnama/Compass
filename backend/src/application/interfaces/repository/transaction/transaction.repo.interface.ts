import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { ITransactionAggregation } from "@domain/dtos/transaction/transactionListing.dto";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { ITransactionDocument } from "@infrastructure/repository/transaction/transactionSchema";

export interface ITransactionRepo
  extends BaseRepository<TransactionEntity, ITransactionDocument> {
  getProviderTransactions(
    userId: string,
    pageNo: number,
  ): Promise<ITransactionAggregation>;
  getAdminTransactions(pageNo: number): Promise<ITransactionAggregation>;
}
