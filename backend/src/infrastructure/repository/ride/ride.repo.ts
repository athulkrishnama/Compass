import { RideEntity } from "@domain/entities/ride/ride.entity";
import { BaseRepository } from "../base/base.repo";
import { IRideDocument } from "./ride.schema";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";

@injectable()
export class RideRepo
  extends BaseRepository<RideEntity, IRideDocument>
  implements IRideRepo
{
  constructor(@inject("IRideModel") model: Model<IRideDocument>) {
    super(model);
  }

  toEntity(doc: IRideDocument): RideEntity {
    return {
      _id: doc._id.toString(),
      rider_id: doc.rider_id.toString(),
      driver_id: doc.driver_id ? doc.driver_id.toString() : null,
      fare_id: doc.fare_id.toString(),
      selected_fare: doc.selected_fare,
      distance: doc.distance,
      time: doc.time,
      pickup_point: {
        longitude: doc.pickup_point.coordinates[0],
        latitude: doc.pickup_point.coordinates[1],
      },
      dropoff_point: {
        longitude: doc.dropoff_point.coordinates[0],
        latitude: doc.dropoff_point.coordinates[1],
      },
      attempted_drivers: doc.attempted_drivers
        ? doc.attempted_drivers.map((id) => id.toString())
        : [],
      attempt_id: doc.attempt_id,
      otp: doc.otp,
      otp_attempts: doc.otp_attempts,
      status: doc.status as any,
      cancelled_by: doc.cancelled_by as any,
      events: doc.events
        ? doc.events.map((event) => ({
            event_name: event.event_name as any,
            actor: event.actor,
            timestamp: event.timestamp,
          }))
        : [],
    };
  }
}
