import { IChangeEmailNewEmailRequestDTO } from "@domain/dtos/auth/changeEmail.dto";

export interface IChangeEmailNewEmailUseCase {
  execute(dto: IChangeEmailNewEmailRequestDTO): Promise<void>;
}
