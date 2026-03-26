import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";
import { IRideDocument } from "./rideSchema";
import { RideEntity } from "@domain/entities/ride/ride.entity";

@injectable()
export class RideRepo
  extends BaseRepository<RideEntity, IRideDocument>
  implements IRideRepo
{
  constructor(@inject("IRideModel") protected _model: Model<IRideDocument>) {
    super(_model);
  }

  async create(entity: RideEntity): Promise<string> {
    const doc = this.toMongoDoc(entity);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  async update(entity: RideEntity, id?: string): Promise<void> {
    const doc = this.toMongoDoc(entity);
    const updateData = doc.toObject();
    delete updateData._id;

    await this._model.updateOne(
      { _id: id ? new Types.ObjectId(id) : new Types.ObjectId(entity._id) },
      { $set: updateData },
    );
  }

  toMongoDoc(entity: RideEntity): IRideDocument {
    const doc = new this._model({
      ...(entity._id && { _id: new Types.ObjectId(entity._id) }),
      rider_id: new Types.ObjectId(entity.rider_id),
      driver_id: entity.driver_id
        ? new Types.ObjectId(entity.driver_id)
        : undefined,
      fare_estimate_id: new Types.ObjectId(entity.fare_estimate_id),
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
      cab_type: entity.cab_type,
      fare_snapshot: {
        cab_type: entity.fare_snapshot.cab_type,
        total_fare: entity.fare_snapshot.total_fare,
        selected_at: entity.fare_snapshot.selected_at,
      },
      status: entity.status,
      current_attempt_id: entity.current_attempt_id,
      attempted_driver_ids: entity.attempted_driver_ids,
      current_radius_km: entity.current_radius_km,
      actual_distance_km: entity.actual_distance_km,
      actual_duration_minutes: entity.actual_duration_minutes,
      final_fare: entity.final_fare,
      timeline: entity.timeline.map((te) => ({
        event: te.event,
        actor: te.actor,
        timestamp: te.timestamp,
      })),
      payment_id: entity.payment_id,
      created_at: entity.created_at || new Date(),
      updated_at: entity.updated_at || new Date(),
    });
    return doc;
  }

  toEntity(doc: IRideDocument): RideEntity {
    return {
      _id: doc._id.toString(),
      rider_id: doc.rider_id.toString(),
      driver_id: doc.driver_id ? doc.driver_id.toString() : undefined,
      fare_estimate_id: doc.fare_estimate_id.toString(),
      pickup_coordinates: {
        latitude: doc.pickup_coordinates.coordinates[1],
        longitude: doc.pickup_coordinates.coordinates[0],
      },
      drop_coordinates: {
        latitude: doc.drop_coordinates.coordinates[1],
        longitude: doc.drop_coordinates.coordinates[0],
      },
      cab_type: doc.cab_type,
      fare_snapshot: {
        cab_type: doc.fare_snapshot.cab_type,
        total_fare: doc.fare_snapshot.total_fare,
        selected_at: doc.fare_snapshot.selected_at,
      },
      status: doc.status,
      current_attempt_id: doc.current_attempt_id,
      attempted_driver_ids: doc.attempted_driver_ids,
      current_radius_km: doc.current_radius_km,
      actual_distance_km: doc.actual_distance_km,
      actual_duration_minutes: doc.actual_duration_minutes,
      final_fare: doc.final_fare,
      timeline: doc.timeline.map((te) => ({
        event: te.event,
        actor: te.actor,
        timestamp: te.timestamp,
      })),
      payment_id: doc.payment_id,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  }
}
