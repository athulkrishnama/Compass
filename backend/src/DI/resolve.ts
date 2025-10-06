import { AuthController } from "@interfaceAdapters/controllers/auth/authController";
import { container } from "tsyringe";
import { registerDI } from "@DI/register";
import { AuthMiddleware } from "@infrastructure/middlewares/authMiddleware";

registerDI();
export const authController = container.resolve(AuthController);
export const authMiddleware = container.resolve(AuthMiddleware);
