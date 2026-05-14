import { CabController } from "@presentation/controllers/cab/cabController";
import { AuthController } from "presentation/controllers/auth/authController";
import { RoomVariantController } from "@presentation/controllers/roomVariant/roomVariantController";
import { container } from "tsyringe";
import { PaymentController } from "@presentation/controllers/payment/paymentController";
import { BookingController } from "@presentation/controllers/hotelBooking/BookingController";
import { NotificationController } from "@presentation/controllers/notification/notificationController";

export function registerController() {
  container.registerSingleton(AuthController, AuthController);
  container.registerSingleton(CabController, CabController);
  container.registerSingleton(RoomVariantController, RoomVariantController);
  container.registerSingleton(PaymentController, PaymentController);
  container.registerSingleton(BookingController, BookingController);
  container.registerSingleton(NotificationController, NotificationController);
}
