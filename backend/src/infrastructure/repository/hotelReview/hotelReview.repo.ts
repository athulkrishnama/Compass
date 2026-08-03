import { HotelReviewEntity } from "@domain/entities/hotelReview/hotelReview.entity";
import { BaseRepository } from "../base/base.repo";
import { IHotelReviewDocument } from "./hotelReviewSchema";
import {
  IHotelReviewRepo,
  IHotelReviewFilters,
  IHotelReviewWithReviewer,
} from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { inject, injectable } from "tsyringe";
import { Model, PipelineStage, RootFilterQuery } from "mongoose";

@injectable()
export class HotelReviewRepo
  extends BaseRepository<HotelReviewEntity, IHotelReviewDocument>
  implements IHotelReviewRepo
{
  constructor(@inject("IHotelReviewModel") model: Model<IHotelReviewDocument>) {
    super(model);
  }

  toEntity(doc: IHotelReviewDocument): HotelReviewEntity {
    return {
      _id: doc._id.toString(),
      bookingId: doc.bookingId,
      hotelId: doc.hotelId,
      reviewerId: doc.reviewerId,
      ratings: doc.ratings,
      comment: doc.comment,
      overallRating: doc.overallRating,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByBookingId(bookingId: string): Promise<HotelReviewEntity | null> {
    const doc = await this._model.findOne({ bookingId });
    return doc ? this.toEntity(doc) : null;
  }

  private _buildWithReviewerPipeline(
    matchStage: Record<string, unknown>,
    skip: number,
    limit: number,
  ): PipelineStage[] {
    return [
      { $match: matchStage },
      {
        $addFields: {
          reviewerObjectId: { $toObjectId: "$reviewerId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reviewerObjectId",
          foreignField: "_id",
          as: "reviewer",
        },
      },
      { $unwind: { path: "$reviewer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: { $toString: "$_id" },
          bookingId: 1,
          hotelId: 1,
          reviewerId: 1,
          reviewerName: { $ifNull: ["$reviewer.full_name", "Guest"] },
          ratings: 1,
          comment: 1,
          overallRating: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];
  }

  async findByHotelId(
    hotelId: string,
    page: number,
    limit: number,
  ): Promise<{ reviews: IHotelReviewWithReviewer[]; total: number }> {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this._model.aggregate<IHotelReviewWithReviewer>(
        this._buildWithReviewerPipeline({ hotelId }, skip, limit),
      ),
      this._model.countDocuments({ hotelId }),
    ]);
    return { reviews, total };
  }

  async findByOwnerHotelIds(
    hotelIds: string[],
    page: number,
    limit: number,
  ): Promise<{ reviews: IHotelReviewWithReviewer[]; total: number }> {
    const skip = (page - 1) * limit;
    const matchStage = { hotelId: { $in: hotelIds } };
    const [reviews, total] = await Promise.all([
      this._model.aggregate<IHotelReviewWithReviewer>(
        this._buildWithReviewerPipeline(matchStage, skip, limit),
      ),
      this._model.countDocuments(matchStage),
    ]);
    return { reviews, total };
  }

  async findAll(
    filters: IHotelReviewFilters,
    page: number,
    limit: number,
  ): Promise<{ reviews: IHotelReviewWithReviewer[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: RootFilterQuery<IHotelReviewDocument> = {};

    if (filters.minRating !== undefined || filters.maxRating !== undefined) {
      query.overallRating = {};
      if (filters.minRating !== undefined)
        (query.overallRating as Record<string, number>).$gte =
          filters.minRating;
      if (filters.maxRating !== undefined)
        (query.overallRating as Record<string, number>).$lte =
          filters.maxRating;
    }
    if (filters.hotelId) query.hotelId = filters.hotelId;
    if (filters.reviewerId) query.reviewerId = filters.reviewerId;
    if (filters.fromDate || filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate)
        (query.createdAt as Record<string, Date>).$gte = filters.fromDate;
      if (filters.toDate)
        (query.createdAt as Record<string, Date>).$lte = filters.toDate;
    }
    if (filters.search) {
      query.comment = { $regex: filters.search, $options: "i" };
    }

    const [reviews, total] = await Promise.all([
      this._model.aggregate<IHotelReviewWithReviewer>(
        this._buildWithReviewerPipeline(query, skip, limit),
      ),
      this._model.countDocuments(query),
    ]);
    return { reviews, total };
  }
}
