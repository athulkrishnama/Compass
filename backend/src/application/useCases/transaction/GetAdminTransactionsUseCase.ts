import { inject, injectable } from "tsyringe";
import { IGetAdminTransactionsUseCase } from "@application/interfaces/useCase/transaction/IGetAdminTransactionsUseCase";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { ITransactionListingResponseDTO } from "@domain/dtos/transaction/transactionListing.dto";
import { TransactionMapper } from "@application/mappers/transactionMapper";
import { VALUES } from "@presentation/constants/values";

@injectable()
export class GetAdminTransactionsUseCase
  implements IGetAdminTransactionsUseCase
{
  constructor(
    @inject("ITransactionRepo") private _transactionRepo: ITransactionRepo,
  ) {}

  async execute(pageNo: number): Promise<ITransactionListingResponseDTO> {
    const result = await this._transactionRepo.getAdminTransactions(pageNo);

    const totalPages = Math.ceil(result.total / VALUES.BOOKINGS_LIMIT);

    return TransactionMapper.toTransactionListingResponseDTO(
      result,
      totalPages,
      pageNo,
      result.total,
    );
  }
}
