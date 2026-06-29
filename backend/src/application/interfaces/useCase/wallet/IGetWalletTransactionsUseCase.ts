import {
  ITransactionListingResponseDTO,
  ITransactionQueryDTO,
} from "@domain/dtos/transaction/transactionListing.dto";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

export interface IGetWalletTransactionsUseCase {
  execute(
    userId: string,
    ownerType: SERVICE_TYPE,
    query: ITransactionQueryDTO,
  ): Promise<ITransactionListingResponseDTO>;
}
