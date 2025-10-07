import { AuthController } from "@interfaceAdapters/controllers/auth/authController";
import { container } from "tsyringe";
import { registerDI } from "@DI/register";
import { AuthMiddleware } from "@infrastructure/middlewares/authMiddleware";
import { AdminController } from "@interfaceAdapters/controllers/admin/adminController";

registerDI();
export const authController = container.resolve(AuthController);
export const adminController = container.resolve(AdminController);
export const authMiddleware = container.resolve(AuthMiddleware);
