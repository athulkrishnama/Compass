import { inject, injectable } from "tsyringe";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { ITransactionListingResponseDTO } from "@domain/dtos/transaction/transactionListing.dto";
import { TransactionMapper } from "@application/mappers/transactionMapper";
import { VALUES } from "@presentation/constants/values";
import { IGetProviderTransactionsUseCase } from "@application/interfaces/useCase/transaction/IGetProviderTransactionsUseCase";

@injectable()
export class GetProviderTransactionsUseCase
  implements IGetProviderTransactionsUseCase
{
  constructor(
    @inject("ITransactionRepo") private _transactionRepo: ITransactionRepo,
  ) {}

  async execute(
    userId: string,
    pageNo: number,
  ): Promise<ITransactionListingResponseDTO> {
    const result = await this._transactionRepo.getProviderTransactions(
      userId,
      pageNo,
    );

    const totalPages = Math.ceil(result.total / VALUES.BOOKINGS_LIMIT);

    return TransactionMapper.toTransactionListingResponseDTO(
      result,
      totalPages,
      pageNo,
      result.total,
    );
  }
}
