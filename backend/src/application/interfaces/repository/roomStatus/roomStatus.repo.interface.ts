import { RoomStatusEntity } from "@domain/entities/roomStatus/roomStatus.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IRoomStatusRepo extends IBaseRepository<RoomStatusEntity> {
  findByRoomVariantId(roomVariantId: string): Promise<RoomStatusEntity[]>;
  findByRoomVariantIdAndRoomNumber(
    roomVariantId: string,
    roomNumber: number,
  ): Promise<RoomStatusEntity | null>;
  findByRoomVariantIdAndDateRange(
    roomVariantId: string,
    checkinDate: Date,
    checkoutDate: Date,
  ): Promise<RoomStatusEntity[]>;
}
