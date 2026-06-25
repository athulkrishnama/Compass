import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IRoomVariantRepo extends IBaseRepository<RoomVariantEntity> {
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
