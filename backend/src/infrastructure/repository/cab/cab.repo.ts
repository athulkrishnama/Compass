import { CabEntity } from "@domain/entities/cab/cab.entity";
import { BaseRepository } from "../base/base.repo";
import { ICabDocument } from "./cabSchema";
import { inject, injectable } from "tsyringe";
import { Model, Types, ClientSession, UpdateQuery } from "mongoose";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";

@injectable()
export class CabRepo
  extends BaseRepository<CabEntity, ICabDocument>
  implements ICabRepo
{
  constructor(@inject("ICabModel") protected _model: Model<ICabDocument>) {
    super(_model);
  }

  async findByUserId(userId: string): Promise<CabEntity | null> {
    const cab = await this._model.findOne({ userId });
    if (cab) {
      return this.toEntity(cab);
    }
    return null;
  }

  async update(e: CabEntity, id: string): Promise<void> {
    await this._model.updateOne({ _id: id }, this.toMongoDoc(e));
  }

  toMongoDoc(entity: CabEntity): ICabDocument {
    const userMongoDoc = new this._model({
      _id: new Types.ObjectId(entity._id),
      userId: entity.userId,
      isOnline: entity.isOnline,
      active_ride_id: entity.active_ride_id
        ? new Types.ObjectId(entity.active_ride_id)
        : null,
      vehicleDetails: entity.vehicleDetails,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    if (entity.baseLocation) {
      userMongoDoc.baseLocation = {
        city: entity.baseLocation.city,
        coordinates: {
          type: "Point",
          coordinates: [
            entity.baseLocation.coordinates[1],
            entity.baseLocation.coordinates[0],
          ],
        },
      };
    }
    return userMongoDoc;
  }

  toEntity(doc: ICabDocument): CabEntity {
    const entity: CabEntity = {
      _id: doc._id.toString(),
      userId: doc.userId,
      isOnline: doc.isOnline,
      active_ride_id: doc.active_ride_id
        ? doc.active_ride_id.toString()
        : undefined,
      vehicleDetails: doc.vehicleDetails,
      averageRating: doc.averageRating,
      totalReviews: doc.totalReviews,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    if (doc.baseLocation) {
      entity.baseLocation = {
        city: doc.baseLocation.city,
        coordinates: [
          doc.baseLocation.coordinates.coordinates[1],
          doc.baseLocation.coordinates.coordinates[0],
        ],
      };
    }
    return entity;
  }

  async countCabs(): Promise<number> {
    return await this._model.countDocuments();
  }

  async updateActiveRide(
    driverId: string,
    rideId: string | null,
    session?: IDbSession,
  ): Promise<void> {
    const update: UpdateQuery<ICabDocument> = {};
    if (rideId) {
      update.$set = { active_ride_id: new Types.ObjectId(rideId) };
    } else {
      update.$unset = { active_ride_id: 1 };
    }

    if (session) {
      await this._model.updateOne({ userId: driverId }, update, {
        session: session as ClientSession,
      });
    } else {
      await this._model.updateOne({ userId: driverId }, update);
    }
  }

  async updateRating(
    cabId: string,
    averageRating: number,
    totalReviews: number,
  ): Promise<void> {
    await this._model.findByIdAndUpdate(cabId, {
      $set: { averageRating, totalReviews },
    });
  }
}
