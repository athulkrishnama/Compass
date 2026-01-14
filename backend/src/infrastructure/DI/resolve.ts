import { AuthController } from "presentation/controllers/auth/authController";
import { container } from "tsyringe";
import { registerDI } from "@infrastructure/DI/register";
import { AuthMiddleware } from "presentation/middlewares/authMiddleware";
import { AdminController } from "presentation/controllers/admin/adminController";
import { CabController } from "@presentation/controllers/cab/cabController";
import { HotelController } from "@presentation/controllers/hotel/hotelController";

registerDI();
export const authController = container.resolve(AuthController);
export const adminController = container.resolve(AdminController);
export const authMiddleware = container.resolve(AuthMiddleware);
export const cabController = container.resolve(CabController);
export const hotelController = container.resolve(HotelController);
