import { AuthController } from "presentation/controllers/auth/authController";
import { container } from "tsyringe";
import { registerDI } from "@infrastructure/DI/register";
import { AuthMiddleware } from "presentation/middlewares/authMiddleware";
import { AdminController } from "presentation/controllers/admin/adminController";
import { CabController } from "@presentation/controllers/cab/cabController";
import { HotelController } from "@presentation/controllers/hotel/hotelController";
import { RoomController } from "@presentation/controllers/room/roomController";
import { DestinationController } from "@presentation/controllers/destination/destinationCotroller";

registerDI();
export const authController = container.resolve(AuthController);
export const adminController = container.resolve(AdminController);
export const authMiddleware = container.resolve(AuthMiddleware);
export const cabController = container.resolve(CabController);
export const destinationController = container.resolve(DestinationController);
export const hotelController = container.resolve(HotelController);
export const roomController = container.resolve(RoomController);
