import { IRoomLockRepo } from "@application/interfaces/repository/roomLock/roomLock.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { IRoomLockDocument } from "../database configs/schemas/roomLockSchema";
import { RoomLockEntity } from "@domain/entities/roomLock/roomLock.entity";
import { Model, RootFilterQuery } from "mongoose";
import { inject, injectable } from "tsyringe";

@injectable()
export class RoomLockRepo
  extends BaseRepository<RoomLockEntity, IRoomLockDocument>
  implements IRoomLockRepo
{
  constructor(@inject("IRoomLockModel") model: Model<IRoomLockDocument>) {
    super(model);
  }

  async filterRoomLock(filter: {
    roomVariantId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
  }): Promise<RoomLockEntity[]> {
    const filterQuery: RootFilterQuery<IRoomLockDocument> = {};

    if (filter.roomVariantId) {
      filterQuery.roomVariantId = filter.roomVariantId;
    }
    if (filter.checkinDate) {
      filterQuery.checkinDate = filter.checkinDate;
    }
    if (filter.checkoutDate) {
      filterQuery.checkoutDate = filter.checkoutDate;
    }
    if (filter.afterCheckInDate) {
      filterQuery.checkinDate = {
        $gte: filter.afterCheckInDate,
      };
    }
    if (filter.beforeCheckOutDate) {
      filterQuery.checkoutDate = {
        $lte: filter.beforeCheckOutDate,
      };
    }
    if (filter.afterCheckOutDate) {
      filterQuery.checkoutDate = {
        $gte: filter.afterCheckOutDate,
      };
    }
    if (filter.beforeCheckInDate) {
      filterQuery.checkinDate = {
        $lte: filter.beforeCheckInDate,
      };
    }
    const result = await this._model.find(filterQuery).exec();
    return result.map((doc) => this.toEntity(doc));
  }

  async countRoomLock(filter: {
    roomVariantId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
  }): Promise<number> {
    const filterQuery: RootFilterQuery<IRoomLockDocument> = {};

    if (filter.roomVariantId) {
      filterQuery.roomVariantId = filter.roomVariantId;
    }
    if (filter.checkinDate) {
      filterQuery.checkinDate = filter.checkinDate;
    }
    if (filter.checkoutDate) {
      filterQuery.checkoutDate = filter.checkoutDate;
    }
    if (filter.afterCheckInDate) {
      filterQuery.checkinDate = {
        $gte: filter.afterCheckInDate,
      };
    }
    if (filter.beforeCheckOutDate) {
      filterQuery.checkoutDate = {
        $lte: filter.beforeCheckOutDate,
      };
    }
    if (filter.afterCheckOutDate) {
      filterQuery.checkoutDate = {
        $gte: filter.afterCheckOutDate,
      };
    }
    if (filter.beforeCheckInDate) {
      filterQuery.checkinDate = {
        $lte: filter.beforeCheckInDate,
      };
    }
    const result = await this._model.countDocuments(filterQuery).exec();
    return result;
  }

  toEntity(doc: IRoomLockDocument): RoomLockEntity {
    return {
      _id: doc._id.toString(),
      roomVariantId: doc.roomVariantId,
      checkinDate: doc.checkinDate,
      checkoutDate: doc.checkoutDate,
      expiresAt: doc.expiresAt,
    };
  }
}
