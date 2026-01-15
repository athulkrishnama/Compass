import { CabController } from "@presentation/controllers/cab/cabController";
import { AuthController } from "presentation/controllers/auth/authController";
import { RoomController } from "@presentation/controllers/room/roomController";
import { container } from "tsyringe";

export function registerController() {
  container.registerSingleton(AuthController, AuthController);
  container.registerSingleton(CabController, CabController);
  container.registerSingleton(RoomController, RoomController);
}
