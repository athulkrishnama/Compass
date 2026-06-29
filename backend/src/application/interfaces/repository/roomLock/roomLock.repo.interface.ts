import { RoomLockEntity } from "@domain/entities/roomLock/roomLock.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IRoomLockRepo extends IBaseRepository<RoomLockEntity> {
  filterRoomLock(filter: {
    roomVariantId?: string;
    travelerId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentIntentId?: string;
  }): Promise<RoomLockEntity[]>;

  countRoomLock(filter: {
    roomVariantId?: string;
    travelerId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentIntentId?: string;
  }): Promise<number>;
}
