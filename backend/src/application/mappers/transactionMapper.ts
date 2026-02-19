import {
  ITransactionAggregation,
  ITransactionListingResponseDTO,
} from "@domain/dtos/transaction/transactionListing.dto";

export class TransactionMapper {
  static toTransactionListingResponseDTO(
    data: ITransactionAggregation,
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ): ITransactionListingResponseDTO {
    return {
      transactions: data.transactions.map((t) => ({
        id: t._id.toString(),
        bookingId: t.bookingId,
        serviceType: t.serviceType,
        providerId: t.providerId,
        amount: t.amount,
        commissionRate: t.commissionRate,
        commissionAmount: t.commissionAmount,
        providerAmount: t.providerAmount,
        type: t.type,
        hotelName: t.hotel?.name,
        createdAt: t.createdAt.toISOString(),
      })),
      totalPages,
      currentPage,
      totalCount,
      totalCommission: data.totalCommission,
    };
  }
}
