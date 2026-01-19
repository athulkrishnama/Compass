import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IRoomVariantDocument } from "@infrastructure/repository/database configs/schemas/roomVariantSchema";

export interface IRoomVariantRepo
  extends BaseRepository<RoomVariantEntity, IRoomVariantDocument> {
  findByHotelId(hotelId: string): Promise<RoomVariantEntity[]>;
  findByName(hotelId: string, name: string): Promise<RoomVariantEntity | null>;
}
