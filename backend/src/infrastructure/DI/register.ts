import { registerController } from "@infrastructure/DI/controller";
import { registerModel } from "@infrastructure/DI/model";
import { registerRepositories } from "@infrastructure/DI/repository";
import { registerServices } from "@infrastructure/DI/services";
import { registerUsecases } from "@infrastructure/DI/useCases";
import { registerEventHandlers } from "./eventHandlers";

export function registerDI() {
  registerModel();
  registerServices();
  registerRepositories();
  registerUsecases();
  registerController();
  registerEventHandlers();
}
