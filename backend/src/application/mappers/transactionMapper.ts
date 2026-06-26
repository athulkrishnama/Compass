import {
  ITransactionAggregation,
  ITransactionItemDTO,
  ITransactionListingResponseDTO,
} from "@domain/dtos/transaction/transactionListing.dto";

export const transactionMapper = {
  toDTO(data: ITransactionAggregation["transactions"][0]): ITransactionItemDTO {
    return {
      id: data._id.toString(),
      bookingId: data.bookingId,
      ownerType: data.ownerType,
      ownerId: data.ownerId,
      amount: data.amount,
      commissionRate: data.commissionRate,
      commissionAmount: data.commissionAmount,
      type: data.type,
      paymentMethod: data.paymentMethod,
      description: data.description,
      hotelName: data.hotel?.name,
      createdAt: data.createdAt.toISOString(),
    };
  },

  toTransactionListingResponseDTO(
    data: ITransactionAggregation,
    totalPages: number,
    currentPage: number,
    totalCount: number,
  ): ITransactionListingResponseDTO {
    return {
      transactions: data.transactions.map((t) => this.toDTO(t)),
      totalPages,
      currentPage,
      totalCount,
      totalCommission: data.totalCommission,
    };
  },
};
