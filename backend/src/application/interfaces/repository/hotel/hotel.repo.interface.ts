import { IHotelWithAggregatedRoomVariantDTO } from "@domain/dtos/hotel/hotelSearch.dto";
import { HotelEntity } from "@domain/entities/hotel/hotel.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IHotelRepo extends IBaseRepository<HotelEntity> {
  findHotelByName(name: string): Promise<HotelEntity | null>;
  getHotelsByUserId(
    userId: string,
  ): Promise<{ hotels: HotelEntity[]; count: number }>;

  hotelSearch(filter: {
    queryString?: string;
    city?: [number, number];
    proximityRadius?: number;
    checkInDate?: Date;
    checkOutDate?: Date;
    guests?: number;
    maxPrice?: number;
    minPrice?: number;
    pageNo: number;
  }): Promise<IHotelWithAggregatedRoomVariantDTO>;
  countHotels(): Promise<number>;
}
