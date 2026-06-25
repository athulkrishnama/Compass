import { RideEntity } from "@domain/entities/ride/ride.entity";
import { BaseRepository } from "../base/base.repo";
import { IRideDocument } from "./ride.schema";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
@injectable()
export class RideRepo
  extends BaseRepository<RideEntity, IRideDocument>
  implements IRideRepo
{
  constructor(@inject("IRideModel") model: Model<IRideDocument>) {
    super(model);
  }

  async create(data: RideEntity): Promise<string> {
    const doc = this.toMongoDoc(data);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  async update(entity: RideEntity, id: string): Promise<void> {
    const updateData = this.toMongoDoc(entity);
    await this._model.findByIdAndUpdate(id, { $set: updateData });
  }

  async fetchCabActiveRide(driver_id: string): Promise<RideEntity | null> {
    const doc = await this._model.findOne({
      driver_id: new Types.ObjectId(driver_id),
      $or: [
        {
          status: {
            $in: [
              RIDE_STATUSES.MATCHED,
              RIDE_STATUSES.IN_TRANSIT,
              RIDE_STATUSES.ARRIVED,
            ],
          },
        },
        {
          status: RIDE_STATUSES.COMPLETED,
          paymentStatus: { $ne: "SUCCESS" },
        },
      ],
    });
    return doc ? this.toEntity(doc) : null;
  }
  async fetchRiderActiveRide(rider_id: string): Promise<RideEntity | null> {
    const doc = await this._model
      .findOne({
        rider_id: new Types.ObjectId(rider_id),
        $or: [
          {
            status: {
              $in: [
                RIDE_STATUSES.SEARCHING,
                RIDE_STATUSES.MATCHED,
                RIDE_STATUSES.IN_TRANSIT,
                RIDE_STATUSES.ARRIVED,
              ],
            },
          },
          {
            status: RIDE_STATUSES.COMPLETED,
            paymentStatus: { $ne: "SUCCESS" },
          },
        ],
      })
      .sort({ createdAt: -1 }); // Get the most recent one just in case
    return doc ? this.toEntity(doc) : null;
  }

  async fetchRiderPastTrips(
    rider_id: string,
    page: number,
    limit: number,
  ): Promise<{ trips: RideEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = {
      rider_id: new Types.ObjectId(rider_id),
      status: {
        $in: [RIDE_STATUSES.COMPLETED, RIDE_STATUSES.CANCELLED],
      },
    };

    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ _id: -1 }).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);

    return {
      trips: docs.map((doc) => this.toEntity(doc)),
      total,
    };
  }

  toMongoDoc(entity: RideEntity): IRideDocument {
    return new this._model({
      _id: entity._id ? new Types.ObjectId(entity._id) : new Types.ObjectId(),
      rider_id: new Types.ObjectId(entity.rider_id),
      driver_id: entity.driver_id ? new Types.ObjectId(entity.driver_id) : null,
      fare_id: new Types.ObjectId(entity.fare_id),
      selected_fare: entity.selected_fare,
      distance: entity.distance,
      time: entity.time,
      pickup_point: {
        type: "Point",
        coordinates: [
          entity.pickup_point.longitude,
          entity.pickup_point.latitude,
        ],
      },
      dropoff_point: {
        type: "Point",
        coordinates: [
          entity.dropoff_point.longitude,
          entity.dropoff_point.latitude,
        ],
      },
      attempted_drivers: entity.attempted_drivers.map(
        (id) => new Types.ObjectId(id),
      ),
      attempt_id: entity.attempt_id ?? "",
      otp: entity.otp ?? "",
      otp_attempts: entity.otp_attempts,
      status: entity.status,
      cancelled_by: entity.cancelled_by,
      events: entity.events,
      paymentStatus: entity.paymentStatus,
      paymentMethod: entity.paymentMethod,
      remainingAmount: entity.remainingAmount ?? 0,
    });
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
      status: doc.status,
      cancelled_by: doc.cancelled_by,
      events: doc.events
        ? doc.events.map((event) => ({
            event_name: event.event_name,
            actor: event.actor,
            timestamp: event.timestamp,
          }))
        : [],
      paymentStatus: doc.paymentStatus,
      paymentMethod: doc.paymentMethod,
      remainingAmount: doc.remainingAmount ?? 0,
    };
  }
}
