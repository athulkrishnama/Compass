import { ICreateUserRequestDTO } from "@domain/dtos/auth/createUser.dto";

export interface ISignupUseCase {
  signup(userData: ICreateUserRequestDTO): Promise<void>;
}
