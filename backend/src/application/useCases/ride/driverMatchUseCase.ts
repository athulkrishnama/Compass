import { IDriverMatchingUseCase } from "@application/interfaces/useCase/ride/driverMatchingUseCase.interface";
import { IDriverMatchingRequestDTO } from "@domain/dtos/ride/driverMatching.dto";
import { inject, injectable } from "tsyringe";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { IGeoService } from "@application/interfaces/service/geoService.interface";
import { IQueueService } from "@application/interfaces/service/queueService.interface";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { RIDE_EVENT_NAMES } from "@domain/types/rideEvent";
import { QUEUE_JOB_NAMES } from "@domain/constants/queueJobNames";
import { SocketEvents } from "@presentation/constants/socketEvents";
import { VALUES } from "@presentation/constants/values";
import { randomUUID } from "crypto";
import { ROLES } from "@domain/enums/roles";
import { Messages } from "@domain/enums/messages";

@injectable()
export class DriverMatchingUseCase implements IDriverMatchingUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("IGeoService") private _geoService: IGeoService,
    @inject("IQueueService") private _queueService: IQueueService,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
  ) {}

  async execute({
    ride_id,
    attempt_id,
  }: IDriverMatchingRequestDTO): Promise<void> {
    const ride = await this._rideRepo.findById(ride_id);
    if (!ride) {
      console.log(`[DriverMatch] Ride ${ride_id} not found, ignoring.`);
      return;
    }
    if (ride.status !== RIDE_STATUSES.SEARCHING) {
      console.log(
        `[DriverMatch] Ride ${ride_id} status is '${ride.status}', not searching. Ignoring.`,
      );
      return;
    }

    if (attempt_id && ride.attempt_id && attempt_id !== ride.attempt_id) {
      console.log(
        `[DriverMatch] Stale attempt ${attempt_id} for ride ${ride_id}. Current: ${ride.attempt_id}. Ignoring.`,
      );
      return;
    }

    const requestEvent = ride.events.find(
      (e) => e.event_name === RIDE_EVENT_NAMES.REQUESTED,
    );
    const createdAt = requestEvent
      ? new Date(requestEvent.timestamp)
      : new Date();
    const now = new Date();
    const timeElapsedMinutes =
      (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (timeElapsedMinutes > 5) {
      console.log(
        `[DriverMatch] Ride ${ride_id} exceeded 5 minutes searching. Cancelling.`,
      );
      ride.status = RIDE_STATUSES.CANCELLED;
      ride.cancelled_by = null; // Reverted to null based on schema change
      ride.events.push({
        event_name: RIDE_EVENT_NAMES.TIMED_OUT,
        actor: ROLES.ADMIN,
        timestamp: now,
      });
      await this._rideRepo.update(ride, ride_id);

      this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
        type: "no_drivers",
        payload: {
          message: Messages.DRIVER_MATCH_TIMEOUT,
        },
      });
      return;
    }
    const validDriverId = await this._geoService.getNearbyDrivers(
      ride.pickup_point,
      VALUES.DRIVER_MATCH_RADIUS_KM,
      ride.selected_fare.cab_type,
      VALUES.DRIVER_MATCH_MAX_CANDIDATES,
      ride.attempted_drivers,
    );

    if (validDriverId) {
      const newAttemptId = randomUUID();
      ride.attempt_id = newAttemptId;
      ride.attempted_drivers.push(validDriverId);
      await this._rideRepo.update(ride, ride_id);

      // Emit ride request to driver via WebSocket
      this._socketEmitter.emitToUser(
        validDriverId,
        SocketEvents.DRIVER_EVENTS,
        {
          type: "requested",
          payload: {
            ride_id,
            fare: ride.selected_fare,
            pickup: ride.pickup_point,
            dropoff: ride.dropoff_point,
            distance: ride.distance,
            time: ride.time,
          },
        },
      );
      console.log(
        `[DriverMatch] Ride ${ride_id} → requesting driver ${validDriverId} (attempt: ${newAttemptId})`,
      );

      await this._queueService.addDelayedJob(
        QUEUE_JOB_NAMES.DRIVER_MATCH_TIMEOUT,
        {
          ride_id,
          attempt_id: newAttemptId,
          driver_id: validDriverId,
        },
        VALUES.DRIVER_MATCH_TIMEOUT_DELAY,
      );
    } else {
      const now = new Date();

      ride.status = RIDE_STATUSES.CANCELLED;
      ride.cancelled_by = null;
      ride.events.push({
        event_name: RIDE_EVENT_NAMES.TIMED_OUT,
        actor: ROLES.ADMIN,
        timestamp: now,
      });
      await this._rideRepo.update(ride, ride_id);

      console.log(
        `[DriverMatch] Ride ${ride_id} → no drivers found. Cancelled.`,
      );

      this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
        type: "no_drivers",
        payload: {
          message: Messages.NO_DRIVERS_AVAILABLE,
        },
      });
    }
  }
}
