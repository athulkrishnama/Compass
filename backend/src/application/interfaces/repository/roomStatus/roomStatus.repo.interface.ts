import { RoomStatusEntity } from "@domain/entities/roomStatus/roomStatus.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IRoomStatusDocument } from "@infrastructure/repository/roomStatus/roomStatusSchema";

export interface IRoomStatusRepo
  extends BaseRepository<RoomStatusEntity, IRoomStatusDocument> {
  findByRoomVariantId(roomVariantId: string): Promise<RoomStatusEntity[]>;
  findByRoomVariantIdAndRoomNumber(
    roomVariantId: string,
    roomNumber: number,
  ): Promise<RoomStatusEntity | null>;
}
