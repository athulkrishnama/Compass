import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetHotelsByUserIdUseCase } from "@application/interfaces/useCase/hotel/getHotelsByUserIdUseCase.interface";
import { env } from "@config/envConfig";
import { IHotelListingResponseDTO } from "@domain/dtos/admin/hotelListing.dto";
import { HotelMapper } from "@mappers/hotel.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetHotelsByUserIdUseCase implements IGetHotelsByUserIdUseCase {
  constructor(
    @inject("IHotelRepo")
    private _hotelRepo: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(userId: string): Promise<IHotelListingResponseDTO> {
    const hotels = await this._hotelRepo.getHotelsByUserId(userId);
    const promises = hotels.hotels.map(async (hotel) => {
      hotel.coverImage = await this._storageService.createSignedUrl(
        hotel.coverImage,
        env.SIGNED_URL_EXPIRY,
      );
    });

    await Promise.all(promises);
    return HotelMapper.toHotelListingResponseDTOFromEntity(
      hotels.hotels,
      hotels.count,
    );
  }
}
