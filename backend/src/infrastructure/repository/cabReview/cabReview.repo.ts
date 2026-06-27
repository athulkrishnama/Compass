import { CabReviewEntity } from "@domain/entities/cabReview/cabReview.entity";
import { BaseRepository } from "../base/base.repo";
import { ICabReviewDocument } from "./cabReviewSchema";
import {
  ICabReviewRepo,
  ICabReviewFilters,
} from "@application/interfaces/repository/cabReview/cabReview.repo.interface";
import { inject, injectable } from "tsyringe";
import { Model, RootFilterQuery } from "mongoose";

@injectable()
export class CabReviewRepo
  extends BaseRepository<CabReviewEntity, ICabReviewDocument>
  implements ICabReviewRepo
{
  constructor(@inject("ICabReviewModel") model: Model<ICabReviewDocument>) {
    super(model);
  }

  toEntity(doc: ICabReviewDocument): CabReviewEntity {
    return {
      _id: doc._id.toString(),
      rideId: doc.rideId,
      riderId: doc.riderId,
      driverId: doc.driverId,
      cabId: doc.cabId,
      rating: doc.rating,
      review: doc.review,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByRideId(rideId: string): Promise<CabReviewEntity | null> {
    const doc = await this._model.findOne({ rideId });
    return doc ? this.toEntity(doc) : null;
  }

  async findByDriverId(
    driverId: string,
    page: number,
    limit: number,
  ): Promise<{ reviews: CabReviewEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = { driverId };
    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);
    return { reviews: docs.map((d) => this.toEntity(d)), total };
  }

  async findAll(
    filters: ICabReviewFilters,
    page: number,
    limit: number,
  ): Promise<{ reviews: CabReviewEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: RootFilterQuery<ICabReviewDocument> = {};

    if (filters.rating) query.rating = filters.rating;
    if (filters.driverId) query.driverId = filters.driverId;
    if (filters.riderId) query.riderId = filters.riderId;
    if (filters.fromDate || filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate)
        (query.createdAt as Record<string, Date>).$gte = filters.fromDate;
      if (filters.toDate)
        (query.createdAt as Record<string, Date>).$lte = filters.toDate;
    }
    if (filters.search) {
      query.review = { $regex: filters.search, $options: "i" };
    }

    const [docs, total] = await Promise.all([
      this._model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this._model.countDocuments(query),
    ]);
    return { reviews: docs.map((d) => this.toEntity(d)), total };
  }
}
