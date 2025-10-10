import { AuthController } from "presentation/controllers/auth/authController";
import { container } from "tsyringe";
import { registerDI } from "@infrastructure/DI/register";
import { AuthMiddleware } from "presentation/middlewares/authMiddleware";
import { AdminController } from "presentation/controllers/admin/adminController";

registerDI();
export const authController = container.resolve(AuthController);
export const adminController = container.resolve(AdminController);
export const authMiddleware = container.resolve(AuthMiddleware);
