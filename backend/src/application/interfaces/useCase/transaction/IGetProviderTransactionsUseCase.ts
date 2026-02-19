import { ITransactionListingResponseDTO } from "@domain/dtos/transaction/transactionListing.dto";
export interface IGetProviderTransactionsUseCase {
  execute(
    userId: string,
    pageNo: number,
  ): Promise<ITransactionListingResponseDTO>;
}
