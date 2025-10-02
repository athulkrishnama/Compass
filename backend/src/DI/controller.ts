import { AuthController } from "@interfaceAdapters/controllers/auth/authController";
import { container } from "tsyringe";

export function registerController() {
  container.registerSingleton(AuthController, AuthController);
}
