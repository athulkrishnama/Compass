import { AuthController } from "presentation/controllers/auth/authController";
import { container } from "tsyringe";

export function registerController() {
  container.registerSingleton(AuthController, AuthController);
}
