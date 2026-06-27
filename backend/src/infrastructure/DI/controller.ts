import { CabController } from "@presentation/controllers/cab/cabController";
import { AuthController } from "presentation/controllers/auth/authController";
import { RoomVariantController } from "@presentation/controllers/roomVariant/roomVariantController";
import { container } from "tsyringe";
import { PaymentController } from "@presentation/controllers/payment/paymentController";
import { BookingController } from "@presentation/controllers/hotelBooking/BookingController";
import { NotificationController } from "@presentation/controllers/notification/notificationController";
import { WalletController } from "@presentation/controllers/wallet/walletController";
import { CabReviewController } from "@presentation/controllers/cabReview/cabReviewController";
import { HotelReviewController } from "@presentation/controllers/hotelReview/hotelReviewController";

export function registerController() {
  container.registerSingleton(AuthController, AuthController);
  container.registerSingleton(CabController, CabController);
  container.registerSingleton(RoomVariantController, RoomVariantController);
  container.registerSingleton(PaymentController, PaymentController);
  container.registerSingleton(BookingController, BookingController);
  container.registerSingleton(NotificationController, NotificationController);
  container.registerSingleton(WalletController, WalletController);
  container.registerSingleton(CabReviewController, CabReviewController);
  container.registerSingleton(HotelReviewController, HotelReviewController);
}
