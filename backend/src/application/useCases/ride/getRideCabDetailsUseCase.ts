import { IGetRideCabDetailsUseCase } from "@application/interfaces/useCase/ride/getRideCabDetailsUseCase.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { RideCabDetailsResponseDTO } from "@domain/dtos/ride/rideCabDetails.dto";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";
import { RideMapper } from "@mappers/rideMapper";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";

@injectable()
export class GetRideCabDetailsUseCase implements IGetRideCabDetailsUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ICabRepo") private _cabRepo: ICabRepo,
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(rideId: string): Promise<RideCabDetailsResponseDTO> {
    const ride = await this._rideRepo.findById(rideId);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (!ride.driver_id) {
      throw new ResourceNotFoundException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    const driver = await this._userRepo.findById(ride.driver_id);
    if (!driver) {
      throw new ResourceNotFoundException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    const cab = await this._cabRepo.findByUserId(ride.driver_id);
    if (!cab) {
      throw new ResourceNotFoundException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    if (driver.profile_image) {
      driver.profile_image = await this._storageService.createSignedUrl(
        driver.profile_image,
        env.SIGNED_URL_EXPIRY,
      );
    }

    if (cab.vehicleDetails?.images && cab.vehicleDetails.images.length > 0) {
      cab.vehicleDetails.images = await Promise.all(
        cab.vehicleDetails.images.map((image) =>
          this._storageService.createSignedUrl(image, env.SIGNED_URL_EXPIRY),
        ),
      );
    }

    return RideMapper.toRideCabDetailsResponseDTO(driver, cab);
  }
}
