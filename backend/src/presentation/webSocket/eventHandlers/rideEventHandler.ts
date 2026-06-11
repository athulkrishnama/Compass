import { Socket } from "socket.io";
import { SocketEvents } from "@presentation/constants/socketEvents";
import { inject, injectable } from "tsyringe";
import { IDriverMatchingUseCase } from "@application/interfaces/useCase/ride/driverMatchingUseCase.interface";
import { IAcceptRideUseCase } from "@application/interfaces/useCase/ride/acceptRideUseCase.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { IQueueService } from "@application/interfaces/service/queueService.interface";

@injectable()
export class RideEventHandler {
  constructor(
    @inject("IDriverMatchingUseCase")
    private _driverMatchingUseCase: IDriverMatchingUseCase,
    @inject("IAcceptRideUseCase")
    private _acceptRideUseCase: IAcceptRideUseCase,
    @inject("IQueueService")
    private _queueService: IQueueService,
  ) {}
  registerHandlers(socket: Socket): void {
    const userId = socket.handshake.auth.userId;

    socket.on(SocketEvents.DRIVER_ACCEPT_RIDE, async (data) => {
      try {
        console.log(
          `[RideEventHandler] driver:accept-ride from ${userId}`,
          data,
        );
        if (!data.ride_id || !data.attempt_id) {
          throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
        }
        await this._acceptRideUseCase.execute({
          ride_id: data.ride_id,
          rider_id: userId,
          attempt_id: data.attempt_id,
        });
      } catch (error) {
        console.error("[RideEventHandler] Error handling accept-ride:", error);
      }
    });

    socket.on(SocketEvents.DRIVER_REJECT_RIDE, async (data) => {
      try {
        console.log(
          `[RideEventHandler] driver:reject-ride from ${userId}`,
          data,
        );
        if (!data.ride_id || !data.attempt_id) {
          throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
        }
        await this._driverMatchingUseCase.execute({
          ride_id: data.ride_id,
          attempt_id: data.attempt_id,
        });
        await this._queueService.removeJob(data.attempt_id);
      } catch (error) {
        console.error("[RideEventHandler] Error handling reject-ride:", error);
      }
    });

    socket.on(SocketEvents.RIDER_CANCEL_RIDE, (data) => {
      try {
        console.log(
          `[RideEventHandler] rider:cancel-ride from ${userId}`,
          data,
        );
      } catch (error) {
        console.error("[RideEventHandler] Error handling cancel-ride:", error);
      }
    });
  }
}
