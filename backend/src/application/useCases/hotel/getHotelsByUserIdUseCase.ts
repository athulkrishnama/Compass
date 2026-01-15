import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IGetHotelsByUserIdUseCase } from "@application/interfaces/useCase/hotel/getHotelsByUserIdUseCase.interface";
import { IHotelListingResponseDTO } from "@domain/dtos/admin/hotelListing.dto";
import { HotelMapper } from "@mappers/hotel.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetHotelsByUserIdUseCase implements IGetHotelsByUserIdUseCase {
  constructor(
    @inject("IHotelRepo")
    private _hotelRepo: IHotelRepo,
  ) {}

  async execute(userId: string): Promise<IHotelListingResponseDTO> {
    const hotels = await this._hotelRepo.getHotelsByUserId(userId);
    return HotelMapper.toHotelListingResponseDTOFromEntity(
      hotels.hotels,
      hotels.count,
    );
  }
}
