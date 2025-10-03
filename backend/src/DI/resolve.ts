import { AuthController } from "@interfaceAdapters/controllers/auth/authController";
import { container } from "tsyringe";
import { registerDI } from "@DI/register";

registerDI();
export const authController = container.resolve(AuthController);
