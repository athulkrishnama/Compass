import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { DestinationEntity } from "@domain/entities/destination/destination";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destination";
import { Model, Types } from "mongoose";
import { inject, injectable } from "tsyringe";

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

  async findByQuery(
    query: Record<string, string | string[]>,
  ): Promise<DestinationEntity[]> {
    return this.model
      .find(query)
      .exec()
      .then((docs) => docs.map((doc) => this.toEntity(doc)));
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
      state: entity.state,
      city: entity.city,
      pincode: entity.pincode,
      coordinates: {
        type: "Point",
        coordinates: entity.coordinates,
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
      state: doc.state,
      city: doc.city,
      pincode: doc.pincode,
      coordinates: [
        doc.coordinates.coordinates[0],
        doc.coordinates.coordinates[1],
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
