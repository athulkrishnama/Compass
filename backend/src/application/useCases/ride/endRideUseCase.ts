import { IEndRideUseCase } from "@application/interfaces/useCase/ride/endRideUseCase.interface";
import { IEndRideRequestDTO } from "@domain/dtos/ride/endRide.dto";
import { inject, injectable } from "tsyringe";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
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
import { INotificationService } from "@application/interfaces/service/notificationService.interface";
import { NOTIFICATION_TYPES } from "@domain/types/notificationType";

@injectable()
export class EndRideUseCase implements IEndRideUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("INotificationService")
    private _notificationService: INotificationService,
  ) {}

  async execute({ ride_id, driver_id }: IEndRideRequestDTO): Promise<void> {
    const ride = await this._rideRepo.findById(ride_id);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (ride.driver_id !== driver_id) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (ride.status !== RIDE_STATUSES.IN_TRANSIT) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    ride.status = RIDE_STATUSES.COMPLETED;
    ride.events.push({
      event_name: RIDE_EVENT_NAMES.COMPLETED,
      actor: ROLES.CAB,
      timestamp: new Date(),
    });

    await this._rideRepo.update(ride, ride_id);

    console.log(
      `[EndRide] Ride ${ride_id} completed by driver. Status → ${RIDE_STATUSES.COMPLETED}.`,
    );

    this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
      type: RIDER_EVENTS_TYPES.COMPLETED,
      payload: {
        ride_id,
      },
    });

    this._socketEmitter.emitToUser(driver_id, SocketEvents.DRIVER_EVENTS, {
      type: DRIVER_EVENTS_TYPES.COMPLETED,
      payload: {
        ride_id,
      },
    });

    try {
      await this._notificationService.notify(
        ride.rider_id,
        NOTIFICATION_TYPES.RIDE_COMPLETED,
        "Ride Completed",
        "You have arrived at your destination. Thank you for riding with us!",
        { ride_id, driver_id },
      );
    } catch (err) {
      console.error("[EndRideUseCase] Rider notification failed:", err);
    }

    try {
      await this._notificationService.notify(
        driver_id,
        NOTIFICATION_TYPES.RIDE_COMPLETED,
        "Ride Completed",
        "Great job! The ride has been completed successfully.",
        { ride_id, rider_id: ride.rider_id },
      );
    } catch (err) {
      console.error("[EndRideUseCase] Driver notification failed:", err);
    }
  }
}
