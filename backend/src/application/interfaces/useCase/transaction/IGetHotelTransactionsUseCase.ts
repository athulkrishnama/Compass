import { ITransactionListingResponseDTO } from "@domain/dtos/transaction/transactionListing.dto";

export interface IGetHotelTransactionsUseCase {
  execute(
    userId: string,
    hotelId: string,
    pageNo: number,
  ): Promise<ITransactionListingResponseDTO>;
}
