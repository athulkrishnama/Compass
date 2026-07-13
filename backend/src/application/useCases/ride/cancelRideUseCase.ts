import { ICancelRideUseCase } from "@application/interfaces/useCase/ride/cancelRideUseCase.interface";
import { ICancelRideRequestDTO } from "@domain/dtos/ride/cancelRide.dto";
import { inject, injectable } from "tsyringe";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
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
import { INotificationService } from "@application/interfaces/service/notificationService.interface";
import { NOTIFICATION_TYPES } from "@domain/types/notificationType";

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
    @inject("ICabRepo") private _cabRepo: ICabRepo,
    @inject("INotificationService")
    private _notificationService: INotificationService,
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
      await this._cabRepo.updateActiveRide(ride.driver_id, null);
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

    // Persist context-aware notifications
    if (cancelledByRole === ROLES.TRAVELER) {
      // Rider cancelled — notify rider confirmation + notify driver if assigned
      try {
        await this._notificationService.notify(
          ride.rider_id,
          NOTIFICATION_TYPES.RIDE_CANCELLED,
          "Ride Cancelled",
          "Your ride has been cancelled successfully.",
          { ride_id },
        );
      } catch (err) {
        console.error("[CancelRideUseCase] Rider notification failed:", err);
      }

      if (ride.driver_id) {
        try {
          await this._notificationService.notify(
            ride.driver_id,
            NOTIFICATION_TYPES.RIDE_CANCELLED,
            "Ride Cancelled by Rider",
            "The rider has cancelled the ride. You are now available for new rides.",
            { ride_id },
          );
        } catch (err) {
          console.error(
            "[CancelRideUseCase] Driver notification (rider cancelled) failed:",
            err,
          );
        }
      }
    } else {
      // Driver cancelled — notify driver confirmation + notify rider
      try {
        await this._notificationService.notify(
          ride.rider_id,
          NOTIFICATION_TYPES.RIDE_CANCELLED,
          "Ride Cancelled by Driver",
          "Your driver has cancelled the ride. We are searching for another driver for you.",
          { ride_id },
        );
      } catch (err) {
        console.error("[CancelRideUseCase] Rider notification failed:", err);
      }

      if (ride.driver_id) {
        try {
          await this._notificationService.notify(
            ride.driver_id,
            NOTIFICATION_TYPES.RIDE_CANCELLED,
            "Ride Cancelled",
            "You have cancelled the ride.",
            { ride_id },
          );
        } catch (err) {
          console.error(
            "[CancelRideUseCase] Driver notification (driver cancelled) failed:",
            err,
          );
        }
      }
    }
  }
}
