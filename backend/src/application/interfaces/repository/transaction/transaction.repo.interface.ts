import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { ITransactionAggregation } from "@domain/dtos/transaction/transactionListing.dto";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";
import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";

export interface ITransactionRepo extends IBaseRepository<TransactionEntity> {
  getProviderTransactions(
    userId: string,
    pageNo: number,
  ): Promise<ITransactionAggregation>;
  getAdminTransactions(pageNo: number): Promise<ITransactionAggregation>;
  createInSession(
    data: TransactionEntity,
    session: IDbSession,
  ): Promise<string>;
}
