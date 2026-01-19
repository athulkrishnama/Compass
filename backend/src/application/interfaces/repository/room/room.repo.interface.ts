import { RoomEntity } from "@domain/entities/room/roomEntity";
import { IRoomDocument } from "@infrastructure/repository/database configs/schemas/roomSchema";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IRoomRepo extends IBaseRepository<RoomEntity, IRoomDocument> {
  findByVariantId(variantId: string): Promise<RoomEntity[]>;
  findRoomByVariantAndCode(
    variantId: string,
    roomCode: string,
  ): Promise<RoomEntity | null>;
}
