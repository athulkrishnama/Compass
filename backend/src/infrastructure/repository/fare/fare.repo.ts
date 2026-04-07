import { FareEntity } from "@domain/entities/fare/fare.entity";
import { BaseRepository } from "../base/base.repo";
import { IFareDocument } from "./fare.schema";
import { IFareRepo } from "@application/interfaces/repository/fare/fare.repo.interface";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";

@injectable()
export class FareRepo
  extends BaseRepository<FareEntity, IFareDocument>
  implements IFareRepo
{
  constructor(@inject("IFareModel") model: Model<IFareDocument>) {
    super(model);
  }

  async create(data: FareEntity): Promise<string> {
    const doc = this.toMongoDoc(data);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  toMongoDoc(entity: FareEntity): IFareDocument {
    return new this._model({
      _id: entity._id ? new Types.ObjectId(entity._id) : new Types.ObjectId(),
      rider_id: new Types.ObjectId(entity.rider_id),
      pickup_location: {
        type: "Point",
        coordinates: [
          entity.pickup_location.longitude,
          entity.pickup_location.latitude,
        ],
      },
      dropoff_location: {
        type: "Point",
        coordinates: [
          entity.dropoff_location.longitude,
          entity.dropoff_location.latitude,
        ],
      },
      distance: entity.distance,
      time: entity.time,
      created_at: entity.created_at,
      expires_at: entity.expires_at,
      status: entity.status,
      fares: entity.fares,
    });
  }

  toEntity(doc: IFareDocument): FareEntity {
    return {
      _id: doc._id.toString(),
      rider_id: doc.rider_id.toString(),
      pickup_location: {
        longitude: doc.pickup_location.coordinates[0],
        latitude: doc.pickup_location.coordinates[1],
      },
      dropoff_location: {
        longitude: doc.dropoff_location.coordinates[0],
        latitude: doc.dropoff_location.coordinates[1],
      },
      distance: doc.distance,
      time: doc.time,
      created_at: doc.created_at,
      expires_at: doc.expires_at,
      status: doc.status as any,
      fares: doc.fares,
    };
  }
}
