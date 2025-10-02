import { registerController } from "@DI/controller";
import { registerModel } from "@DI/model";
import { registerRepositories } from "@DI/repository";
import { registerServices } from "@DI/services";
import { registerUsecases } from "@DI/useCases";

export function registerDI() {
  registerModel();
  registerServices();
  registerRepositories();
  registerUsecases();
  registerController();
}
