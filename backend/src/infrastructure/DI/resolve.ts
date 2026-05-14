import { AuthController } from "presentation/controllers/auth/authController";
import { container } from "tsyringe";
import { registerDI } from "@infrastructure/DI/register";
import { AuthMiddleware } from "presentation/middlewares/authMiddleware";
import { AdminController } from "presentation/controllers/admin/adminController";
import { CabController } from "@presentation/controllers/cab/cabController";
import { HotelController } from "@presentation/controllers/hotel/hotelController";
import { RoomVariantController } from "@presentation/controllers/roomVariant/roomVariantController";
import { DestinationController } from "@presentation/controllers/destination/destinationCotroller";
import { PaymentController } from "@presentation/controllers/payment/paymentController";
import { WebHookController } from "@presentation/controllers/webhook/webhookController";
import { BookingController } from "@presentation/controllers/hotelBooking/BookingController";
import { NotificationController } from "@presentation/controllers/notification/notificationController";
import { RideController } from "@presentation/controllers/ride/rideController";
import { LocationEventHandler } from "@presentation/webSocket/eventHandlers/locationEventHandler";
import { RideEventHandler } from "@presentation/webSocket/eventHandlers/rideEventHandler";
import { SocketAuth } from "@presentation/middlewares/socketAuth";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { ICacheService } from "@application/interfaces/service/cacheService.interface";

registerDI();
export const authController = container.resolve(AuthController);
export const adminController = container.resolve(AdminController);
export const authMiddleware = container.resolve(AuthMiddleware);
export const cabController = container.resolve(CabController);
export const destinationController = container.resolve(DestinationController);
export const hotelController = container.resolve(HotelController);
export const roomVariantController = container.resolve(RoomVariantController);
export const paymentController = container.resolve(PaymentController);
export const webhookController = container.resolve(WebHookController);
export const bookingController = container.resolve(BookingController);
export const notificationController = container.resolve(NotificationController);
export const rideController = container.resolve(RideController);
export const locationEventHandler = container.resolve<LocationEventHandler>(
  "LocationEventHandler",
);
export const rideEventHandler =
  container.resolve<RideEventHandler>("RideEventHandler");
export const socketAuth = container.resolve(SocketAuth);
export const socketEmitter =
  container.resolve<ISocketEmitter>("ISocketEmitter");
export const cacheService = container.resolve<ICacheService>("ICacheService");
