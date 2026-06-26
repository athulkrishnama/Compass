import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { BaseRepository } from "../base/base.repo";
import { ITransactionDocument } from "./transactionSchema";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import {
  ITransactionAggregation,
  ITransactionQueryDTO,
  IWalletTransactionSummary,
} from "@domain/dtos/transaction/transactionListing.dto";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { inject, injectable } from "tsyringe";
import { ClientSession, FilterQuery, Model, PipelineStage } from "mongoose";
import { VALUES } from "@presentation/constants/values";

const CREDIT_TYPES = [
  TRANSACTION_TYPE.SERVICE_CREDIT,
  TRANSACTION_TYPE.REFUND,
  TRANSACTION_TYPE.TOP_UP,
  TRANSACTION_TYPE.WALLET_CREDIT,
  TRANSACTION_TYPE.COMMISSION,
];

const DEBIT_TYPES = [
  TRANSACTION_TYPE.PAYMENT,
  TRANSACTION_TYPE.WALLET_DEBIT,
  TRANSACTION_TYPE.COMMISSION_DEBIT,
];

@injectable()
export class TransactionRepo
  extends BaseRepository<TransactionEntity, ITransactionDocument>
  implements ITransactionRepo
{
  constructor(@inject("ITransactionModel") model: Model<ITransactionDocument>) {
    super(model);
  }

  async createInSession(
    data: TransactionEntity,
    session: ClientSession,
  ): Promise<string> {
    const [doc] = await this._model.create([data], { session });
    return (doc._id as unknown as string).toString();
  }

  private _buildMatchStage(
    query: ITransactionQueryDTO,
    ownerConstraint?: { field: string; value: string },
  ): FilterQuery<ITransactionDocument> {
    const match: FilterQuery<ITransactionDocument> = {};

    if (ownerConstraint) {
      match[ownerConstraint.field] = ownerConstraint.value;
    }

    if (query.type) {
      match.type = query.type;
    }

    if (query.paymentMethod) {
      match.paymentMethod = query.paymentMethod;
    }

    if (query.serviceType) {
      match.serviceType = query.serviceType;
    }

    // Date range
    if (query.dateFrom || query.dateTo) {
      match.createdAt = {};
      if (query.dateFrom) {
        match.createdAt.$gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        match.createdAt.$lte = new Date(query.dateTo);
      }
    }

    // Amount range
    if (query.minAmount !== undefined || query.maxAmount !== undefined) {
      match.amount = {};
      if (query.minAmount !== undefined) {
        match.amount.$gte = query.minAmount;
      }
      if (query.maxAmount !== undefined) {
        match.amount.$lte = query.maxAmount;
      }
    }

    // Search
    if (query.search) {
      const searchRegex = new RegExp(query.search, "i");
      const orConditions: FilterQuery<ITransactionDocument>[] = [
        { description: searchRegex },
        { bookingId: searchRegex },
      ];

      if (query.search.match(/^[0-9a-fA-F]{24}$/)) {
        orConditions.push({ _id: query.search });
      }

      match.$or = orConditions;
    }

    return match;
  }

  private _buildSortStage(sort?: string): Record<string, 1 | -1> {
    switch (sort) {
      case "oldest":
        return { createdAt: 1 };
      case "highestAmount":
        return { amount: -1, createdAt: -1 };
      case "lowestAmount":
        return { amount: 1, createdAt: -1 };
      case "latest":
      default:
        return { createdAt: -1 };
    }
  }

  async getTransactionsByOwner(
    ownerId: string,
    ownerType: SERVICE_TYPE,
    query: ITransactionQueryDTO,
  ): Promise<ITransactionAggregation> {
    const match = this._buildMatchStage(query, {
      field: "ownerId",
      value: ownerId,
    });
    match.ownerType = ownerType;
    const sort = this._buildSortStage(query.sort);
    const skip = (query.page - 1) * query.limit;

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          transactions: [{ $skip: skip }, { $limit: query.limit }],
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

  async getAllTransactions(
    query: ITransactionQueryDTO,
  ): Promise<ITransactionAggregation> {
    const match = this._buildMatchStage(query);
    match.ownerType = SERVICE_TYPE.ADMIN;
    const sort = this._buildSortStage(query.sort);
    const skip = (query.page - 1) * query.limit;

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          transactions: [{ $skip: skip }, { $limit: query.limit }],
          total: [{ $count: "count" }],
          commission: [
            {
              $match: {
                type: {
                  $in: [
                    TRANSACTION_TYPE.COMMISSION,
                    TRANSACTION_TYPE.SERVICE_CREDIT,
                  ],
                },
              },
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

  async getOwnerTransactionSummary(
    ownerId: string,
    ownerType: SERVICE_TYPE,
  ): Promise<IWalletTransactionSummary> {
    const ownerMatch: FilterQuery<ITransactionDocument> = {
      ownerId,
      ownerType,
    };

    const pipeline: PipelineStage[] = [
      { $match: ownerMatch },
      {
        $facet: {
          credits: [
            { $match: { type: { $in: CREDIT_TYPES } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          debits: [
            { $match: { type: { $in: DEBIT_TYPES } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
        },
      },
    ];

    const result = await this._model.aggregate(pipeline);
    const facetResult = result[0];

    return {
      totalCredits: facetResult?.credits?.[0]?.total || 0,
      totalDebits: facetResult?.debits?.[0]?.total || 0,
      pendingAmount: 0,
    };
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
      ownerType: doc.ownerType,
      ownerId: doc.ownerId,
      paymentMethod: doc.paymentMethod,
      amount: doc.amount,
      commissionRate: doc.commissionRate,
      commissionAmount: doc.commissionAmount,
      type: doc.type,
      description: doc.description,
      createdAt: doc.createdAt,
    };
  }
}
