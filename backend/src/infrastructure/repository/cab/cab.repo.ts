import { CabEntity } from "@domain/entities/cab/cab.entity";
import { BaseRepository } from "../base/base.repo";
import { ICabDocument } from "./cabSchema";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";

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
      vehicleDetails: doc.vehicleDetails,
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
}
