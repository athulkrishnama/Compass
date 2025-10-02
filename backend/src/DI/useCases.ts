import { ISignupUseCase } from "@domain/interfaces/useCase/auth/signupUseCase.interface";
import { SignupUseCase } from "@useCases/auth/signupUseCase";
import { container } from "tsyringe";

export function registerUsecases() {
  container.registerSingleton<ISignupUseCase>("ISignupUseCase", SignupUseCase);
}
