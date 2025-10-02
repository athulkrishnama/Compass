import { ISignupUseCase } from "@domain/interfaces/useCase/auth/signupUseCase.interface";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCase/auth/verifyOtpUseCase.interface";
import { SignupUseCase } from "@useCases/auth/signupUseCase";
import { SignupVerifyOtpUseCase } from "@useCases/auth/signupVerifyOtpUseCase";
import { container } from "tsyringe";

export function registerUsecases() {
  container.registerSingleton<ISignupUseCase>("ISignupUseCase", SignupUseCase);
  container.registerSingleton<IVerifyOtpUseCase>(
    "IVerifyOtpUseCase",
    SignupVerifyOtpUseCase,
  );
}
