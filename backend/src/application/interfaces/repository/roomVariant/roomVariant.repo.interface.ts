import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IRoomVariantDocument } from "@infrastructure/repository/roomVariant/roomVariantSchema";

export interface IRoomVariantRepo
  extends BaseRepository<RoomVariantEntity, IRoomVariantDocument> {
  findByHotelId(hotelId: string): Promise<RoomVariantEntity[]>;
  findByName(hotelId: string, name: string): Promise<RoomVariantEntity | null>;
  findByPrefix(
    hotelId: string,
    prefix: string,
  ): Promise<RoomVariantEntity | null>;

  getTotalRoomsByHotelIds(
    hotelIds: string[],
  ): Promise<{ hotelId: string; totalRooms: number }[]>;
}
