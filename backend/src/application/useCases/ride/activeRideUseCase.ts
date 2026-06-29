import { IActiveRideDetailsUseCase } from "@application/interfaces/useCase/ride/activeRideDetailsUseCase.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IActiveRideDetailsResponseDTO } from "@domain/dtos/ride/activeRideDetails.dto";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";
import { RideMapper } from "@mappers/rideMapper";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { env } from "@config/envConfig";

@injectable()
export class ActiveRideUseCase implements IActiveRideDetailsUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IStorageService") private _storageService: IStorageService,
    @inject("ICabRepo") private _cabRepo: ICabRepo,
  ) {}

  async execute(
    driverId: string,
  ): Promise<IActiveRideDetailsResponseDTO | null> {
    const cab = await this._cabRepo.findByUserId(driverId);
    if (!cab || !cab.active_ride_id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    const ride = await this._rideRepo.findById(cab.active_ride_id);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    const rider = await this._userRepo.findById(ride.rider_id);
    if (!rider) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND,
      );
    }
    if (rider.profile_image) {
      rider.profile_image = await this._storageService.createSignedUrl(
        rider.profile_image,
        env.SIGNED_URL_EXPIRY,
      );
    }
    return RideMapper.toActiveRideDetailsResponseDTO(ride, rider);
  }
}
