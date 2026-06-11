import { ICreateRideUseCase } from "@application/interfaces/useCase/ride/createRideUseCase.interface";
import { createRideRequestDTO } from "@domain/dtos/ride/createRide.dto";
import { inject, injectable } from "tsyringe";
import { IFareRepo } from "@application/interfaces/repository/fare/fare.repo.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { IOtpService } from "@application/interfaces/service/otpService.interface";
import { IQueueService } from "@application/interfaces/service/queueService.interface";
import { RideEntity } from "@domain/entities/ride/ride.entity";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { RIDE_EVENT_NAMES } from "@domain/types/rideEvent";
import {
  InvalideDataException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { QUEUE_JOB_NAMES } from "@domain/constants/queueJobNames";
import { ITokenService } from "@application/interfaces/service/tokenService.interface";

@injectable()
export class CreateRideUseCase implements ICreateRideUseCase {
  constructor(
    @inject("IFareRepo") private _fareRepo: IFareRepo,
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("IOtpService") private _otpService: IOtpService,
    @inject("IQueueService") private _queueService: IQueueService,
    @inject("ITokenService") private _tokenSerivce: ITokenService,
  ) {}

  async execute({
    fareId,
    userId,
    vehicleType,
  }: createRideRequestDTO): Promise<string> {
    const fare = await this._fareRepo.findById(fareId);
    if (!fare) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.FARE_NOT_FOUND,
      );
    }

    if (new Date() > fare.expires_at) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.FARE_EXPIRED);
    }

    const selectedFare = fare.fares.find((f) => f.cab_type === vehicleType);
    if (!selectedFare) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.INVALID_VEHICLE_TYPE,
      );
    }

    const otp = this._otpService.generateOtp(4);

    const now = new Date();
    const ride: RideEntity = {
      _id: "",
      rider_id: userId,
      driver_id: null,
      fare_id: fareId,
      selected_fare: selectedFare,
      distance: fare.distance,
      time: fare.time,
      pickup_point: fare.pickup_location,
      dropoff_point: fare.dropoff_location,
      attempted_drivers: [],
      attempt_id: this._tokenSerivce.createToken(),
      otp,
      otp_attempts: 0,
      status: RIDE_STATUSES.SEARCHING,
      cancelled_by: null,
      events: [
        {
          event_name: RIDE_EVENT_NAMES.REQUESTED,
          actor: userId,
          timestamp: now,
        },
      ],
    };

    const rideId = await this._rideRepo.create(ride);

    await this._queueService.addJob(QUEUE_JOB_NAMES.MATCH_DRIVER, {
      ride_id: rideId,
      job_id: this._tokenSerivce.createToken(),
    });

    return rideId;
  }
}
