import { Socket } from "socket.io";
import { SocketEvents } from "@presentation/constants/socketEvents";
import { inject, injectable } from "tsyringe";
import { IDriverMatchingUseCase } from "@application/interfaces/useCase/ride/driverMatchingUseCase.interface";
import { IAcceptRideUseCase } from "@application/interfaces/useCase/ride/acceptRideUseCase.interface";
import { ICancelRideUseCase } from "@application/interfaces/useCase/ride/cancelRideUseCase.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { IQueueService } from "@application/interfaces/service/queueService.interface";

import { IDriverArrivedUseCase } from "@application/interfaces/useCase/ride/driverArrivedUseCase.interface";
import { IStartRideUseCase } from "@application/interfaces/useCase/ride/startRideUseCase.interface";
import { IEndRideUseCase } from "@application/interfaces/useCase/ride/endRideUseCase.interface";

@injectable()
export class RideEventHandler {
  constructor(
    @inject("IDriverMatchingUseCase")
    private _driverMatchingUseCase: IDriverMatchingUseCase,
    @inject("IAcceptRideUseCase")
    private _acceptRideUseCase: IAcceptRideUseCase,
    @inject("ICancelRideUseCase")
    private _cancelRideUseCase: ICancelRideUseCase,
    @inject("IQueueService")
    private _queueService: IQueueService,
    @inject("IDriverArrivedUseCase")
    private _driverArrivedUseCase: IDriverArrivedUseCase,
    @inject("IStartRideUseCase")
    private _startRideUseCase: IStartRideUseCase,
    @inject("IEndRideUseCase")
    private _endRideUseCase: IEndRideUseCase,
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

    socket.on(SocketEvents.RIDER_CANCEL_RIDE, async (data) => {
      try {
        console.log(
          `[RideEventHandler] rider:cancel-ride from ${userId}`,
          data,
        );
        if (!data.ride_id) {
          throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
        }
        await this._cancelRideUseCase.execute({
          ride_id: data.ride_id,
          user_id: userId,
        });
      } catch (error) {
        console.error("[RideEventHandler] Error handling cancel-ride:", error);
      }
    });

    socket.on(SocketEvents.DRIVER_CANCEL_RIDE, async (data, callback) => {
      try {
        console.log(
          `[RideEventHandler] driver:cancel-ride from ${userId}`,
          data,
        );
        if (!data.ride_id)
          throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
        await this._cancelRideUseCase.execute({
          ride_id: data.ride_id,
          user_id: userId,
        });
        if (typeof callback === "function") callback({ success: true });
      } catch (error) {
        console.error(
          "[RideEventHandler] Error handling driver cancel-ride:",
          error,
        );
        if (typeof callback === "function")
          callback({
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
      }
    });

    socket.on(SocketEvents.DRIVER_ARRIVED, async (data, callback) => {
      try {
        console.log(`[RideEventHandler] driver:arrived from ${userId}`, data);
        if (!data.ride_id)
          throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
        await this._driverArrivedUseCase.execute({
          ride_id: data.ride_id,
          driver_id: userId,
        });
        if (typeof callback === "function") callback({ success: true });
      } catch (error) {
        console.error(
          "[RideEventHandler] Error handling driver arrived:",
          error,
        );
        if (typeof callback === "function")
          callback({
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
      }
    });

    socket.on(SocketEvents.DRIVER_VERIFY_OTP, async (data, callback) => {
      try {
        console.log(
          `[RideEventHandler] driver:verify-otp from ${userId}`,
          data,
        );
        if (!data.ride_id || !data.otp)
          throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
        await this._startRideUseCase.execute({
          ride_id: data.ride_id,
          driver_id: userId,
          otp: data.otp,
        });
        if (typeof callback === "function") callback({ success: true });
      } catch (error) {
        console.error("[RideEventHandler] Error handling verify otp:", error);
        if (typeof callback === "function")
          callback({
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
      }
    });

    socket.on(SocketEvents.DRIVER_RIDE_COMPLETED, async (data, callback) => {
      try {
        console.log(
          `[RideEventHandler] driver:ride-completed from ${userId}`,
          data,
        );
        if (!data.ride_id)
          throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
        await this._endRideUseCase.execute({
          ride_id: data.ride_id,
          driver_id: userId,
        });
        if (typeof callback === "function") callback({ success: true });
      } catch (error) {
        console.error(
          "[RideEventHandler] Error handling ride completed:",
          error,
        );
        if (typeof callback === "function")
          callback({
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
      }
    });
  }
}
