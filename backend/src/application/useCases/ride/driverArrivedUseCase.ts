import { IDriverArrivedUseCase } from "@application/interfaces/useCase/ride/driverArrivedUseCase.interface";
import { IDriverArrivedRequestDTO } from "@domain/dtos/ride/driverArrived.dto";
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
export class DriverArrivedUseCase implements IDriverArrivedUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("INotificationService")
    private _notificationService: INotificationService,
  ) {}

  async execute({
    ride_id,
    driver_id,
  }: IDriverArrivedRequestDTO): Promise<void> {
    const ride = await this._rideRepo.findById(ride_id);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (ride.driver_id !== driver_id) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (ride.status !== RIDE_STATUSES.MATCHED) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    ride.status = RIDE_STATUSES.ARRIVED;
    ride.events.push({
      event_name: RIDE_EVENT_NAMES.ARRIVED,
      actor: ROLES.CAB,
      timestamp: new Date(),
    });

    await this._rideRepo.update(ride, ride_id);

    console.log(
      `[DriverArrived] Ride ${ride_id} driver arrived. Status → ${RIDE_STATUSES.ARRIVED}.`,
    );

    this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
      type: RIDER_EVENTS_TYPES.ARRIVED,
      payload: {
        ride_id,
      },
    });

    this._socketEmitter.emitToUser(driver_id, SocketEvents.DRIVER_EVENTS, {
      type: DRIVER_EVENTS_TYPES.ARRIVED,
      payload: {
        ride_id,
      },
    });

    try {
      await this._notificationService.notify(
        ride.rider_id,
        NOTIFICATION_TYPES.RIDE_ARRIVED,
        "Driver Arrived",
        "Your driver has arrived at the pickup location. Please head out!",
        { ride_id, driver_id },
      );
    } catch (err) {
      console.error("[DriverArrivedUseCase] Notification failed:", err);
    }
  }
}
