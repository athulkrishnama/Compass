import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { BaseRepository } from "../base/base.repo";
import { ITransactionDocument } from "./transactionSchema";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { ITransactionAggregation } from "@domain/dtos/transaction/transactionListing.dto";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { inject, injectable } from "tsyringe";
import { Model, PipelineStage } from "mongoose";
import { VALUES } from "@presentation/constants/values";

@injectable()
export class TransactionRepo
  extends BaseRepository<TransactionEntity, ITransactionDocument>
  implements ITransactionRepo
{
  constructor(@inject("ITransactionModel") model: Model<ITransactionDocument>) {
    super(model);
  }

  async getProviderTransactions(
    userId: string,
    pageNo: number,
  ): Promise<ITransactionAggregation> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userId,
          type: {
            $in: [TRANSACTION_TYPE.SERVICE_CREDIT],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          providerObjectId: { $toObjectId: "$providerId" },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "providerObjectId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: { path: "$hotel", preserveNullAndEmptyArrays: true },
      },
      {
        $facet: {
          transactions: [
            { $skip: (pageNo - 1) * VALUES.BOOKINGS_LIMIT },
            { $limit: VALUES.BOOKINGS_LIMIT },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await this._model.aggregate(pipeline);
    const facetResult = result[0];

    return {
      transactions: facetResult?.transactions || [],
      total: facetResult?.total?.[0]?.count || 0,
    };
  }

  async getAdminTransactions(pageNo: number): Promise<ITransactionAggregation> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          type: {
            $in: [TRANSACTION_TYPE.PAYMENT, TRANSACTION_TYPE.SERVICE_CREDIT],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          providerObjectId: { $toObjectId: "$providerId" },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "providerObjectId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: { path: "$hotel", preserveNullAndEmptyArrays: true },
      },
      {
        $facet: {
          transactions: [
            { $skip: (pageNo - 1) * VALUES.BOOKINGS_LIMIT },
            { $limit: VALUES.BOOKINGS_LIMIT },
          ],
          total: [{ $count: "count" }],
          commission: [
            {
              $match: { type: TRANSACTION_TYPE.SERVICE_CREDIT },
            },
            {
              $group: {
                _id: null,
                totalCommission: { $sum: "$commissionAmount" },
              },
            },
          ],
        },
      },
    ];

    const result = await this._model.aggregate(pipeline);
    const facetResult = result[0];

    return {
      transactions: facetResult?.transactions || [],
      total: facetResult?.total?.[0]?.count || 0,
      totalCommission: facetResult?.commission?.[0]?.totalCommission || 0,
    };
  }

  toEntity(doc: ITransactionDocument): TransactionEntity {
    return {
      _id: doc._id.toString(),
      bookingId: doc.bookingId,
      serviceType: doc.serviceType,
      providerId: doc.providerId,
      amount: doc.amount,
      commissionRate: doc.commissionRate,
      commissionAmount: doc.commissionAmount,
      providerAmount: doc.providerAmount,
      type: doc.type,
      createdAt: doc.createdAt,
    };
  }
}
