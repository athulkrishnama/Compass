import { inject, injectable } from "tsyringe";
import { IGetAllTransactionsUseCase } from "@application/interfaces/useCase/transaction/IGetAllTransactionsUseCase";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import {
  ITransactionListingResponseDTO,
  ITransactionQueryDTO,
} from "@domain/dtos/transaction/transactionListing.dto";
import { transactionMapper } from "@application/mappers/transactionMapper";

@injectable()
export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  constructor(
    @inject("ITransactionRepo") private _transactionRepo: ITransactionRepo,
  ) {}

  async execute(
    query: ITransactionQueryDTO,
  ): Promise<ITransactionListingResponseDTO> {
    const result = await this._transactionRepo.getAllTransactions(query);

    const totalPages = Math.ceil(result.total / query.limit);

    return {
      transactions: result.transactions.map((t) => transactionMapper.toDTO(t)),
      totalPages,
      currentPage: query.page,
      totalCount: result.total,
      totalCommission: result.totalCommission,
    };
  }
}
