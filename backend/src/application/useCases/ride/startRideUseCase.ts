import { IStartRideUseCase } from "@application/interfaces/useCase/ride/startRideUseCase.interface";
import { IStartRideRequestDTO } from "@domain/dtos/ride/startRide.dto";
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
export class StartRideUseCase implements IStartRideUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("INotificationService")
    private _notificationService: INotificationService,
  ) {}

  async execute({
    ride_id,
    driver_id,
    otp,
  }: IStartRideRequestDTO): Promise<void> {
    const ride = await this._rideRepo.findById(ride_id);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (ride.driver_id !== driver_id) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (ride.status !== RIDE_STATUSES.ARRIVED) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    if (ride.otp !== otp) {
      throw new InvalideDataException("Invalid OTP"); // Or a specific error
    }

    ride.status = RIDE_STATUSES.IN_TRANSIT;
    ride.events.push({
      event_name: RIDE_EVENT_NAMES.STARTED,
      actor: ROLES.CAB,
      timestamp: new Date(),
    });

    await this._rideRepo.update(ride, ride_id);

    console.log(
      `[StartRide] Ride ${ride_id} started. OTP verified. Status → ${RIDE_STATUSES.IN_TRANSIT}.`,
    );

    this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
      type: RIDER_EVENTS_TYPES.STARTED,
      payload: {
        ride_id,
      },
    });

    this._socketEmitter.emitToUser(driver_id, SocketEvents.DRIVER_EVENTS, {
      type: DRIVER_EVENTS_TYPES.STARTED,
      payload: {
        ride_id,
      },
    });

    try {
      await this._notificationService.notify(
        ride.rider_id,
        NOTIFICATION_TYPES.RIDE_STARTED,
        "Ride Started",
        "Your ride has started. Sit back and enjoy the journey!",
        { ride_id, driver_id },
      );
    } catch (err) {
      console.error("[StartRideUseCase] Rider notification failed:", err);
    }

    try {
      await this._notificationService.notify(
        driver_id,
        NOTIFICATION_TYPES.RIDE_STARTED,
        "Ride Started",
        "The ride is now in progress. Have a safe trip!",
        { ride_id, rider_id: ride.rider_id },
      );
    } catch (err) {
      console.error("[StartRideUseCase] Driver notification failed:", err);
    }
  }
}
