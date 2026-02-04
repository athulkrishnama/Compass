import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IHotelSearchUseCase } from "@application/interfaces/useCase/hotel/hotelSearchUseCase.interface";
import { env } from "@config/envConfig";
import {
  IHotelSearchRequestDTO,
  IHotelSearchResponseDTO,
} from "@domain/dtos/hotel/hotelSearch.dto";
import { HotelMapper } from "@mappers/hotel.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class HotelSearchUseCase implements IHotelSearchUseCase {
  constructor(
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async search(dto: IHotelSearchRequestDTO): Promise<IHotelSearchResponseDTO> {
    const data = await this._hotelRepo.hotelSearch(dto);

    const signedUrlPromises: Promise<void>[] = [];

    for (const hotel of data.hotels) {
      signedUrlPromises.push(
        this._storageService
          .createSignedUrl(hotel.coverImage, env.SIGNED_URL_EXPIRY)
          .then((url) => {
            hotel.coverImage = url;
          }),
      );

      for (const rv of hotel.roomVariants) {
        signedUrlPromises.push(
          this._storageService
            .createSignedUrl(rv.coverImage, env.SIGNED_URL_EXPIRY)
            .then((url) => {
              rv.coverImage = url;
            }),
        );
      }
    }

    await Promise.all(signedUrlPromises);
    return HotelMapper.toHotelSearchResponseDTOFromIHotelWithAggregatedRoomVariantDTO(
      data,
      dto.pageNo,
    );
  }
}
