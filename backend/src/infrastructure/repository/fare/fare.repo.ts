import { IFareRepo } from "@application/interfaces/repository/fare/fare.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";
import { IFareDocument } from "./fareSchema";
import { FareEntity } from "@domain/entities/fare/fare.entity";

@injectable()
export class FareRepo
  extends BaseRepository<FareEntity, IFareDocument>
  implements IFareRepo
{
  constructor(@inject("IFareModel") protected _model: Model<IFareDocument>) {
    super(_model);
  }

  async create(entity: FareEntity): Promise<string> {
    const doc = this.toMongoDoc(entity);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  async update(entity: FareEntity, id?: string): Promise<void> {
    const doc = this.toMongoDoc(entity);
    await this._model.updateOne(
      { _id: id ? new Types.ObjectId(id) : new Types.ObjectId(entity._id) },
      doc,
    );
  }

  toMongoDoc(entity: FareEntity): IFareDocument {
    const doc = new this._model({
      ...(entity._id && { _id: new Types.ObjectId(entity._id) }),
      rider_id: new Types.ObjectId(entity.rider_id),
      pickup_coordinates: {
        type: "Point",
        coordinates: [
          entity.pickup_coordinates.longitude,
          entity.pickup_coordinates.latitude,
        ],
      },
      drop_coordinates: {
        type: "Point",
        coordinates: [
          entity.drop_coordinates.longitude,
          entity.drop_coordinates.latitude,
        ],
      },
      distance_km: entity.distance_km,
      duration_minutes: entity.duration_minutes,
      fare_options: entity.fare_options,
      selected_option: entity.selected_option,
      status: entity.status,
      expires_at: entity.expires_at,
      created_at: entity.created_at,
    });
    return doc;
  }

  toEntity(doc: IFareDocument): FareEntity {
    return {
      _id: doc._id.toString(),
      rider_id: doc.rider_id.toString(),
      pickup_coordinates: {
        latitude: doc.pickup_coordinates.coordinates[1],
        longitude: doc.pickup_coordinates.coordinates[0],
      },
      drop_coordinates: {
        latitude: doc.drop_coordinates.coordinates[1],
        longitude: doc.drop_coordinates.coordinates[0],
      },
      distance_km: doc.distance_km,
      duration_minutes: doc.duration_minutes,
      fare_options: doc.fare_options.map((fo) => ({
        cab_type: fo.cab_type,
        total_fare: fo.total_fare,
      })),
      selected_option: doc.selected_option
        ? {
            cab_type: doc.selected_option.cab_type,
            total_fare: doc.selected_option.total_fare,
            selected_at: doc.selected_option.selected_at,
          }
        : undefined,
      status: doc.status,
      expires_at: doc.expires_at,
      created_at: doc.created_at,
    };
  }
}
