import { ICancelRideUseCase } from "@application/interfaces/useCase/ride/cancelRideUseCase.interface";
import { ICancelRideRequestDTO } from "@domain/dtos/ride/cancelRide.dto";
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

const CANCELLABLE_STATUSES = [
  RIDE_STATUSES.SEARCHING,
  RIDE_STATUSES.MATCHED,
  RIDE_STATUSES.ARRIVED,
  RIDE_STATUSES.IN_TRANSIT,
] as const;

@injectable()
export class CancelRideUseCase implements ICancelRideUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("IQueueService") private _queueService: IQueueService,
  ) {}

  async execute({ ride_id, user_id }: ICancelRideRequestDTO): Promise<void> {
    const ride = await this._rideRepo.findById(ride_id);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    let cancelledByRole: ROLES;
    if (ride.rider_id === user_id) {
      cancelledByRole = ROLES.TRAVELER;
    } else if (ride.driver_id === user_id) {
      cancelledByRole = ROLES.CAB;
    } else {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.UNAUTHORIZED);
    }
    if (
      !CANCELLABLE_STATUSES.includes(
        ride.status as (typeof CANCELLABLE_STATUSES)[number],
      )
    ) {
      console.log(
        `[CancelRide] Ride ${ride_id} is '${ride.status}', cannot be cancelled by user.`,
      );
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    const now = new Date();

    ride.status = RIDE_STATUSES.CANCELLED;
    ride.cancelled_by = cancelledByRole;
    ride.events.push({
      event_name: RIDE_EVENT_NAMES.CANCELLED,
      actor: cancelledByRole,
      timestamp: now,
    });

    await this._rideRepo.update(ride, ride_id);

    console.log(
      `[CancelRide] Ride ${ride_id} cancelled by user ${user_id}. Was in status '${ride.status}'.`,
    );

    if (ride.attempt_id) {
      try {
        await this._queueService.removeJob(ride.attempt_id);
      } catch (err) {
        console.warn(
          `[CancelRide] Could not remove queue job for attempt ${ride.attempt_id}:`,
          err,
        );
      }
    }

    if (ride.driver_id) {
      this._socketEmitter.emitToUser(
        ride.driver_id,
        SocketEvents.DRIVER_EVENTS,
        {
          type: DRIVER_EVENTS_TYPES.CANCELLED,
          payload: {
            ride_id,
            message: RIDER_EVENTS_TYPES.CANCELLED,
          },
        },
      );
    }

    this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
      type: RIDER_EVENTS_TYPES.CANCELLED,
      payload: {
        ride_id,
        message: RIDER_EVENTS_TYPES.CANCELLED,
      },
    });
  }
}
