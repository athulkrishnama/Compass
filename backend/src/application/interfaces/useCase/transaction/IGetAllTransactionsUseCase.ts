import {
  ITransactionListingResponseDTO,
  ITransactionQueryDTO,
} from "@domain/dtos/transaction/transactionListing.dto";

export interface IGetAllTransactionsUseCase {
  execute(query: ITransactionQueryDTO): Promise<ITransactionListingResponseDTO>;
}
