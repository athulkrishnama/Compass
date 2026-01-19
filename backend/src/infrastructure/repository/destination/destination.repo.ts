import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { DestinationEntity } from "@domain/entities/destination/destination";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destinationSchema";
import { Model, RootFilterQuery, Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { VALUES } from "@presentation/constants/values";
import { ACTIVITY_TYPE } from "@domain/enums/activityType";

@injectable()
export class DestinationRepo
  extends BaseRepository<DestinationEntity, IDestinationDocument>
  implements IDestinationRepo
{
  constructor(
    @inject("IDestinationModel") protected model: Model<IDestinationDocument>,
  ) {
    super(model);
  }

  async findByQuery(filter: {
    query?: string;
    type?: DESTINATION_TYPES[];
    isActive?: boolean;
    isFree?: boolean;
    pageNo: number;
  }): Promise<{
    destinations: DestinationEntity[];
    totalDestinations: number;
    pageNo: number;
    totalPages: number;
  }> {
    const query: RootFilterQuery<IDestinationDocument> = {};

    if (filter.query) {
      query.$or = [
        { name: { $regex: filter.query, $options: "i" } },
        { tagline: { $regex: filter.query, $options: "i" } },
        { description: { $regex: filter.query, $options: "i" } },
        { country: { $regex: filter.query, $options: "i" } },
        { city: { $regex: filter.query, $options: "i" } },
      ];
    }

    if (filter.type?.length) {
      query.type = { $in: filter.type };
    }

    if (typeof filter.isActive === "boolean") {
      query.isActive = filter.isActive;
    }
    if (typeof filter.isFree === "boolean") {
      query.isFree = filter.isFree;
    }

    const totalDestinations = await this.model.countDocuments(query);
    const totalPages = Math.ceil(totalDestinations / VALUES.DESTINATIONS_LIMIT);
    const destinations = await this.model
      .find(query)
      .skip((filter.pageNo - 1) * VALUES.DESTINATIONS_LIMIT)
      .limit(VALUES.DESTINATIONS_LIMIT)
      .exec()
      .then((docs) => docs.map((doc) => this.toEntity(doc)));

    return {
      destinations,
      totalDestinations,
      pageNo: filter.pageNo,
      totalPages,
    };
  }

  async create(data: DestinationEntity): Promise<string> {
    const doc = this.toMongoDoc(data);
    const result = await this.model.create(doc);
    return result._id.toString();
  }

  async update(entity: DestinationEntity, id: string): Promise<void> {
    const doc = this.toMongoDoc(entity);
    await this.model.findByIdAndUpdate(id, doc);
  }
  async advancedFindByQuery(filter: {
    pageNo: number;
    queryString?: string;
    type?: DESTINATION_TYPES[];
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    city?: [number, number];
    proximityRadius?: number;
    activities?: ACTIVITY_TYPE[];
  }): Promise<{ destinations: DestinationEntity[] }> {
    const query: RootFilterQuery<IDestinationDocument> = {};

    if (filter.queryString) {
      query.$or = [
        { name: { $regex: filter.queryString, $options: "i" } },
        { tagline: { $regex: filter.queryString, $options: "i" } },
        { description: { $regex: filter.queryString, $options: "i" } },
        { country: { $regex: filter.queryString, $options: "i" } },
        { city: { $regex: filter.queryString, $options: "i" } },
      ];
    }

    if (filter.type?.length) {
      query.type = { $in: filter.type };
    }

    if (typeof filter.isActive === "boolean") {
      query.isActive = filter.isActive;

      if (filter.activities?.length) {
        query.activities = { $all: filter.activities };
      }
    }

    if (filter.minPrice) {
      query.isFree = false;
      query.entryFee = { $gte: filter.minPrice };
    }

    if (filter.maxPrice) {
      query.isFree = false;
      query.entryFee = { $lte: filter.maxPrice };
    }

    if (filter.city && filter.proximityRadius) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: filter.city,
          },
          $maxDistance: filter.proximityRadius * 1000,
        },
      };
    }

    const docs = await this.model
      .find(query)
      .skip((filter.pageNo - 1) * VALUES.DESTINATIONS_LIMIT)
      .limit(VALUES.DESTINATIONS_LIMIT);
    return { destinations: docs.map((doc) => this.toEntity(doc)) };
  }

  toMongoDoc(entity: DestinationEntity): IDestinationDocument {
    return new this._model({
      _id: new Types.ObjectId(entity._id),
      name: entity.name,
      tagline: entity.tagline,
      description: entity.description,
      coverImage: entity.coverImage,
      images: entity.images,

      country: entity.country,
      city: entity.city,
      pincode: entity.pincode,
      coordinates: {
        type: "Point",
        coordinates: [entity.coordinates[1], entity.coordinates[0]],
      },

      type: entity.type,
      activities: entity.activities,
      bestTimeToVisit: entity.bestTimeToVisit,

      isActive: entity.isActive,
      isWheelChairAccessible: entity.isWheelChairAccessible,
      isAlwaysOpen: entity.isAlwaysOpen,
      isFree: entity.isFree,

      entryFee: entity.entryFee,
      currency: entity.currency,
      openingTime: entity.openingTime,
      closingTime: entity.closingTime,
      closedDays: entity.closedDays,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toEntity(doc: IDestinationDocument): DestinationEntity {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      tagline: doc.tagline,
      description: doc.description,
      coverImage: doc.coverImage,
      images: doc.images,

      country: doc.country,
      city: doc.city,
      pincode: doc.pincode,
      coordinates: [
        doc.coordinates.coordinates[1],
        doc.coordinates.coordinates[0],
      ],

      type: doc.type,
      activities: doc.activities,
      bestTimeToVisit: doc.bestTimeToVisit,

      isActive: doc.isActive,
      isWheelChairAccessible: doc.isWheelChairAccessible,
      isAlwaysOpen: doc.isAlwaysOpen,
      isFree: doc.isFree,

      entryFee: doc.entryFee,
      currency: doc.currency,
      openingTime: doc.openingTime,
      closingTime: doc.closingTime,
      closedDays: doc.closedDays,

      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
