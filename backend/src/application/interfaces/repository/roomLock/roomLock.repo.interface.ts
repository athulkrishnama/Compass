import { RoomLockEntity } from "@domain/entities/roomLock/roomLock.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IRoomLockDocument } from "@infrastructure/repository/database configs/schemas/roomLockSchema";

export interface IRoomLockRepo
  extends BaseRepository<RoomLockEntity, IRoomLockDocument> {
  filterRoomLock(filter: {
    roomVariantId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
  }): Promise<RoomLockEntity[]>;

  countRoomLock(filter: {
    roomVariantId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
  }): Promise<number>;
}
