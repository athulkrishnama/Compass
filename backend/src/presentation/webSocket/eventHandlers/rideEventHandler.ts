import { Socket } from "socket.io";
import { SocketEvents } from "@presentation/constants/socketEvents";
import { injectable } from "tsyringe";

@injectable()
export class RideEventHandler {
  registerHandlers(socket: Socket): void {
    const userId = socket.handshake.auth.userId;

    socket.on(SocketEvents.DRIVER_ACCEPT_RIDE, (data) => {
      try {
        console.log(
          `[RideEventHandler] driver:accept-ride from ${userId}`,
          data,
        );
        // TODO: Wire up AcceptRideUseCase when created
      } catch (error) {
        console.error("[RideEventHandler] Error handling accept-ride:", error);
      }
    });

    socket.on(SocketEvents.DRIVER_REJECT_RIDE, (data) => {
      try {
        console.log(
          `[RideEventHandler] driver:reject-ride from ${userId}`,
          data,
        );
        // TODO: Wire up RejectRideUseCase when created
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
        // TODO: Wire up CancelRideUseCase when created
      } catch (error) {
        console.error("[RideEventHandler] Error handling cancel-ride:", error);
      }
    });
  }
}
