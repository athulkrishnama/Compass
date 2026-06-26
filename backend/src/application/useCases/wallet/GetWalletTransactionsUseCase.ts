import { inject, injectable } from "tsyringe";
import { IGetWalletTransactionsUseCase } from "@application/interfaces/useCase/wallet/IGetWalletTransactionsUseCase";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import {
  ITransactionListingResponseDTO,
  ITransactionQueryDTO,
} from "@domain/dtos/transaction/transactionListing.dto";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { transactionMapper } from "@application/mappers/transactionMapper";

@injectable()
export class GetWalletTransactionsUseCase
  implements IGetWalletTransactionsUseCase
{
  constructor(
    @inject("ITransactionRepo") private _transactionRepo: ITransactionRepo,
  ) {}

  async execute(
    userId: string,
    ownerType: SERVICE_TYPE,
    query: ITransactionQueryDTO,
  ): Promise<ITransactionListingResponseDTO> {
    let result;

    if (ownerType === SERVICE_TYPE.ADMIN) {
      result = await this._transactionRepo.getAllTransactions(query);
    } else {
      result = await this._transactionRepo.getTransactionsByOwner(
        userId,
        ownerType,
        query,
      );
    }

    const totalPages = Math.ceil(result.total / query.limit);

    return {
      transactions: result.transactions.map((t) => transactionMapper.toDTO(t)),
      totalPages,
      currentPage: query.page,
      totalCount: result.total,
    };
  }
}
