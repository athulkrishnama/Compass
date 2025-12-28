import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetCabDetailsUseCase } from "@application/interfaces/useCase/cab/getCabDetailsUseCase.interface";
import { env } from "@config/envConfig";
import { IGetCabDetailsResponseDTO } from "@domain/dtos/cab/getCabDetails.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { CabMapper } from "@mappers/cab.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetCabDetailsUseCase implements IGetCabDetailsUseCase {
  constructor(
    @inject("ICabRepo") private _cabRepo: ICabRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(id: string): Promise<IGetCabDetailsResponseDTO> {
    const cab = await this._cabRepo.findByUserId(id);
    if (!cab || !cab._id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.CAB_NOT_FOUND,
      );
    }
    if (cab.vehicleDetails?.images) {
      cab.vehicleDetails.images = await Promise.all(
        cab.vehicleDetails.images.map(async (img) =>
          this._storageService.createSignedUrl(img, env.SIGNED_URL_EXPIRY),
        ),
      );
    }
    return CabMapper.toGetCabDetailsResponseDTOfromEntity(cab);
  }
}
