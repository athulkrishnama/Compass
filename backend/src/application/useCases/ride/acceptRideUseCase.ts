import { IAcceptRideUseCase } from "@application/interfaces/useCase/ride/acceptRideUseCase.interface";
import { IAcceptRideRequestDTO } from "@domain/dtos/ride/acceptRide.dto";
import { inject, injectable } from "tsyringe";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { IQueueService } from "@application/interfaces/service/queueService.interface";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { RIDE_EVENT_NAMES } from "@domain/types/rideEvent";
import { ROLES } from "@domain/enums/roles";
import { SocketEvents } from "@presentation/constants/socketEvents";
import {
  DRIVER_EVENTS_TYPES,
  RIDER_EVENTS_TYPES,
} from "@domain/types/socketPayloads";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import {
  InvalideDataException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";

@injectable()
export class AcceptRideUseCase implements IAcceptRideUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("IQueueService") private _queueService: IQueueService,
  ) {}

  async execute({
    ride_id,
    rider_id,
    attempt_id,
  }: IAcceptRideRequestDTO): Promise<void> {
    const ride = await this._rideRepo.findById(ride_id);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (ride.status !== RIDE_STATUSES.SEARCHING) {
      console.log(
        `[AcceptRide] Ride ${ride_id} is '${ride.status}', not searching. Ignoring accept from driver ${rider_id}.`,
      );
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    if (!ride.attempt_id || attempt_id !== ride.attempt_id) {
      console.log(
        `[AcceptRide] Stale attempt ${attempt_id} for ride ${ride_id}. Current: ${ride.attempt_id}. Ignoring.`,
      );
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    const lastAttemptedDriver =
      ride.attempted_drivers[ride.attempted_drivers.length - 1];
    if (!lastAttemptedDriver || lastAttemptedDriver !== rider_id) {
      console.log(
        `[AcceptRide] Driver ${rider_id} is not the current candidate for ride ${ride_id}. Ignoring.`,
      );
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.UNAUTHORIZED);
    }

    const now = new Date();

    ride.status = RIDE_STATUSES.MATCHED;
    ride.driver_id = rider_id;
    ride.attempt_id = null;
    ride.events.push({
      event_name: RIDE_EVENT_NAMES.ACCEPTED,
      actor: ROLES.CAB,
      timestamp: now,
    });

    await this._rideRepo.update(ride, ride_id);

    console.log(
      `[AcceptRide] Ride ${ride_id} accepted by driver ${rider_id}. Status → ${RIDE_STATUSES.MATCHED}.`,
    );

    try {
      await this._queueService.removeJob(attempt_id);
    } catch (err) {
      console.warn(
        `[AcceptRide] Could not remove queue job for attempt ${attempt_id}:`,
        err,
      );
    }

    this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
      type: RIDER_EVENTS_TYPES.ASSIGNED,
      payload: {
        ride_id,
        driver_id: rider_id,
        otp: ride.otp,
      },
    });

    this._socketEmitter.emitToUser(rider_id, SocketEvents.DRIVER_EVENTS, {
      type: DRIVER_EVENTS_TYPES.ACCEPTED,
      payload: {
        ride_id,
        rider_id: ride.rider_id,
      },
    });
  }
}
