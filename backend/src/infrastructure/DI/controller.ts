import { CabController } from "@presentation/controllers/cab/cabController";
import { AuthController } from "presentation/controllers/auth/authController";
import { container } from "tsyringe";

export function registerController() {
  container.registerSingleton(AuthController, AuthController);
  container.registerSingleton(CabController, CabController);
}
