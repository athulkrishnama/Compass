import { RoomEntity } from "@domain/entities/room/room.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IRoomDocument } from "@infrastructure/repository/database configs/schemas/roomSchema";

export interface IRoomRepo extends BaseRepository<RoomEntity, IRoomDocument> {
  findByHotelId(hotelId: string): Promise<RoomEntity[]>;
  findByCode(hotelId: string, code: string): Promise<RoomEntity | null>;
}
