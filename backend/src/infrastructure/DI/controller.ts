import { CabController } from "@presentation/controllers/cab/cabController";
import { AuthController } from "presentation/controllers/auth/authController";
import { RoomVariantController } from "@presentation/controllers/roomVariant/roomVariantController";
import { container } from "tsyringe";
import { PaymentController } from "@presentation/controllers/payment/paymentController";

export function registerController() {
  container.registerSingleton(AuthController, AuthController);
  container.registerSingleton(CabController, CabController);
  container.registerSingleton(RoomVariantController, RoomVariantController);
  container.registerSingleton(PaymentController, PaymentController);
}
