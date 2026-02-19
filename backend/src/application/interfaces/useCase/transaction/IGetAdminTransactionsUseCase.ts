import { ITransactionListingResponseDTO } from "@domain/dtos/transaction/transactionListing.dto";

export interface IGetAdminTransactionsUseCase {
  execute(pageNo: number): Promise<ITransactionListingResponseDTO>;
}
